#!/usr/bin/env python3
"""
SportSnap — relight pass.

Takes a matted athlete cutout and relights it to match a specific backdrop,
returning a cutout with a transparent background (so the code layer keeps
full control of placement).

This is the step that fixes the "pasted on" look: the subject was photographed
under different light than the plate they're composited into, and the eye
catches that instantly.

The prompt is deliberately narrow: change the LIGHT on the subject, never the
subject. Identity, pose, kit, and jersey markings must survive untouched.

Usage:
  python3 scripts/relight.py \
      --cutout public/cutout_cc/renan-sprint.png \
      --out public/cutout_lit/renan-sprint.png \
      --scene "floodlit night stadium, cool key light from upper left, warm bounce from the pitch"
"""
import argparse, base64, json, mimetypes, os, sys, urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from budget import Ledger, BudgetExceeded  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent

PROMPT = """This is a cut-out photograph of a real soccer player on a transparent background.

RELIGHT this subject so they look photographed in the following scene: {scene}

Specifically:
- Add a cool, bright rim/edge light along the silhouette (shoulders, arm, head, trailing leg) consistent with stadium floodlights behind and above.
- Deepen the shadow side so the form has dramatic contrast rather than flat, even daylight.
- Add a subtle warm bounce on the lower legs and shorts, as if reflected from the lit grass.
- Colour-grade the subject to sit in a cool, high-contrast, cinematic night palette. Remove any residual purple or magenta cast; the white kit must read as clean white and skin tones must look natural and healthy.

ABSOLUTELY DO NOT CHANGE:
- the person's face, identity, skin tone, hair, body shape or pose
- the design, colour, or lettering of the kit — the jersey number and any wordmark must remain exactly as they are
- the outline/silhouette of the subject

Do not add any background, scenery, text, logos or graphics. Output ONLY the relit subject on a fully transparent background, same framing and crop as the input."""


def load_key() -> str:
    env = ROOT / ".env.local"
    if env.exists():
        for line in env.read_text().splitlines():
            if line.strip().startswith("GEMINI_API_KEY="):
                return line.split("=", 1)[1].strip()
    k = os.environ.get("GEMINI_API_KEY")
    if not k:
        sys.exit("No GEMINI_API_KEY found.")
    return k


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--cutout", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--scene", default="a floodlit football stadium at night, cool white key light from above and behind, deep shadows, atmospheric haze")
    ap.add_argument("--model", default="gemini-2.5-flash-image")
    args = ap.parse_args()

    src = (ROOT / args.cutout) if not os.path.isabs(args.cutout) else Path(args.cutout)
    if not src.exists():
        sys.exit(f"not found: {src}")
    dst = (ROOT / args.out) if not os.path.isabs(args.out) else Path(args.out)
    dst.parent.mkdir(parents=True, exist_ok=True)

    ledger = Ledger()
    try:
        ledger.check()
    except BudgetExceeded as e:
        sys.exit(f"BLOCKED by spend guardrail: {e}")
    print(f"   [budget] before call: {ledger.summary()}")

    mime = mimetypes.guess_type(str(src))[0] or "image/png"
    payload = {"contents": [{"parts": [
        {"text": PROMPT.format(scene=args.scene)},
        {"inline_data": {"mime_type": mime, "data": base64.b64encode(src.read_bytes()).decode()}},
    ]}]}

    url = (f"https://generativelanguage.googleapis.com/v1beta/models/"
           f"{args.model}:generateContent?key={load_key()}")
    req = urllib.request.Request(url, data=json.dumps(payload).encode(),
                                 headers={"Content-Type": "application/json"}, method="POST")
    print(f"→ relight {src.name}")
    try:
        with urllib.request.urlopen(req, timeout=300) as r:
            body = json.loads(r.read())
    except urllib.error.HTTPError as e:
        raw = e.read().decode()
        if e.code == 429:
            sys.exit("HTTP 429 — no spend recorded.\n" + raw[:400])
        sys.exit(f"HTTP {e.code}: {raw[:1000]}")

    ledger.record(args.model)

    for cand in body.get("candidates", []):
        for part in cand.get("content", {}).get("parts", []):
            blob = part.get("inlineData") or part.get("inline_data")
            if blob and blob.get("data"):
                dst.write_bytes(base64.b64decode(blob["data"]))
                print(f"✅ {dst} ({dst.stat().st_size // 1024}KB)")
                return
            if part.get("text"):
                print(f"   [model] {part['text'][:250]}")
    sys.exit("⚠️  no image returned")


if __name__ == "__main__":
    main()

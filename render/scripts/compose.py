#!/usr/bin/env python3
"""
SportSnap — AI environment + relight pass.

Takes a matted athlete cutout and asks Gemini's image model to place them in a
dramatic, broadcast-style environment WITH lighting integration (rim light,
colour grade, contact shadow) so the subject reads as photographed in the scene
rather than pasted onto it.

Deliberately does NOT ask the model for text or logos — those are rendered by
the code layer afterwards so branding is pixel-exact. See CLAUDE.md
"Visual quality strategy".

Usage:
  python3 scripts/compose.py --cutout public/cutout_cc/renan-standing.png \
      --out public/generated/standing-env.png [--model gemini-3-pro-image]
"""
import argparse, base64, json, mimetypes, os, sys, urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from budget import Ledger, BudgetExceeded  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent


def load_key() -> str:
    env = ROOT / ".env.local"
    if env.exists():
        for line in env.read_text().splitlines():
            line = line.strip()
            if line.startswith("GEMINI_API_KEY="):
                return line.split("=", 1)[1].strip()
    k = os.environ.get("GEMINI_API_KEY")
    if not k:
        sys.exit("No GEMINI_API_KEY found (checked render/.env.local and env).")
    return k


DEFAULT_PROMPT = """You are compositing a sports poster background for a college soccer graphic.

The provided image is a cut-out photograph of a real soccer player on a transparent background. Keep this athlete EXACTLY as they are — do not alter their face, body, pose, skin tone, hair, or uniform in any way. Their identity and likeness must be preserved perfectly.

Your job is only to:
1. Place them into a dramatic, cinematic night-match stadium environment: floodlit pitch, deep shadows, atmospheric haze, stadium stands falling off into darkness with bokeh light points, shallow depth of field so the background is softly out of focus.
2. Integrate the lighting so the athlete looks genuinely photographed in that scene — add a cool rim/edge light along their silhouette consistent with stadium floodlights behind them, subtle warm fill from the front, and a soft contact shadow on the grass beneath their feet.
3. Colour-grade the whole frame into a cohesive, slightly desaturated, high-contrast broadcast look. Correct any residual purple/magenta cast on the athlete so their white kit reads as clean white and their skin tone looks natural.
4. Leave generous negative space above and around the athlete — this is a poster background and large typography will be overlaid later.

Do NOT add any text, letters, numbers, words, logos, badges, watermarks, or graphic overlays of any kind. Photographic content only. Vertical 4:5 portrait composition."""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--cutout", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--model", default="gemini-3-pro-image")
    ap.add_argument("--prompt", default=None)
    args = ap.parse_args()

    src = (ROOT / args.cutout) if not os.path.isabs(args.cutout) else Path(args.cutout)
    if not src.exists():
        sys.exit(f"cutout not found: {src}")

    dst = (ROOT / args.out) if not os.path.isabs(args.out) else Path(args.out)
    dst.parent.mkdir(parents=True, exist_ok=True)

    mime = mimetypes.guess_type(str(src))[0] or "image/png"
    payload = {
        "contents": [{
            "parts": [
                {"text": args.prompt or DEFAULT_PROMPT},
                {"inline_data": {"mime_type": mime,
                                 "data": base64.b64encode(src.read_bytes()).decode()}},
            ]
        }]
    }

    # ── spend guardrail: refuse to fire if we're at any cap ──────────────
    ledger = Ledger()
    try:
        ledger.check()
    except BudgetExceeded as e:
        sys.exit(f"BLOCKED by local spend guardrail: {e}")
    print(f"   [budget] before call: {ledger.summary()}")

    url = (f"https://generativelanguage.googleapis.com/v1beta/models/"
           f"{args.model}:generateContent?key={load_key()}")
    req = urllib.request.Request(
        url, data=json.dumps(payload).encode(),
        headers={"Content-Type": "application/json"}, method="POST")

    print(f"→ {args.model}  ({src.name}, {src.stat().st_size//1024}KB)")
    try:
        with urllib.request.urlopen(req, timeout=300) as r:
            body = json.loads(r.read())
    except urllib.error.HTTPError as e:
        raw = e.read().decode()
        # a 429 costs nothing, so don't charge it against the ledger
        if e.code == 429:
            sys.exit("HTTP 429 (quota/billing not active yet) — no spend recorded.\n"
                     + raw[:600])
        sys.exit(f"HTTP {e.code}: {raw[:1500]}")

    ledger.record(args.model)

    saved = 0
    for cand in body.get("candidates", []):
        for part in cand.get("content", {}).get("parts", []):
            blob = part.get("inlineData") or part.get("inline_data")
            if blob and blob.get("data"):
                dst.write_bytes(base64.b64decode(blob["data"]))
                print(f"✅ wrote {dst}  ({dst.stat().st_size//1024}KB)")
                saved += 1
            elif part.get("text"):
                print(f"   [model text] {part['text'][:400]}")
    if not saved:
        print("⚠️  no image returned. raw response head:")
        print(json.dumps(body, indent=2)[:1500])
        sys.exit(1)


if __name__ == "__main__":
    main()

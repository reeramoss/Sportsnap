#!/usr/bin/env python3
"""
SportSnap — backdrop generator.

Generates an EMPTY stadium/arena plate at the right aspect ratio, with no
subject in it. The athlete cutout is composited in afterwards by the code
layer, which is what gives us:

  - exact control over placement, scale and negative space for typography
  - the athlete's likeness and jersey preserved pixel-perfect (never regenerated)
  - reusable plates: one backdrop serves many graphics, so cost amortises

This replaces the earlier "put this person in a scene" approach, which
produced beautiful lighting but uncontrollable framing (it cropped tight to
the subject and left no room for type).

Usage:
  python3 scripts/backdrop.py --preset night-stadium --out public/plates/ai-night.png
  python3 scripts/backdrop.py --list
"""
import argparse, base64, json, os, sys, urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from budget import Ledger, BudgetExceeded  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent

COMMON = (
    "Vertical 4:5 portrait aspect ratio. Photographic, shot on a fast prime lens, "
    "shallow depth of field. Cinematic colour grade, high contrast, deep shadows. "
    "IMPORTANT: absolutely NO people, NO players, NO figures, NO text, NO letters, "
    "NO numbers, NO logos, NO badges, NO watermarks anywhere in the image. "
    "Leave the centre and upper area relatively clean and uncluttered — large "
    "typography will be overlaid there later. Empty scene only."
)

PRESETS = {
    "night-stadium": (
        "An empty floodlit football stadium pitch at night, viewed from pitch level. "
        "Brilliant floodlights flaring from the upper edge, volumetric light haze, "
        "out-of-focus crowd stands falling away into darkness with scattered bokeh "
        "points of light. Rich green grass in the foreground catching the light, "
        "mowing stripes visible. Moody, dramatic, broadcast-quality. " + COMMON
    ),
    "tunnel": (
        "The dark players' tunnel of a football stadium, looking out toward a "
        "brilliantly lit pitch. Heavy shadow framing the edges, intense light "
        "spilling in from the far end, atmospheric dust and haze in the light beams. "
        "Moody and cinematic. " + COMMON
    ),
    "smoke-dark": (
        "An abstract dark sports backdrop: deep charcoal and midnight blue, drifting "
        "atmospheric smoke and haze lit from above by a hard directional light, "
        "faint volumetric god-rays, subtle floating dust particles catching the light. "
        "Minimal, moody, premium. " + COMMON
    ),
    "golden-pitch": (
        "An empty football pitch at golden hour, low warm sun raking across the grass "
        "from the side, long shadows, warm haze, stadium stands soft and out of focus "
        "in the background. Warm, epic, cinematic. " + COMMON
    ),
}


def load_key() -> str:
    env = ROOT / ".env.local"
    if env.exists():
        for line in env.read_text().splitlines():
            if line.strip().startswith("GEMINI_API_KEY="):
                return line.split("=", 1)[1].strip()
    k = os.environ.get("GEMINI_API_KEY")
    if not k:
        sys.exit("No GEMINI_API_KEY found (render/.env.local or env).")
    return k


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--preset", default="night-stadium")
    ap.add_argument("--out", default=None)
    ap.add_argument("--model", default="gemini-2.5-flash-image")
    ap.add_argument("--prompt", default=None, help="override the preset prompt")
    ap.add_argument("--list", action="store_true")
    args = ap.parse_args()

    if args.list:
        for k in PRESETS:
            print(f"  {k}")
        return

    prompt = args.prompt or PRESETS.get(args.preset)
    if not prompt:
        sys.exit(f"unknown preset '{args.preset}'. --list to see options.")

    out = args.out or f"public/plates/ai-{args.preset}.png"
    dst = (ROOT / out) if not os.path.isabs(out) else Path(out)
    dst.parent.mkdir(parents=True, exist_ok=True)

    ledger = Ledger()
    try:
        ledger.check()
    except BudgetExceeded as e:
        sys.exit(f"BLOCKED by spend guardrail: {e}")
    print(f"   [budget] before call: {ledger.summary()}")

    payload = {"contents": [{"parts": [{"text": prompt}]}]}
    url = (f"https://generativelanguage.googleapis.com/v1beta/models/"
           f"{args.model}:generateContent?key={load_key()}")
    req = urllib.request.Request(
        url, data=json.dumps(payload).encode(),
        headers={"Content-Type": "application/json"}, method="POST")

    print(f"→ {args.model}  preset='{args.preset}'")
    try:
        with urllib.request.urlopen(req, timeout=300) as r:
            body = json.loads(r.read())
    except urllib.error.HTTPError as e:
        raw = e.read().decode()
        if e.code == 429:
            sys.exit("HTTP 429 (quota) — no spend recorded.\n" + raw[:500])
        sys.exit(f"HTTP {e.code}: {raw[:1200]}")

    ledger.record(args.model)

    for cand in body.get("candidates", []):
        for part in cand.get("content", {}).get("parts", []):
            blob = part.get("inlineData") or part.get("inline_data")
            if blob and blob.get("data"):
                dst.write_bytes(base64.b64decode(blob["data"]))
                print(f"✅ {dst}  ({dst.stat().st_size // 1024}KB)")
                return
            if part.get("text"):
                print(f"   [model] {part['text'][:300]}")
    sys.exit("⚠️  no image returned")


if __name__ == "__main__":
    main()

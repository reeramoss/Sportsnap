# SportSnap — Project Context

**App name: SportSnap** (confirmed 2026-07-27, set in `app/app.json`).

## The idea
A fast-turnaround, done-for-you social media graphic design service targeting two buyer segments in the sports world:
- **Individual players/athletes**: highlight graphics, commitment/signing announcements, senior night graphics — one-off, event-driven purchases.
- **Clubs / athletic departments (primary wedge)**: small-budget programs (NAIA, D2, D3) that need constant social content across many teams but have no in-house design staff — sold as a recurring retainer, not a one-off.

## Hypothesis on competitive edge
Named competitors (Box Out Sports, Postgame) are self-serve tools. The working hypothesis is that **speed + dead-simple usability**, delivered as a done-for-you service rather than another tool to learn, is the wedge — competing against self-serve SaaS with a concierge model. This is being validated in `research/` before committing.

## Founder's unfair advantage
Grew up playing competitive soccer in Brazil (incl. a year in Palmeiras' U-11 futsal squad), earned a full athletic scholarship to play college soccer in the US (Lindsey Wilson University, NAIA), and still holds real relationships in the NAIA soccer ecosystem. This gives credible first-customer access (coaches, athletic departments, players) without cold outreach, and firsthand understanding of both the Brazilian and American soccer/recruiting worlds.

Note: this idea shares almost the exact same buyer/distribution channel as a second, related idea already being evaluated — a player recruiting profile/"passport" product sold direct to players and parents. The two may cross-sell later.

## Strategic sequencing (per founder's plan)
This is being built and validated as the **first** of several venture bets tracked under `~/venture-radar/projects/`. Approach for each: research → define edge → build → business/legal setup → GTM → launch → iterate → move to next idea. Adjustments made here should inform how the next idea (player passport) is run.

## Roadmap phases
1. **Competitive landscape research** (in progress — see `research/`) — map existing players (business model, pricing, revenue signals, target audience, active users, reviews/sentiment across Reddit, X/Twitter, review sites, Instagram) to pressure-test the speed+simplicity edge hypothesis and find real gaps.
2. **Define the actual differentiated edge** based on what research turns up (may not be exactly "speed + simplicity" — could be repositioned once competitor gaps are clear).
3. **Build** — MVP production workflow/tooling.
4. **Business setup** — launching as a Brazilian company (founder already has a CNPJ), selling worldwide. Legal/fiscal/invoicing-for-international-customers considerations live in `business/`.
5. **Go-to-market** — grounded in patterns pulled from real Starter Story founder case studies (common threads across successful bootstrapped GTMs), tracked in `gtm/`.

## Folder map
- `research/` — competitor deep-dives + market scan (this phase's output)
- `business/` — Brazilian entity/legal/fiscal/invoicing setup notes (later phase)
- `gtm/` — go-to-market research and plan (later phase)
- `assets/` — brand/creative assets once we're building
- `app/` — Expo/React Native mobile app (input flow)
- `render/` — Remotion service: static graphic + motion template rendering. Real source assets live in `render/public/` (`athlete/`, `venue/`, `brand/`, `reference/`).

## Delivery channels the product must eventually support
Founder's stated requirement (2026-08-11) — deliverables need to reach users through **three** channels, chosen by segment:
1. **WhatsApp** — for international/LATAM users and general convenience.
2. **SMS/text message** — explicitly called out as the channel American college athletes actually use most. Important for the individual-athlete segment.
3. **Web login** — for organizations (schools, clubs, athletic departments) that need an account, history, and multi-user access.

Implication for architecture: rendering must be decoupled from delivery (render → store → dispatch via channel adapter), and the individual-athlete flow should not *require* creating an account, since SMS/WhatsApp delivery implies a low-friction, no-login path. This is a differentiator vs. D1Graphics/Commitment Edits, which both deliver only via one-off email attachment.

## Visual quality strategy (the hard problem)
Benchmark: must be **better than both D1Graphics and Commitment Edits**, pushing toward broadcast-tier. Founder explicitly authorized spending on assets/AI services to get there — do not settle for what free/code-only can produce.

Diagnosis of what actually creates the quality gap (four separate layers, different solutions each):
1. **Cutout/matting quality** — clean edges, hair, motion blur. Solution: BiRefNet (SOTA matting) or Photoroom API. Cheap/solved.
2. **Lighting + color integration** — the layer that makes a composite look photographed rather than pasted. Rim light, color grade to match scene, contact shadows. Best solved with AI image editing.
3. **Environment/background** — dramatic stadium atmosphere, volumetric light, depth of field. AI-generated or licensed stock.
4. **Type craft** — chrome/bevel/extrude AND the typeface itself. Anton (free Google font) is a visible ceiling; a licensed premium athletic display face is a real differentiator.

**Chosen architecture:** real athlete photo → AI cutout → AI-generated/relit environment → **code layer overlays exact text + real logo file**. Never AI-generate the athlete (likeness accuracy) or the school logo (trademark accuracy must be pixel-exact). This hybrid gets AI's atmospheric quality *and* exact branding; competitors' manual Photoshop gets one or the other and never in under a minute.

**Honest calibration:** beating D1Graphics/Commitment Edits (template-based, modest craft, 2-3 day manual turnaround) is very achievable. Beating true bespoke artists (e.g. the @oedup / @labres.gfx Instagram accounts the founder shared) at per-piece artistry is a much higher bar. The decisive win is consistently excellent output in seconds + motion + exact branding, not out-arting a skilled human on a single image.

## Dev environment & how to run the app (step by step)

The app lives in `app/` (Expo/React Native, pinned to **SDK 54** — this must match whatever SDK the App Store's Expo Go build currently supports; if a future `expo install expo@X` bump causes a "Project is incompatible with this version of Expo Go" error again, downgrade back to whatever SDK the installed Expo Go app supports, then run `npx expo install --fix`).

**One-time setup (already done on Renan's Mac):** Homebrew, Node.js, Watchman installed via Homebrew; "Expo Go" app installed on his iPhone from the App Store.

**Every time you want to see the app on your phone:**
1. Open a terminal window/tab.
2. Type `cd ~/venture-radar/projects/sports-graphics-service/app` and press Return.
3. Type `npm start` and press Return.
4. Wait a few seconds — a QR code will appear in the terminal.
5. On your phone, open the **Expo Go app itself** (not the Camera app — scanning with Camera app can give a "no usable data found" error since it doesn't always recognize Expo's link type).
6. In Expo Go, tap **"Scan QR code"** and point your phone at the QR code in the terminal.
7. The app should load on your phone.

**To stop the server** (e.g. before restarting after a code/config change):
1. Click inside the terminal window running the server so it's focused.
2. Hold the **Control** key and press **C** once (written as "Ctrl+C") — this stops the running process.
3. You'll see the terminal return to a normal prompt ending in `%`.
4. Run `npm start` again when ready.

**If a new terminal tab says `command not found: npm`:** that tab's shell hasn't loaded Homebrew's PATH yet. Run `source ~/.zshrc` first, then retry — this was a one-time gap that's now fixed in `~/.zshrc`/`~/.zprofile` going forward, but pre-existing open tabs won't pick it up automatically.

## Source assets & the image pipeline (working state)

**Photo source:** Lindsey Wilson College's Flickr — `flickr.com/photos/lindseywilsoncollege`. Relevant albums: `72157710601251447` and `72157710818582377`. Renan is the player in the **white #7 kit** (confirmed by founder).

**Getting high-res off Flickr (non-obvious):** filenames encode the photo ID and secret (`{id}_{secret}_z.jpg`, where `_z` = 640px). Sizes up to `_b` (1024px) can be constructed directly as `https://live.staticflickr.com/65535/{id}_{secret}_{size}.jpg`. **Sizes above 1024px use a *different* secret**, so `_h`/`_k`/`_3k`…`_6k` URLs cannot be constructed — you must fetch `https://www.flickr.com/photos/lindseywilsoncollege/{id}/sizes/{size}/` and scrape the real `live.staticflickr.com` URL out of the HTML. Doing this yielded **6144×4096** originals (vs. the 640px versions originally downloaded) — a ~9.6× linear quality jump. Anything less than this is not good enough for 1080×1350 output.

**Copyright note (real business consideration, not a blocker for prototyping):** these photos belong to Lindsey Wilson College / their staff photographer. Fine for internal prototyping and quality benchmarking. Before using any of them in public marketing, the app store listing, or customer-facing samples, get written permission from LWU athletics — cheap to ask, expensive to skip.

**Pipeline steps that work today (local, free, no API):**
1. **Matting** — `rembg` with the `birefnet-general` model (~973MB, auto-downloads to `~/.u2net/`). Run at ~2600px max dimension, then `getbbox()`-crop to trim transparent margins. Output quality is genuinely production-grade: clean edges, individual hair strands hold.
2. **White balance** — white-patch correction driven by the brightest opaque pixels (the white kit as a white reference). Only a *partial* fix: these photos were shot under night stadium lights with a heavy purple/magenta cast that sits in the midtones, so gains come out mild. Expect the AI relighting step to do the real work here.

**Known limitations found:**
- **Matting removes background, it does not isolate a single person.** Multi-player frames (e.g. `renan-onball`) come back with teammates and opponents still attached. Solo hero graphics need a crop-to-subject step *before* matting.
- Best solo cutout candidate by a wide margin: `renan-action-standing` (isolated, side-on, clean separation). `renan-headshot` is cleanest overall but is a portrait, not an action pose.

**Folder layout under `render/public/`:** `athlete/` (originals + `-hi.jpg` 6k versions), `cutout/` (matted PNGs), `cutout_cc/` (matted + white-balanced), `venue/`, `brand/`, `reference/`.

## Status log
- 2026-07-27 — Project scaffolded. Competitive research kicked off (3 parallel research passes: Box Out Sports deep-dive, Postgame deep-dive, broader market/Reddit/Twitter sentiment scan).
- 2026-07-27 — Research complete (4 reports in `research/`: boxout-sports.md, postgame.md, gipper.md, market-scan.md, plus `executive-summary.md`). Key pivot: "Postgame" was a name collision (real analog is Gipper). "Speed + simplicity" as the headline edge does not hold up — both Gipper and Box Out already own that claim and are entrenched in the NAIA/D2/D3 segment (Gipper sponsors BOSCA, Box Out is NAIA/NJCAA's official partner). Reframed edge: **delegation + reliable turnaround + price fit** ("we do it for you, without a $500+/year contract") — competing against staff bandwidth and unreliable Fiverr/Upwork freelancers, not against the self-serve tools' UX. Individual-athlete segment confirmed open (neither major competitor touches it). Next step before building: direct conversations with a handful of real small-school SIDs/ADs to validate this reframed positioning.
- 2026-07-27 — Decided to build now regardless of validation status: founder's current priority is the experience of building, not market share (documented explicitly — don't reintroduce "validate first" pushback unless asked). Stack: Expo (React Native, SDK 54 — must match whatever SDK the App Store's Expo Go build currently supports) + Supabase (planned, not yet wired) + RevenueCat (planned, not yet wired) + hybrid generation approach (AI composes from photos/brief, code overlays exact logo/colors/text from brand profile — chosen over pure AI-gen or pure template-fill). Founder plans to seed the template/reference library by purchasing existing sports graphic template packs (e.g. from Etsy/Gumroad, per `research/market-scan.md`) rather than designing templates from scratch. Dev environment fully set up (Homebrew, Node, Watchman, Expo Go on founder's iPhone) — see the "Dev environment & how to run the app" section above for exact run steps. Build order agreed: input-flow UI first (no accounts needed), then wire Supabase, then wire OpenAI Whisper transcription + the actual hybrid image generation, then credits/tiers/payments last.
- 2026-07-27 — First real screens built: `NewRequestScreen` (photo upload with expo-image-picker, sport picker, art-type picker, text brief + voice-note recording via expo-audio) and `ProfileScreen` (logo upload, club/university name, website/Instagram field with an "Auto-fill" button currently stubbed as "coming soon", primary/secondary color fields). App.tsx wires these into a simple two-tab switcher (no navigation library yet — deliberately deferred until there are enough screens to justify one, e.g. expo-router). Nothing is wired to a backend yet — submit/save actions only log locally and show a confirmation alert. Business name not yet finalized (app.json currently says "Sports Graphics (working title)").
- 2026-08-11 — App name confirmed as **SportSnap**. Founder wants a hybrid product: static graphics (as planned) plus real motion/video content for Stories, aiming to get as close as possible to broadcast-quality sports motion graphics. Architecture decision: not pure AI video generation (unreliable for exact typography/branding) — instead a **template + compositing pipeline**. Set up `render/` as a separate Remotion (React/TypeScript, server-side MP4 rendering) service; built and successfully rendered a first proof-of-concept portrait (1080x1920) animated template (`render/src/SportsTemplate.tsx`) — confirms the mechanism works end to end. Motion-template/VFX sourcing research (where to license real templates, Remotion compatibility) still in progress.
- 2026-08-11 — Deep-dive on two new competitors the founder found directly: **D1Graphics** (d1graphics.co) and **Commitment Edits** (commitmentedits.com) — full report in `research/d1graphics-commitmentedits.md`. Confirmed independent companies (different LLCs/founders), not related despite similar naming. Both are individual-athlete recruiting/commitment-graphic services, **manual/human-executed** (own FAQs confirm 2-3 day standard turnaround, 24hr/same-day sold as a paid expedite, no live preview, delivery via one-off email) — validates the founder's "these are done by hand" read. Pricing: D1Graphics $40 base (+add-ons), Commitment Edits $30 flat. Neither has a real motion/video product (both just bolt a templated intro clip onto a static image) and neither has any findable independent reviews. Key positioning implication: default fast turnaround (not an upsell) + a genuine motion/video product + broader catalog are the clearest, most provable differentiators against this specific competitor set.

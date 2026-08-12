import { AbsoluteFill, Img, staticFile } from "remotion";
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadBarlow } from "@remotion/google-fonts/BarlowCondensed";

const { fontFamily: anton } = loadAnton();
const { fontFamily: barlow } = loadBarlow();

export type V2Props = {
  headline: string;
  athleteName: string;
  schoolName: string;
  details: string;
  /** small caps line under the headline, e.g. "NAIA · MID-SOUTH CONFERENCE" */
  kicker: string;
  primaryColor: string;
  secondaryColor: string;
  /** pre-graded background plate (real stadium photography) */
  platesSrc: string;
  /** matted athlete PNG */
  cutoutSrc: string;
};

export const defaultV2Props: V2Props = {
  headline: "COMMITTED",
  athleteName: "RENAN RAMOS",
  schoolName: "LINDSEY WILSON",
  details: "MIDFIELDER · #7",
  kicker: "NAIA · MID-SOUTH CONFERENCE",
  primaryColor: "#0B5CB5",
  secondaryColor: "#F2C230",
  platesSrc: "plates/stadium-night.jpg",
  cutoutSrc: "cutout_cc/renan-standing.png",
};

const f = (s: string) => (s.startsWith("http") ? s : staticFile(s));

/**
 * v2 — targets/beats the D1Graphics & Commitment Edits tier.
 *
 * What changed vs v1 (which was a flat CSS gradient and read as "web page"):
 *  - real stadium photography as the base plate, pre-graded and defocused
 *  - genuine chrome typography: banded metallic gradient + bevel via layered
 *    shadows + dark outer stroke, instead of a flat white->grey fill
 *  - true depth stack: plate → vignette → ghost wordmark → headline →
 *    ATHLETE → foreground furniture, so the subject emerges through the type
 *  - light bloom behind the subject's head/shoulders to separate them from bg
 *  - contact shadow under the feet so he sits *on* the pitch
 *  - halftone + grain so it reads as print, not screen
 */
export const CommitmentGraphicV2: React.FC<V2Props> = ({
  headline,
  athleteName,
  schoolName,
  details,
  kicker,
  primaryColor,
  secondaryColor,
  platesSrc,
  cutoutSrc,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#04060B", overflow: "hidden" }}>
      {/* 1 ── real stadium plate */}
      <Img src={f(platesSrc)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />

      {/* 2 ── deepen corners, lift centre */}
      <AbsoluteFill
        style={{
          background:
            `radial-gradient(78% 55% at 50% 42%, ${withA(primaryColor, 0.34)} 0%, transparent 62%),` +
            `linear-gradient(to top, rgba(2,4,9,0.97) 0%, rgba(2,4,9,0.55) 34%, rgba(2,4,9,0.18) 62%, rgba(2,4,9,0.72) 100%)`,
        }}
      />

      {/* 3 ── ghost wordmark */}
      <div
        style={{
          position: "absolute", top: 300, left: -40, right: -40,
          textAlign: "center", fontFamily: anton, fontSize: 340, lineHeight: 0.8,
          color: "#fff", opacity: 0.045, letterSpacing: -10, textTransform: "uppercase",
        }}
      >
        {schoolName}
      </div>

      {/* 4 ── eyebrow */}
      <div style={{ position: "absolute", top: 84, left: 0, right: 0, textAlign: "center" }}>
        <span
          style={{
            fontFamily: barlow, fontWeight: 600, fontSize: 30, letterSpacing: 10,
            color: "rgba(255,255,255,0.92)", textTransform: "uppercase",
            borderTop: `2px solid ${withA(secondaryColor, 0.9)}`,
            borderBottom: `2px solid ${withA(secondaryColor, 0.9)}`,
            padding: "10px 26px",
          }}
        >
          {schoolName}
        </span>
      </div>

      {/* 5 ── bloom behind subject */}
      <div
        style={{
          position: "absolute", top: 430, left: "50%", transform: "translateX(-50%)",
          width: 620, height: 620, borderRadius: "50%",
          background: `radial-gradient(circle, ${withA(secondaryColor, 0.30)} 0%, ${withA(primaryColor, 0.16)} 42%, transparent 70%)`,
          filter: "blur(48px)",
        }}
      />

      {/* 6 ── CHROME HEADLINE (behind athlete) */}
      <Chrome text={headline} accent={secondaryColor} />

      {/* 7 ── kicker under headline */}
      <div style={{ position: "absolute", top: 712, left: 0, right: 0, textAlign: "center" }}>
        <span
          style={{
            fontFamily: barlow, fontWeight: 600, fontSize: 27, letterSpacing: 12,
            color: withA(secondaryColor, 0.95), textTransform: "uppercase",
          }}
        >
          {kicker}
        </span>
      </div>

      {/* 8 ── contact shadow */}
      <div
        style={{
          position: "absolute", bottom: 300, left: "50%", transform: "translateX(-50%)",
          width: 460, height: 60, borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(0,0,0,0.72) 0%, transparent 72%)",
          filter: "blur(14px)",
        }}
      />

      {/* 9 ── ATHLETE */}
      <div
        style={{
          position: "absolute", bottom: 292, left: 0, right: 0,
          display: "flex", justifyContent: "center", alignItems: "flex-end",
        }}
      >
        <Img
          src={f(cutoutSrc)}
          style={{
            height: 860, objectFit: "contain",
            filter: "drop-shadow(0 24px 44px rgba(0,0,0,0.72)) saturate(1.06) contrast(1.06)",
          }}
        />
      </div>

      {/* 10 ── foreground furniture */}
      <div style={{ position: "absolute", bottom: 268, left: 0, width: 236, height: 9, background: secondaryColor }} />
      <div style={{ position: "absolute", bottom: 268, right: 0, width: 236, height: 9, background: secondaryColor }} />

      {/* 11 ── name block */}
      <div style={{ position: "absolute", bottom: 132, left: 0, right: 0, textAlign: "center" }}>
        <div
          style={{
            fontFamily: anton, fontSize: 104, lineHeight: 1, letterSpacing: -1.5,
            color: "#fff", textTransform: "uppercase",
            textShadow: "0 4px 0 rgba(0,0,0,0.35), 0 14px 40px rgba(0,0,0,0.8)",
          }}
        >
          {athleteName}
        </div>
        <div
          style={{
            marginTop: 14, fontFamily: barlow, fontWeight: 600, fontSize: 34,
            letterSpacing: 11, color: secondaryColor, textTransform: "uppercase",
          }}
        >
          {details}
        </div>
      </div>

      {/* 12 ── print finish */}
      <Halftone />
      <AbsoluteFill style={{ boxShadow: "inset 0 0 300px 76px rgba(0,0,0,0.82)", pointerEvents: "none" }} />
      <Grain />
    </AbsoluteFill>
  );
};

/* ── genuine chrome: banded metal + bevel + outer stroke ───────────────── */
const CHROME =
  "linear-gradient(180deg," +
  "#ffffff 0%, #e8eef7 12%, #b3c2d4 26%, #6f8298 37%," +
  "#f4f9ff 48%, #ffffff 53%, #cdd9e8 62%," +
  "#8b9bb0 76%, #5a6a7e 88%, #c3cfdd 100%)";

const Chrome: React.FC<{ text: string; accent: string }> = ({ text, accent }) => {
  const size = text.length > 9 ? 218 : 252;
  const base: React.CSSProperties = {
    position: "absolute", left: 0, right: 0,
    fontFamily: anton, fontSize: size, lineHeight: 0.92,
    letterSpacing: -6, textTransform: "uppercase", textAlign: "center",
  };
  return (
    <div style={{ position: "absolute", top: 452, left: 0, right: 0, height: size }}>
      {/* extruded shadow body */}
      <div style={{ ...base, color: "rgba(0,0,0,0.55)", transform: "translateY(12px)", filter: "blur(2px)" }}>
        {text}
      </div>
      {/* accent stroke echo */}
      <div
        style={{
          ...base, color: "transparent",
          WebkitTextStroke: `7px ${accent}`, transform: "translateY(4px)", opacity: 0.95,
        }}
      >
        {text}
      </div>
      {/* dark containment stroke */}
      <div style={{ ...base, color: "transparent", WebkitTextStroke: "3px rgba(4,10,22,0.9)" }}>{text}</div>
      {/* metal fill */}
      <div
        style={{
          ...base,
          background: CHROME,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          filter: "drop-shadow(0 2px 1px rgba(255,255,255,0.5))",
        }}
      >
        {text}
      </div>
    </div>
  );
};

const Halftone: React.FC = () => (
  <AbsoluteFill style={{ opacity: 0.14, mixBlendMode: "overlay", pointerEvents: "none" }}>
    <svg width="100%" height="100%">
      <defs>
        <pattern id="ht" width="5" height="5" patternUnits="userSpaceOnUse">
          <circle cx="1.6" cy="1.6" r="1.05" fill="#fff" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#ht)" />
    </svg>
  </AbsoluteFill>
);

const Grain: React.FC = () => (
  <AbsoluteFill style={{ opacity: 0.2, mixBlendMode: "overlay", pointerEvents: "none" }}>
    <svg width="100%" height="100%">
      <filter id="gr">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#gr)" />
    </svg>
  </AbsoluteFill>
);

function withA(hex: string, a: number) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

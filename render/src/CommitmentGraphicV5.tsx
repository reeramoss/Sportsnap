import { AbsoluteFill, Img, staticFile } from "remotion";
import { loadFont as loadBigShoulders } from "@remotion/google-fonts/BigShoulders";
import { loadFont as loadArchivo } from "@remotion/google-fonts/Archivo";
import { loadFont as loadCollegiate } from "@remotion/google-fonts/AlumniSansCollegiateOne";

const { fontFamily: shoulders } = loadBigShoulders();
const { fontFamily: archivo } = loadArchivo();
const { fontFamily: collegiate } = loadCollegiate();

export type V5Props = {
  headline: string;
  athleteName: string;
  schoolName: string;
  position: string;
  jersey: string;
  kicker: string;
  venue: string;
  dateLine: string;
  primaryColor: string;
  secondaryColor: string;
  platesSrc: string;
  cutoutSrc: string;
  logoSrc?: string;
};

export const defaultV5Props: V5Props = {
  headline: "COMMITTED",
  athleteName: "RENAN RAMOS",
  schoolName: "LINDSEY WILSON COLLEGE",
  position: "MIDFIELDER",
  jersey: "07",
  kicker: "NAIA · MID-SOUTH CONFERENCE",
  venue: "WALTER S. REULING STADIUM",
  dateLine: "COLUMBIA, KY",
  primaryColor: "#0B5CB5",
  secondaryColor: "#F2C230",
  platesSrc: "plates/ai-night-4x5.jpg",
  cutoutSrc: "cutout_cc/renan-sprint.png",
  logoSrc: "brand/lindsey-wilson-logo.svg",
};

const f = (s: string) => (s.startsWith("http") ? s : staticFile(s));

/**
 * v5 — typographic overhaul.
 *
 * Changes from v4, all aimed at the gap that remained after the AI backdrop
 * landed (see research/typography.md):
 *   - Anton replaced by Big Shoulders (condensed American Gothic) for display
 *     and Archivo for metadata. Both SIL OFL, so server rendering and selling
 *     the output are explicitly permitted — no server-licence exposure.
 *   - Alumni Sans Collegiate One for the varsity/collegiate accent, which is
 *     the idiom US commitment graphics actually speak.
 *   - Chrome restrained: thin accent stroke, single soft shadow, no heavy
 *     bevel. v3/v4's treatment read as toy-like.
 *   - Real vector school logo (117-path SVG) as an actual brand element.
 *   - Secondary type layers added — venue/location rail and a stat chip —
 *     which is the detail the reference work has and we lacked.
 */
export const CommitmentGraphicV5: React.FC<V5Props> = ({
  headline, athleteName, schoolName, position, jersey, kicker,
  venue, dateLine, primaryColor, secondaryColor, platesSrc, cutoutSrc, logoSrc,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#04060B", overflow: "hidden" }}>
      <Img src={f(platesSrc)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />

      <AbsoluteFill
        style={{
          background:
            `radial-gradient(66% 54% at 72% 30%, ${withA(primaryColor, 0.34)} 0%, transparent 60%),` +
            `linear-gradient(102deg, rgba(2,4,9,0.95) 0%, rgba(2,4,9,0.72) 32%, rgba(2,4,9,0.16) 60%, rgba(2,4,9,0.60) 100%)`,
        }}
      />

      {/* ghost numeral */}
      <div
        style={{
          position: "absolute", right: -54, top: 118,
          fontFamily: shoulders, fontWeight: 900, fontSize: 600, lineHeight: 0.76,
          color: "#fff", opacity: 0.055, letterSpacing: -24,
        }}
      >
        {jersey}
      </div>

      {/* bloom */}
      <div
        style={{
          position: "absolute", right: 60, top: 320, width: 660, height: 660, borderRadius: "50%",
          background: `radial-gradient(circle, ${withA(secondaryColor, 0.22)} 0%, ${withA(primaryColor, 0.14)} 46%, transparent 70%)`,
          filter: "blur(58px)",
        }}
      />

      {/* athlete */}
      <div style={{ position: "absolute", right: -26, bottom: 0, height: 1060, display: "flex", alignItems: "flex-end" }}>
        <Img
          src={f(cutoutSrc)}
          style={{
            height: "100%", objectFit: "contain",
            filter: "drop-shadow(-14px 18px 42px rgba(0,0,0,0.8)) saturate(1.06) contrast(1.05)",
          }}
        />
      </div>

      {/* vertical headline — restrained */}
      <div
        style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: 262,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <div style={{ transform: "rotate(-90deg)", whiteSpace: "nowrap" }}>
          <Headline text={headline} accent={secondaryColor} />
        </div>
      </div>

      {/* top rail: logo + school */}
      <div style={{ position: "absolute", top: 64, left: 300, right: 48, display: "flex", alignItems: "center", gap: 20 }}>
        {logoSrc ? (
          <Img src={f(logoSrc)} style={{ height: 76, width: "auto", filter: "drop-shadow(0 3px 12px rgba(0,0,0,0.9))" }} />
        ) : null}
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: archivo, fontWeight: 700, fontSize: 25, letterSpacing: 5.5,
              color: "#fff", textTransform: "uppercase", lineHeight: 1.15,
            }}
          >
            {schoolName}
          </div>
          <div
            style={{
              marginTop: 7, fontFamily: archivo, fontWeight: 500, fontSize: 17,
              letterSpacing: 4.2, color: withA(secondaryColor, 0.96), textTransform: "uppercase",
            }}
          >
            {kicker}
          </div>
        </div>
      </div>

      {/* venue rail — the secondary detail the reference work has */}
      <div style={{ position: "absolute", top: 186, left: 300, display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 34, height: 2, backgroundColor: withA(secondaryColor, 0.85) }} />
        <span
          style={{
            fontFamily: archivo, fontWeight: 500, fontSize: 15, letterSpacing: 3.4,
            color: "rgba(255,255,255,0.62)", textTransform: "uppercase",
          }}
        >
          {venue} · {dateLine}
        </span>
      </div>

      {/* bottom block */}
      <div style={{ position: "absolute", bottom: 86, left: 300, right: 40 }}>
        <div
          style={{
            fontFamily: collegiate, fontSize: 132, lineHeight: 0.86,
            color: "#fff", textTransform: "uppercase", letterSpacing: 1,
            textShadow: "0 3px 0 rgba(0,0,0,0.34), 0 14px 40px rgba(0,0,0,0.88)",
          }}
        >
          {athleteName}
        </div>
        <div style={{ display: "flex", alignItems: "stretch", gap: 0, marginTop: 20 }}>
          <div
            style={{
              backgroundColor: secondaryColor, color: "#04060B",
              fontFamily: shoulders, fontWeight: 900, fontSize: 33,
              padding: "5px 15px 2px", letterSpacing: 0.5,
            }}
          >
            {jersey}
          </div>
          <div
            style={{
              backgroundColor: "rgba(255,255,255,0.09)",
              borderTop: `1px solid ${withA(secondaryColor, 0.4)}`,
              borderBottom: `1px solid ${withA(secondaryColor, 0.4)}`,
              borderRight: `1px solid ${withA(secondaryColor, 0.4)}`,
              display: "flex", alignItems: "center", padding: "0 20px",
            }}
          >
            <span
              style={{
                fontFamily: archivo, fontWeight: 600, fontSize: 21, letterSpacing: 6,
                color: "#fff", textTransform: "uppercase",
              }}
            >
              {position}
            </span>
          </div>
        </div>
      </div>

      <Halftone />
      <AbsoluteFill style={{ boxShadow: "inset 0 0 260px 64px rgba(0,0,0,0.74)", pointerEvents: "none" }} />
      <Grain />
    </AbsoluteFill>
  );
};

/** Restrained metal: soft vertical gradient, thin accent stroke, one shadow. */
const Headline: React.FC<{ text: string; accent: string }> = ({ text, accent }) => {
  const size = 206;
  const base: React.CSSProperties = {
    position: "absolute", left: 0, top: 0,
    fontFamily: shoulders, fontWeight: 900, fontSize: size, lineHeight: 1,
    letterSpacing: -2, textTransform: "uppercase", whiteSpace: "nowrap",
  };
  return (
    <div style={{ position: "relative", height: size, display: "inline-block" }}>
      <span style={{ ...base, position: "relative", color: "transparent" }}>{text}</span>
      <span style={{ ...base, color: "rgba(0,0,0,0.45)", transform: "translate(5px,6px)", filter: "blur(3px)" }}>
        {text}
      </span>
      <span style={{ ...base, color: "transparent", WebkitTextStroke: `2.5px ${withA(accent, 0.92)}`, transform: "translate(2.5px,2.5px)" }}>
        {text}
      </span>
      <span
        style={{
          ...base,
          background: "linear-gradient(178deg,#ffffff 0%,#f2f6fb 34%,#c9d4e2 58%,#eef3f9 76%,#ffffff 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {text}
      </span>
    </div>
  );
};

const Halftone: React.FC = () => (
  <AbsoluteFill style={{ opacity: 0.1, mixBlendMode: "overlay", pointerEvents: "none" }}>
    <svg width="100%" height="100%">
      <defs>
        <pattern id="ht5" width="5" height="5" patternUnits="userSpaceOnUse">
          <circle cx="1.6" cy="1.6" r="1.02" fill="#fff" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#ht5)" />
    </svg>
  </AbsoluteFill>
);

const Grain: React.FC = () => (
  <AbsoluteFill style={{ opacity: 0.17, mixBlendMode: "overlay", pointerEvents: "none" }}>
    <svg width="100%" height="100%">
      <filter id="gr5">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#gr5)" />
    </svg>
  </AbsoluteFill>
);

function withA(hex: string, a: number) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return `rgba(${parseInt(full.slice(0, 2), 16)}, ${parseInt(full.slice(2, 4), 16)}, ${parseInt(full.slice(4, 6), 16)}, ${a})`;
}

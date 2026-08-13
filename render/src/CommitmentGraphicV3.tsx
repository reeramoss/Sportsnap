import { AbsoluteFill, Img, staticFile } from "remotion";
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadBarlow } from "@remotion/google-fonts/BarlowCondensed";

const { fontFamily: anton } = loadAnton();
const { fontFamily: barlow } = loadBarlow();

export type V3Props = {
  headline: string;
  athleteName: string;
  schoolName: string;
  position: string;
  jersey: string;
  kicker: string;
  primaryColor: string;
  secondaryColor: string;
  platesSrc: string;
  cutoutSrc: string;
};

export const defaultV3Props: V3Props = {
  headline: "COMMITTED",
  athleteName: "RENAN RAMOS",
  schoolName: "LINDSEY WILSON",
  position: "MIDFIELDER",
  jersey: "07",
  kicker: "NAIA · MID-SOUTH CONFERENCE",
  primaryColor: "#0B5CB5",
  secondaryColor: "#F2C230",
  platesSrc: "plates/stadium-night.jpg",
  cutoutSrc: "cutout_cc/renan-sprint.png",
};

const f = (s: string) => (s.startsWith("http") ? s : staticFile(s));

/**
 * v3 — asymmetric editorial layout.
 *
 * Fixes v2's central flaw: a centred subject sat on top of a centred headline,
 * so "COMMITTED" read as "COM…TTED". Here the composition is deliberately
 * off-axis, which is also what the strongest reference work does (see
 * research/creative-arena.md on their matchday layouts, and the Lindsey
 * "FULL TIME" piece in public/reference):
 *
 *  - headline rotated 90° up the LEFT edge — never collides with the subject,
 *    and reads as designed rather than defaulted
 *  - dynamic sprint pose instead of a static stance, offset RIGHT and bled
 *    off the bottom edge so he feels in motion through the frame
 *  - oversized jersey numeral as a ghost layer for depth
 *  - metadata set in a precise small-caps rail, editorial rather than centred
 */
export const CommitmentGraphicV3: React.FC<V3Props> = ({
  headline,
  athleteName,
  schoolName,
  position,
  jersey,
  kicker,
  primaryColor,
  secondaryColor,
  platesSrc,
  cutoutSrc,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#04060B", overflow: "hidden" }}>
      {/* base plate */}
      <Img
        src={f(platesSrc)}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />

      {/* directional grade: light from upper right, sink the left for the type */}
      <AbsoluteFill
        style={{
          background:
            `radial-gradient(70% 60% at 74% 26%, ${withA(primaryColor, 0.40)} 0%, transparent 58%),` +
            `linear-gradient(105deg, rgba(2,4,9,0.94) 0%, rgba(2,4,9,0.70) 34%, rgba(2,4,9,0.20) 62%, rgba(2,4,9,0.55) 100%)`,
        }}
      />

      {/* oversized ghost jersey numeral */}
      <div
        style={{
          position: "absolute", right: -70, top: 96,
          fontFamily: anton, fontSize: 620, lineHeight: 0.78,
          color: "#fff", opacity: 0.06, letterSpacing: -30,
        }}
      >
        {jersey}
      </div>

      {/* bloom behind subject */}
      <div
        style={{
          position: "absolute", right: 40, top: 300, width: 700, height: 700, borderRadius: "50%",
          background: `radial-gradient(circle, ${withA(secondaryColor, 0.26)} 0%, ${withA(primaryColor, 0.16)} 44%, transparent 70%)`,
          filter: "blur(56px)",
        }}
      />

      {/* ── ATHLETE: offset right, bleeding off the bottom ── */}
      <div
        style={{
          position: "absolute", right: -30, bottom: 0,
          height: 1075, display: "flex", alignItems: "flex-end",
        }}
      >
        <Img
          src={f(cutoutSrc)}
          style={{
            height: "100%", objectFit: "contain",
            filter: "drop-shadow(-16px 20px 46px rgba(0,0,0,0.78)) saturate(1.08) contrast(1.07)",
          }}
        />
      </div>

      {/* ── VERTICAL CHROME HEADLINE up the left edge ── */}
      <div
        style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: 300,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <div style={{ transform: "rotate(-90deg)", whiteSpace: "nowrap" }}>
          <VerticalChrome text={headline} accent={secondaryColor} />
        </div>
      </div>

      {/* ── top rail: school ── */}
      <div style={{ position: "absolute", top: 74, left: 330, right: 56 }}>
        <div
          style={{
            fontFamily: barlow, fontWeight: 700, fontSize: 33, letterSpacing: 9,
            color: "#fff", textTransform: "uppercase",
            textShadow: "0 3px 18px rgba(0,0,0,0.85)",
          }}
        >
          {schoolName}
        </div>
        <div
          style={{
            marginTop: 10, height: 3, width: 148, backgroundColor: secondaryColor,
          }}
        />
        <div
          style={{
            marginTop: 12, fontFamily: barlow, fontWeight: 500, fontSize: 23,
            letterSpacing: 6, color: "rgba(255,255,255,0.78)", textTransform: "uppercase",
          }}
        >
          {kicker}
        </div>
      </div>

      {/* ── bottom rail: name + meta ── */}
      <div style={{ position: "absolute", bottom: 92, left: 330, right: 40 }}>
        <div
          style={{
            fontFamily: anton, fontSize: 96, lineHeight: 0.94, letterSpacing: -1.5,
            color: "#fff", textTransform: "uppercase",
            textShadow: "0 3px 0 rgba(0,0,0,0.4), 0 16px 44px rgba(0,0,0,0.9)",
          }}
        >
          {athleteName}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 16 }}>
          <span
            style={{
              fontFamily: anton, fontSize: 34, color: "#04060B",
              backgroundColor: secondaryColor, padding: "3px 13px 1px",
            }}
          >
            {jersey}
          </span>
          <span
            style={{
              fontFamily: barlow, fontWeight: 600, fontSize: 30, letterSpacing: 8,
              color: secondaryColor, textTransform: "uppercase",
            }}
          >
            {position}
          </span>
        </div>
      </div>

      {/* print finish */}
      <Halftone />
      <AbsoluteFill style={{ boxShadow: "inset 0 0 280px 70px rgba(0,0,0,0.78)", pointerEvents: "none" }} />
      <Grain />
    </AbsoluteFill>
  );
};

/* ── chrome, tuned for the rotated lockup ─────────────────────────────── */
const CHROME =
  "linear-gradient(180deg,#ffffff 0%,#e9eff8 11%,#b0c0d3 25%,#6d8097 36%," +
  "#f5f9ff 47%,#ffffff 52%,#ccd8e7 61%,#8a9aaf 75%,#586878 88%,#c2cedc 100%)";

const VerticalChrome: React.FC<{ text: string; accent: string }> = ({ text, accent }) => {
  const size = 214;
  const base: React.CSSProperties = {
    position: "absolute", left: 0, top: 0,
    fontFamily: anton, fontSize: size, lineHeight: 1,
    letterSpacing: -5, textTransform: "uppercase", whiteSpace: "nowrap",
  };
  return (
    <div style={{ position: "relative", height: size, display: "inline-block" }}>
      {/* spacer establishes intrinsic width */}
      <span style={{ ...base, position: "relative", color: "transparent" }}>{text}</span>
      <span style={{ ...base, color: "rgba(0,0,0,0.6)", transform: "translate(9px, 9px)", filter: "blur(2px)" }}>
        {text}
      </span>
      <span style={{ ...base, color: "transparent", WebkitTextStroke: `8px ${accent}`, transform: "translate(3px, 3px)" }}>
        {text}
      </span>
      <span style={{ ...base, color: "transparent", WebkitTextStroke: "3px rgba(4,10,22,0.92)" }}>{text}</span>
      <span
        style={{
          ...base,
          background: CHROME,
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
  <AbsoluteFill style={{ opacity: 0.12, mixBlendMode: "overlay", pointerEvents: "none" }}>
    <svg width="100%" height="100%">
      <defs>
        <pattern id="ht3" width="5" height="5" patternUnits="userSpaceOnUse">
          <circle cx="1.6" cy="1.6" r="1.05" fill="#fff" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#ht3)" />
    </svg>
  </AbsoluteFill>
);

const Grain: React.FC = () => (
  <AbsoluteFill style={{ opacity: 0.19, mixBlendMode: "overlay", pointerEvents: "none" }}>
    <svg width="100%" height="100%">
      <filter id="gr3">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#gr3)" />
    </svg>
  </AbsoluteFill>
);

function withA(hex: string, a: number) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return `rgba(${parseInt(full.slice(0, 2), 16)}, ${parseInt(full.slice(2, 4), 16)}, ${parseInt(full.slice(4, 6), 16)}, ${a})`;
}

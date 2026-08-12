import { AbsoluteFill, Img, staticFile } from "remotion";
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadBarlow } from "@remotion/google-fonts/BarlowCondensed";

const { fontFamily: anton } = loadAnton();
const { fontFamily: barlow } = loadBarlow();

export type CommitmentGraphicProps = {
  /** Headline word — COMMITTED / SIGNED / OFFERED */
  headline: string;
  athleteName: string;
  schoolName: string;
  /** e.g. "MIDFIELDER · CLASS OF 2027" */
  details: string;
  primaryColor: string;
  secondaryColor: string;
  /** Cut-out athlete photo (transparent PNG ideally). URL or staticFile path. */
  photoSrc?: string;
  /** Optional school logo/wordmark */
  logoSrc?: string;
};

export const defaultCommitmentProps: CommitmentGraphicProps = {
  headline: "COMMITTED",
  athleteName: "Renan Ramos",
  schoolName: "Lindsey Wilson University",
  details: "MIDFIELDER · CLASS OF 2027",
  primaryColor: "#0B3B8C",
  secondaryColor: "#F5C518",
  photoSrc: undefined,
  logoSrc: undefined,
};

/**
 * Static commitment graphic, benchmarked against D1Graphics / Commitment Edits
 * (see research/d1graphics-commitmentedits.md).
 *
 * Design approach that makes this read as "pro" rather than "template filled in":
 *  - true depth layering: ghosted wordmark → headline BEHIND the athlete →
 *    athlete → foreground accents, so the subject emerges through the type
 *  - athletic condensed display type (Anton) with an offset stroke echo
 *  - school-color-driven palette applied across gradient, accents, and type
 *  - vignette + grain so it doesn't look flat/CSS-y
 *
 * Everything is data-driven: swap props, get a new on-brand graphic. No manual
 * design step, which is the structural advantage over the competitors' 2-3 day
 * human-designed workflow.
 */
export const CommitmentGraphic: React.FC<CommitmentGraphicProps> = ({
  headline,
  athleteName,
  schoolName,
  details,
  primaryColor,
  secondaryColor,
  photoSrc,
  logoSrc,
}) => {
  const resolve = (s: string) => (s.startsWith("http") ? s : staticFile(s));

  return (
    <AbsoluteFill style={{ backgroundColor: "#05070D", overflow: "hidden" }}>
      {/* ── Base: school-color field with depth ───────────────────────── */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 90% at 50% 18%, ${primaryColor} 0%, ${shade(primaryColor, -35)} 45%, #05070D 100%)`,
        }}
      />

      {/* Angled light sweep */}
      <div
        style={{
          position: "absolute",
          top: "-20%",
          left: "-15%",
          width: "70%",
          height: "140%",
          background: `linear-gradient(90deg, ${withAlpha(secondaryColor, 0.16)} 0%, transparent 100%)`,
          transform: "rotate(14deg)",
          filter: "blur(40px)",
        }}
      />

      {/* ── Ghosted school wordmark (depth layer 1) ───────────────────── */}
      <div
        style={{
          position: "absolute",
          top: 250,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: anton,
          fontSize: 300,
          lineHeight: 0.82,
          color: "white",
          opacity: 0.055,
          letterSpacing: -6,
          textTransform: "uppercase",
          padding: "0 40px",
        }}
      >
        {schoolName}
      </div>

      {/* ── School name eyebrow ───────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: 92,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 18,
            padding: "12px 30px",
            border: `1.5px solid ${withAlpha(secondaryColor, 0.55)}`,
            borderRadius: 999,
            backgroundColor: "rgba(0,0,0,0.25)",
          }}
        >
          {logoSrc ? (
            <Img src={resolve(logoSrc)} style={{ height: 44, width: 44, objectFit: "contain" }} />
          ) : null}
          <span
            style={{
              fontFamily: barlow,
              fontWeight: 600,
              fontSize: 34,
              letterSpacing: 7,
              color: "white",
              textTransform: "uppercase",
            }}
          >
            {schoolName}
          </span>
        </div>
      </div>

      {/* ── Headline BEHIND athlete (depth layer 2) ───────────────────── */}
      <Headline
        text={headline}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        variant="back"
      />

      {/* ── Athlete (depth layer 3) ───────────────────────────────────── */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end" }}>
        {photoSrc ? (
          <Img
            src={resolve(photoSrc)}
            style={{
              height: "74%",
              objectFit: "contain",
              objectPosition: "bottom",
              filter: "drop-shadow(0 40px 60px rgba(0,0,0,0.65))",
            }}
          />
        ) : (
          <AthletePlaceholder accent={secondaryColor} />
        )}
      </AbsoluteFill>

      {/* ── Foreground accent bars (depth layer 4) ────────────────────── */}
      <div
        style={{
          position: "absolute",
          bottom: 318,
          left: 0,
          width: 200,
          height: 12,
          backgroundColor: secondaryColor,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 318,
          right: 0,
          width: 200,
          height: 12,
          backgroundColor: secondaryColor,
        }}
      />

      {/* ── Lower text block ──────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          bottom: 118,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: anton,
            fontSize: 92,
            color: "white",
            letterSpacing: -1,
            textTransform: "uppercase",
            textShadow: "0 8px 34px rgba(0,0,0,0.75)",
            lineHeight: 1,
          }}
        >
          {athleteName}
        </div>
        <div
          style={{
            marginTop: 18,
            fontFamily: barlow,
            fontWeight: 600,
            fontSize: 36,
            letterSpacing: 9,
            color: secondaryColor,
            textTransform: "uppercase",
          }}
        >
          {details}
        </div>
      </div>

      {/* ── Bottom fade so text always sits on darkness ───────────────── */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 420,
          background: "linear-gradient(to top, rgba(3,5,10,0.95) 0%, rgba(3,5,10,0.6) 45%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      {/* re-draw lower text above the fade */}
      <div
        style={{
          position: "absolute",
          bottom: 118,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: anton,
            fontSize: 92,
            color: "white",
            letterSpacing: -1,
            textTransform: "uppercase",
            lineHeight: 1,
          }}
        >
          {athleteName}
        </div>
        <div
          style={{
            marginTop: 18,
            fontFamily: barlow,
            fontWeight: 600,
            fontSize: 36,
            letterSpacing: 9,
            color: secondaryColor,
            textTransform: "uppercase",
          }}
        >
          {details}
        </div>
      </div>

      {/* ── Vignette + grain for print-like finish ────────────────────── */}
      <AbsoluteFill
        style={{
          boxShadow: "inset 0 0 320px 90px rgba(0,0,0,0.85)",
          pointerEvents: "none",
        }}
      />
      <Grain />
    </AbsoluteFill>
  );
};

/* ────────────────────────────────────────────────────────────────────── */

const Headline: React.FC<{
  text: string;
  primaryColor: string;
  secondaryColor: string;
  variant: "back" | "front";
}> = ({ text, secondaryColor, variant }) => {
  const size = text.length > 9 ? 230 : 265;
  return (
    <div
      style={{
        position: "absolute",
        top: variant === "back" ? 470 : 470,
        left: 0,
        right: 0,
        textAlign: "center",
      }}
    >
      {/* stroke echo, offset */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          transform: "translate(10px, 10px)",
          fontFamily: anton,
          fontSize: size,
          lineHeight: 0.9,
          letterSpacing: -8,
          textTransform: "uppercase",
          color: "transparent",
          WebkitTextStroke: `3px ${withAlpha(secondaryColor, 0.85)}`,
        }}
      >
        {text}
      </div>
      {/* solid fill */}
      <div
        style={{
          position: "relative",
          fontFamily: anton,
          fontSize: size,
          lineHeight: 0.9,
          letterSpacing: -8,
          textTransform: "uppercase",
          background: "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 55%, #C6CEDB 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          filter: "drop-shadow(0 18px 40px rgba(0,0,0,0.6))",
        }}
      >
        {text}
      </div>
    </div>
  );
};

const AthletePlaceholder: React.FC<{ accent: string }> = ({ accent }) => (
  <div
    style={{
      width: 700,
      height: 980,
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center",
      position: "relative",
    }}
  >
    {/* simple silhouette so layering/depth is visually judgeable without a real cutout */}
    <svg viewBox="0 0 300 420" style={{ width: "100%", height: "100%" }}>
      <defs>
        <linearGradient id="sil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.30)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.10)" />
        </linearGradient>
      </defs>
      <g fill="url(#sil)">
        <circle cx="150" cy="70" r="42" />
        <path d="M150 118c-46 0-78 26-86 66l-10 52h44l6 184h92l6-184h44l-10-52c-8-40-40-66-86-66z" />
      </g>
    </svg>
    <div
      style={{
        position: "absolute",
        bottom: 24,
        fontFamily: barlow,
        fontWeight: 600,
        fontSize: 26,
        letterSpacing: 4,
        color: withAlpha(accent, 0.9),
        textTransform: "uppercase",
      }}
    >
      cut-out photo goes here
    </div>
  </div>
);

const Grain: React.FC = () => (
  <AbsoluteFill style={{ opacity: 0.16, mixBlendMode: "overlay", pointerEvents: "none" }}>
    <svg width="100%" height="100%">
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
  </AbsoluteFill>
);

/* ── tiny color utils ─────────────────────────────────────────────────── */

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

function withAlpha(hex: string, a: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/** percent < 0 darkens, > 0 lightens */
function shade(hex: string, percent: number) {
  const { r, g, b } = hexToRgb(hex);
  const f = (v: number) =>
    Math.max(0, Math.min(255, Math.round(v + (percent / 100) * (percent < 0 ? v : 255 - v))));
  return `rgb(${f(r)}, ${f(g)}, ${f(b)})`;
}

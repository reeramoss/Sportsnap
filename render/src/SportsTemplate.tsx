import {
  AbsoluteFill,
  Sequence,
  spring,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Img,
  staticFile,
} from "remotion";

export type SportsTemplateProps = {
  playerName: string;
  subtitle: string;
  primaryColor: string;
  secondaryColor: string;
  photoSrc?: string;
};

export const defaultSportsProps: SportsTemplateProps = {
  playerName: "RENAN RAMOS",
  subtitle: "GAME DAY • vs. RIVAL FC",
  primaryColor: "#0B6E4F",
  secondaryColor: "#FFD23F",
  photoSrc: undefined,
};

/**
 * A minimal, code-driven proof-of-concept for the "template + compositing"
 * approach: fixed choreography (background reveal, angled color blocks,
 * photo entrance, staggered typography), parametrized by data instead of
 * being re-generated per request. This is the mechanism, not the final
 * visual design — the real version would swap in a licensed/purchased
 * template's timing and use real photo cutouts.
 */
export const SportsTemplate: React.FC<SportsTemplateProps> = ({
  playerName,
  subtitle,
  primaryColor,
  secondaryColor,
  photoSrc,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgScale = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 40 });
  const blockSlide = spring({ frame: frame - 5, fps, config: { damping: 14, mass: 0.6 } });
  const photoSpring = spring({ frame: frame - 12, fps, config: { damping: 16, mass: 0.8 } });
  const nameOpacity = interpolate(frame, [28, 40], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const nameSlide = spring({ frame: frame - 28, fps, config: { damping: 18 } });
  const subtitleOpacity = interpolate(frame, [40, 52], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0A0A", overflow: "hidden" }}>
      {/* Background diagonal color field */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(160deg, ${primaryColor} 0%, #0A0A0A 65%)`,
          transform: `scale(${0.9 + bgScale * 0.1})`,
          opacity: bgScale,
        }}
      />

      {/* Angled accent block sliding in from the right */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "55%",
          height: "100%",
          background: secondaryColor,
          transform: `translateX(${(1 - blockSlide) * 60}%) skewX(-8deg)`,
          opacity: 0.9,
        }}
      />

      {/* Photo / subject placeholder */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          transform: `translateY(${(1 - photoSpring) * 120}px) scale(${0.85 + photoSpring * 0.15})`,
          opacity: photoSpring,
        }}
      >
        {photoSrc ? (
          <Img
            src={photoSrc.startsWith("http") ? photoSrc : staticFile(photoSrc)}
            style={{
              width: 640,
              height: 640,
              objectFit: "cover",
              borderRadius: 24,
              boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
            }}
          />
        ) : (
          <div
            style={{
              width: 640,
              height: 640,
              borderRadius: 24,
              background: "rgba(255,255,255,0.08)",
              border: "3px dashed rgba(255,255,255,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(255,255,255,0.6)",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: 28,
              textAlign: "center",
              padding: 20,
            }}
          >
            [ player photo placeholder ]
          </div>
        )}
      </AbsoluteFill>

      {/* Name */}
      <div
        style={{
          position: "absolute",
          bottom: 260,
          left: 60,
          right: 60,
          opacity: nameOpacity,
          transform: `translateX(${(1 - nameSlide) * -80}px)`,
        }}
      >
        <div
          style={{
            fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: 900,
            fontSize: 88,
            color: "white",
            lineHeight: 1,
            letterSpacing: -2,
            textShadow: "0 6px 30px rgba(0,0,0,0.6)",
          }}
        >
          {playerName}
        </div>
      </div>

      {/* Subtitle */}
      <div
        style={{
          position: "absolute",
          bottom: 200,
          left: 64,
          opacity: subtitleOpacity,
        }}
      >
        <div
          style={{
            fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: 700,
            fontSize: 34,
            color: secondaryColor,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          {subtitle}
        </div>
      </div>

      {/* Bottom brand bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 120,
          background: primaryColor,
          opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }),
        }}
      />
    </AbsoluteFill>
  );
};

export const SportsSequence: React.FC<SportsTemplateProps> = (props) => (
  <Sequence from={0} durationInFrames={150}>
    <SportsTemplate {...props} />
  </Sequence>
);

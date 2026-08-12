import { Composition, Still } from "remotion";
import { SportsTemplate, defaultSportsProps } from "./SportsTemplate";
import { CommitmentGraphic, defaultCommitmentProps } from "./CommitmentGraphic";
import { CommitmentGraphicV2, defaultV2Props } from "./CommitmentGraphicV2";

export const MyComposition = () => {
  return (
    <>
      {/* v2 — real stadium plate + chrome type + real cutout. Current best. */}
      <Still
        id="CommitmentV2"
        component={CommitmentGraphicV2}
        width={1080}
        height={1350}
        defaultProps={defaultV2Props}
      />

      {/* Static commitment graphic — the direct competitor-tier product
          (D1Graphics / Commitment Edits sell exactly this, human-designed,
          2-3 day turnaround). Instagram portrait 4:5. */}
      <Still
        id="CommitmentGraphic"
        component={CommitmentGraphic}
        width={1080}
        height={1350}
        defaultProps={defaultCommitmentProps}
      />

      {/* Motion story template — proof-of-concept for the video side,
          which neither competitor actually offers. 9:16. */}
      <Composition
        id="SportsStory"
        component={SportsTemplate}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={defaultSportsProps}
      />
    </>
  );
};

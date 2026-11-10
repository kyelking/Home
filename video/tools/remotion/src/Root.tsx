import React from "react";
import { Composition } from "remotion";
import { Caption } from "./Caption";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Vertical 9:16 composition for Shorts / Reels / TikTok */}
      <Composition
        id="Vertical"
        component={Caption}
        durationInFrames={90}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ text: "Hello from Remotion" }}
      />
    </>
  );
};

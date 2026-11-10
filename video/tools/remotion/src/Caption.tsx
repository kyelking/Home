import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

export const Caption: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: "#111", justifyContent: "flex-end", alignItems: "center" }}>
      <div
        style={{
          marginBottom: 240,
          padding: "20px 40px",
          background: "rgba(0,0,0,0.6)",
          color: "#fff",
          fontSize: 72,
          fontFamily: "sans-serif",
          fontWeight: 700,
          borderRadius: 16,
          opacity,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

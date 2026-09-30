import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #04524a, #1de4d0, #62b5d1)",
          borderRadius: "50%",
        }}
      >
        <span
          style={{
            fontFamily: "system-ui, sans-serif",
            fontWeight: 700,
            fontSize: 36,
            color: "#000d0d",
          }}
        >
          P
        </span>
      </div>
    ),
    { ...size }
  );
}

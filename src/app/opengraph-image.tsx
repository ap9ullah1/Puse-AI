import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#000d0d",
          padding: "0 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            fontSize: 76,
            fontWeight: 600,
            color: "#fafafa",
            textAlign: "center",
            lineHeight: 1.15,
          }}
        >
          <span style={{ display: "flex" }}>Find your skin&apos;s&nbsp;</span>
          <span
            style={{
              display: "flex",
              backgroundImage: "linear-gradient(100deg, #04524a, #1de4d0, #62b5d1)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            pulse
          </span>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#94969c", marginTop: 28 }}>
          YouCam Skin AI + Virtual Try-On, in one flow
        </div>
      </div>
    ),
    { ...size }
  );
}

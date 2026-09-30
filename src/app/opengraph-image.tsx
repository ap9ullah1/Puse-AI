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
          background: "#fbf7f4",
          padding: "0 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 22,
            color: "#83746d",
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #ff6b6b, #f5487f, #8b5cf6)",
            }}
          />
          Built with the YouCam API
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            fontSize: 76,
            fontWeight: 600,
            color: "#201815",
            textAlign: "center",
            lineHeight: 1.15,
          }}
        >
          <span style={{ display: "flex" }}>Find your skin&apos;s&nbsp;</span>
          <span
            style={{
              display: "flex",
              backgroundImage: "linear-gradient(100deg, #ff6b6b, #f5487f, #8b5cf6)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            pulse
          </span>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#83746d", marginTop: 28 }}>
          YouCam Skin AI + Virtual Try-On, in one flow
        </div>
      </div>
    ),
    { ...size }
  );
}

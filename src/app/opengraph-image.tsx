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
          background: "#f6f3fb",
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
            color: "#1c1233",
            textAlign: "center",
            lineHeight: 1.15,
          }}
        >
          <span
            style={{
              display: "flex",
              backgroundImage: "linear-gradient(100deg, #6d28d9, #d946ef, #db2777)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Puse AI
          </span>
          <span style={{ display: "flex" }}>&nbsp;skin &amp; style shop</span>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#6e6580", marginTop: 28 }}>
          YouCam Skin AI + Virtual Try-On, in one flow
        </div>
      </div>
    ),
    { ...size }
  );
}

import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#020202",
          color: "#f5f5f5",
          padding: "64px 72px",
          border: "2px solid #3b3b3b",
        }}
      >
        <div style={{ fontSize: 26, letterSpacing: "0.35em", opacity: 0.75 }}>NIGSIB PORTFOLIO</div>
        <div style={{ maxWidth: 980, display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 68, lineHeight: 1.05, fontWeight: 700 }}>Multidisciplinary design that ships.</div>
          <div style={{ fontSize: 30, opacity: 0.85 }}>
            Web, branding, print, and exhibition work from an award-winning UK designer.
          </div>
        </div>
      </div>
    ),
    size,
  );
}

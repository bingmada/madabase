import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const title = new URL(request.url).searchParams.get("title")?.trim().slice(0, 120) || "Practical tools and resources";

  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(135deg, #07111f 0%, #123257 55%, #0f766e 100%)",
          color: "white",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          padding: "72px",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: "1040px", width: "100%" }}>
          <div style={{ color: "#99f6e4", display: "flex", fontSize: 28, fontWeight: 700, letterSpacing: "0.08em" }}>MADABASE</div>
          <div style={{ display: "flex", fontSize: 64, fontWeight: 800, lineHeight: 1.12, marginTop: 28 }}>{title}</div>
          <div style={{ color: "#dbeafe", display: "flex", fontSize: 28, marginTop: 32 }}>Developer tools and practical resources</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}

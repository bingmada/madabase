import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const title = new URL(request.url).searchParams.get("title")?.trim().slice(0, 120) || "Personality and self-discovery tests";

  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(135deg, #17112b 0%, #433276 56%, #9f4879 100%)",
          color: "white",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          padding: "72px",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: "1040px", width: "100%" }}>
          <div style={{ color: "#f5d0fe", display: "flex", fontSize: 28, fontWeight: 700, letterSpacing: "0.08em" }}>MADABASE TESTS</div>
          <div style={{ display: "flex", fontSize: 64, fontWeight: 800, lineHeight: 1.12, marginTop: 28 }}>{title}</div>
          <div style={{ color: "#ede9fe", display: "flex", fontSize: 28, marginTop: 32 }}>Personality, career and self-discovery</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}

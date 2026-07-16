import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { findDistributionItem } from "@/lib/distribution";
import { getCurrentSite, getSiteByKey, siteKeys } from "@/lib/sites";
import type { SiteKey } from "@/lib/types";

export const runtime = "nodejs";

function titleSize(title: string) {
  if (title.length > 84) return 46;
  if (title.length > 60) return 52;
  return 60;
}

function clampText(value: string, limit: number) {
  if (value.length <= limit) return value;
  return `${value.slice(0, limit - 1).trimEnd()}...`;
}

async function localImageDataUrl(imagePath: string, fit: "contain" | "cover") {
  const relativePath = imagePath.replace(/^\/+/, "");
  const candidates = [
    path.join(process.cwd(), "public", relativePath),
    path.join(process.cwd(), "apps/affiliate/public", relativePath),
  ];
  let source: Buffer | null = null;

  for (const candidate of candidates) {
    try {
      source = await readFile(candidate);
      break;
    } catch {
      // Deployment layouts differ; try the next known public-directory location.
    }
  }

  if (!source) throw new Error(`Could not read local Pinterest source image: ${imagePath}`);
  const png = await sharp(source)
    .resize(1000, 700, { fit, background: "#edf2f3" })
    .png({ compressionLevel: 8 })
    .toBuffer();

  return `data:image/png;base64,${png.toString("base64")}`;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ kind: string; slug: string }> },
) {
  const requestUrl = new URL(request.url);
  const requestedSite = requestUrl.searchParams.get("site");
  const currentSite = await getCurrentSite();
  const site = requestedSite && siteKeys.includes(requestedSite as SiteKey)
    ? getSiteByKey(requestedSite)
    : currentSite;
  const { kind, slug } = await params;
  const item = findDistributionItem(site, kind, slug);

  if (!item) return new Response("Not found", { status: 404 });

  // Pinterest appends these parameters when a user clicks a Pin saved from this image URL.
  if (requestUrl.searchParams.get("utm_source")?.toLowerCase() === "pinterest") {
    const destination = new URL(item.path, site.domain);
    destination.searchParams.set("utm_source", "pinterest");
    destination.searchParams.set("utm_medium", "organic_social");
    destination.searchParams.set("utm_campaign", `${site.key}_evidence_pages`);
    destination.searchParams.set("utm_content", `${item.kind}_${item.slug}`);
    return Response.redirect(destination, 307);
  }

  const imageUrl = await localImageDataUrl(item.image, item.kind === "reviews" || site.key === "style" ? "contain" : "cover");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#ffffff",
          color: "#172126",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ height: 700, minHeight: 700, flexShrink: 0, width: "100%", display: "flex", position: "relative", overflow: "hidden", background: site.theme.brandSoft }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt="" width="1000" height="700" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div
            style={{
              position: "absolute",
              left: 48,
              top: 48,
              display: "flex",
              padding: "16px 22px",
              background: "rgba(255,255,255,0.94)",
              color: site.theme.brandStrong,
              fontSize: 24,
              fontWeight: 800,
              letterSpacing: 0,
            }}
          >
            {item.kicker}
          </div>
        </div>

        <div style={{ height: 800, minHeight: 800, flexShrink: 0, overflow: "hidden", display: "flex", flexDirection: "column", padding: "48px 58px 42px", borderTop: `12px solid ${site.theme.accent}`, background: "#ffffff" }}>
          <div style={{ display: "flex", color: site.theme.brandStrong, fontSize: 24, fontWeight: 800, letterSpacing: 0 }}>
            {site.name}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 22,
              fontSize: titleSize(item.title),
              lineHeight: 1.08,
              fontWeight: 900,
              letterSpacing: 0,
            }}
          >
            {clampText(item.title, 100)}
          </div>

          <div style={{ display: "flex", flexDirection: "column", marginTop: 38, borderLeft: `8px solid ${site.theme.brand}`, paddingLeft: 24 }}>
            <div style={{ display: "flex", color: site.theme.brandStrong, fontSize: 23, fontWeight: 800, letterSpacing: 0 }}>
              {clampText(item.decisionLabel, 44)}
            </div>
            <div style={{ display: "flex", marginTop: 10, fontSize: 28, lineHeight: 1.25, letterSpacing: 0 }}>
              {clampText(item.decisionDetail, 105)}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", marginTop: 30, borderLeft: `8px solid ${site.theme.accent}`, paddingLeft: 24 }}>
            <div style={{ display: "flex", color: site.theme.accent, fontSize: 23, fontWeight: 800, letterSpacing: 0 }}>
              {clampText(item.riskLabel, 44)}
            </div>
            <div style={{ display: "flex", marginTop: 10, fontSize: 25, lineHeight: 1.25, color: "#3f4d52", letterSpacing: 0 }}>
              {clampText(item.riskDetail, 92)}
            </div>
          </div>

          <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 28, borderTop: "2px solid #dce3e6" }}>
            <div style={{ display: "flex", fontSize: 22, color: "#526168", letterSpacing: 0 }}>Independent fit, risk, and version checks</div>
            <div style={{ display: "flex", width: 26, height: 26, background: site.theme.brand }} />
          </div>
        </div>
      </div>
    ),
    {
      width: 1000,
      height: 1500,
      headers: {
        "cache-control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000",
        "x-robots-tag": "noindex, nofollow",
      },
    },
  );
}

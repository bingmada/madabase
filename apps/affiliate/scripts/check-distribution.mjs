import sharp from "sharp";

const SITES = ["network", "smarthome", "homeoffice", "baby", "pet", "style"];
const PROHIBITED_DESTINATION_HOSTS = new Set(["tools.madabase.com", "test.madabase.com"]);
const baseUrl = process.argv[2] ?? "http://127.0.0.1:3011";
const errors = [];
let checked = 0;

async function feedFor(site) {
  const url = new URL("/api/distribution-feed", baseUrl);
  url.searchParams.set("site", site);
  url.searchParams.set("limit", "3");
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Feed failed for ${site}: HTTP ${response.status}`);
  return response.json();
}

async function checkImage(item) {
  const [, kind, slug] = item.id.split(":");
  const url = new URL(`/api/pinterest-image/${kind}/${slug}`, baseUrl);
  url.searchParams.set("site", item.site);
  const response = await fetch(url);
  if (!response.ok) {
    errors.push(`${item.id}: image returned HTTP ${response.status}`);
    return;
  }

  if (!response.headers.get("x-robots-tag")?.includes("noindex")) {
    errors.push(`${item.id}: image route must be noindex`);
  }
  const image = sharp(Buffer.from(await response.arrayBuffer()));
  const metadata = await image.metadata();
  if (metadata.width !== 1000 || metadata.height !== 1500 || metadata.format !== "png") {
    errors.push(`${item.id}: expected 1000x1500 PNG, got ${metadata.width}x${metadata.height} ${metadata.format}`);
  }

  const { data, info } = await image
    .clone()
    .extract({ left: 0, top: 720, width: 1000, height: 780 })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let nearBlackPixels = 0;
  for (let index = 0; index < data.length; index += info.channels) {
    if (data[index] < 8 && data[index + 1] < 8 && data[index + 2] < 8) nearBlackPixels += 1;
  }
  const blackRatio = nearBlackPixels / (info.width * info.height);
  if (blackRatio > 0.12) errors.push(`${item.id}: lower image area is ${(blackRatio * 100).toFixed(1)}% black`);
  checked += 1;
}

for (const site of SITES) {
  const feed = await feedFor(site);
  for (const item of feed.items) {
    const destination = new URL(item.destinationUrl);
    if (PROHIBITED_DESTINATION_HOSTS.has(destination.host)) errors.push(`${item.id}: retired Tools/Test destinations are prohibited`);
    if (destination.host !== new URL(feed.domain).host) errors.push(`${item.id}: destination host mismatch`);
    if (destination.searchParams.get("utm_source") !== "pinterest") errors.push(`${item.id}: missing Pinterest UTM source`);
    if (/amazon\.|amzn\./i.test(item.destinationUrl)) errors.push(`${item.id}: must route through the evidence page, not Amazon`);
    await checkImage(item);
  }
}

if (errors.length > 0) {
  console.error(`Distribution check failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log(`Distribution check passed for ${checked} Pin images across ${SITES.length} sites.`);
}

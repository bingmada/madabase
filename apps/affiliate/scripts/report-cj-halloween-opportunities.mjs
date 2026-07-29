import fs from "node:fs";
import { spawn } from "node:child_process";
import { finished } from "node:stream/promises";

const exportPath = process.env.CJ_PRODUCT_EXPORT_PATH;
const expectedPid = process.env.CJ_COSTUME_PID;
const reportLimit = Number(process.env.CJ_OPPORTUNITY_LIMIT || 12);

if (!exportPath || !expectedPid) {
  console.error("CJ_PRODUCT_EXPORT_PATH and CJ_COSTUME_PID are required");
  process.exit(1);
}
if (!Number.isInteger(reportLimit) || reportLimit < 1 || reportLimit > 50) {
  throw new Error("CJ_OPPORTUNITY_LIMIT must be an integer between 1 and 50");
}

const themeDefinitions = [
  ["chainsaw-prop", /chainsaw|chain saw|power saw/i],
  ["haunted-carnival", /clown|jester|circus|carnival/i],
  ["zombie-graveyard", /zombie|undead|graveyard|grave yard|skeleton|bone costume/i],
  ["witch-apothecary", /witch|cauldron|warlock|potion|apothecary|broom/i],
  ["costume-wig", /wig|hairpiece|facial hair|beard|moustache|mustache/i],
  ["werewolf-transformation", /werewolf|wolf man|wolf-man|lycan/i],
  ["fog-uv-lighting", /fog machine|fog fluid|blacklight|black light|uv reactive|string lights|strobe/i],
  ["horror-makeup-prosthetic", /special effects makeup|fx makeup|prosthetic|stage blood|fake blood|latex appliance/i],
];

function openExport(pathname) {
  if (!fs.existsSync(pathname)) throw new Error(`CJ export does not exist: ${pathname}`);
  if (pathname.toLowerCase().endsWith(".zip")) {
    const child = spawn("unzip", ["-p", pathname], { stdio: ["ignore", "pipe", "pipe"] });
    let stderr = "";
    child.stderr.setEncoding("utf8");
    child.stderr.on("data", (chunk) => {
      stderr = `${stderr}${chunk}`.slice(-8_000);
    });
    const completion = new Promise((resolve, reject) => {
      child.once("error", reject);
      child.once("close", (code) => {
        if (code === 0) resolve();
        else reject(new Error(stderr.trim() || `unzip exited with status ${code}`));
      });
    });
    return { stream: child.stdout, completion };
  }

  const stream = fs.createReadStream(pathname, { encoding: "utf8" });
  return { stream, completion: finished(stream) };
}

async function* parseDelimited(stream, delimiter = "\t") {
  stream.setEncoding("utf8");
  let row = [];
  let field = "";
  let quoted = false;
  let pending = "";

  for await (const chunk of stream) {
    const text = pending + chunk;
    pending = "";
    for (let index = 0; index < text.length; index += 1) {
      const char = text[index];
      if (quoted) {
        if (char === '"') {
          if (index + 1 === text.length) {
            pending = '"';
            break;
          }
          if (text[index + 1] === '"') {
            field += '"';
            index += 1;
          } else quoted = false;
        } else field += char;
        continue;
      }

      if (char === '"' && field === "") quoted = true;
      else if (char === delimiter) {
        row.push(field);
        field = "";
      } else if (char === "\n") {
        row.push(field.replace(/\r$/, ""));
        yield row;
        row = [];
        field = "";
      } else field += char;
    }
  }

  if (pending === '"' && quoted) quoted = false;
  else field += pending;
  if (quoted) throw new Error("CJ export contains an unterminated quoted field");
  if (field || row.length) {
    row.push(field.replace(/\r$/, ""));
    yield row;
  }
}

function normalizeHeader(value) {
  return value.replace(/^\uFEFF/, "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

function pick(row, names) {
  for (const name of names) {
    const value = row[name];
    if (value != null && String(value).trim()) return String(value).trim();
  }
  return "";
}

function parsePrice(value) {
  const match = value.replaceAll(",", "").match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function normalizeAvailability(value) {
  return value.toLowerCase().replaceAll("_", " ").trim() || "unknown";
}

function linkIdentity(value) {
  try {
    const trackingUrl = new URL(value);
    const match = trackingUrl.pathname.match(/\/click-(\d+)-(\d+)(?:\/|$)/);
    const destinationUrl = new URL(trackingUrl.searchParams.get("url") || "");
    if (
      !match
      || match[1] !== expectedPid
      || destinationUrl.protocol !== "https:"
      || !["abracadabranyc.com", "www.abracadabranyc.com"].includes(destinationUrl.hostname)
    ) return null;
    return { aid: match[2], destinationUrl, trackingUrl };
  } catch {
    return null;
  }
}

function candidateFor(row) {
  const externalId = pick(row, ["id", "sku", "advertiser_sku", "manufacturer_sku", "merchant_product_id"]);
  const title = pick(row, ["title", "name", "product_name"]);
  const productType = pick(row, ["product_type", "google_product_category", "category"]);
  const description = pick(row, ["description"]);
  const tags = pick(row, ["tags", "keywords"]);
  const imageUrl = pick(row, ["image_link", "image_url", "image"]);
  const tracking = linkIdentity(
    pick(row, ["link", "buy_url", "buyurl", "tracking_url", "affiliate_url", "advertiser_deep_link"]),
  );

  if (!externalId || !title || !imageUrl || !tracking) return null;
  try {
    const parsedImage = new URL(imageUrl);
    if (parsedImage.protocol !== "https:") return null;
  } catch {
    return null;
  }

  const priceText = pick(row, ["sale_price", "price"]);
  const availability = normalizeAvailability(pick(row, ["availability", "stock_status"]));
  const primaryText = `${title} ${productType} ${tags}`;
  const allText = `${primaryText} ${description}`;
  const rental = /rental|rent\b/i.test(allText);
  const themes = themeDefinitions
    .filter(([, pattern]) => pattern.test(allText))
    .map(([theme]) => theme);
  if (!themes.length) return null;

  return {
    externalId,
    variantId: tracking.destinationUrl.searchParams.get("variant") || pick(row, ["variant_id", "item_group_id"]),
    title,
    productType,
    price: parsePrice(priceText),
    currency: priceText.match(/\b[A-Z]{3}\b/)?.[0] || pick(row, ["currency"]) || "USD",
    availability,
    destinationUrl: tracking.destinationUrl.toString(),
    trackingUrl: tracking.trackingUrl.toString(),
    aid: tracking.aid,
    imageUrl,
    rental,
    description: description.slice(0, 220),
    themes,
    primaryText,
  };
}

function scoreCandidate(candidate, pattern) {
  let score = 500;
  if (candidate.availability === "in stock") score += 180;
  else if (candidate.availability === "preorder" || candidate.availability === "backorder") score += 40;
  else if (candidate.availability === "out of stock") score -= 260;
  if (pattern.test(candidate.primaryText)) score += 160;
  if (candidate.rental) score -= 180;
  else score += 60;
  if (candidate.price != null) score += 25;
  if (candidate.description) score += 10;
  return score;
}

const { stream, completion } = openExport(exportPath);
const buckets = new Map(themeDefinitions.map(([theme]) => [theme, []]));
const counts = new Map(themeDefinitions.map(([theme]) => [theme, 0]));
let headers = null;
let sourceRows = 0;
let eligibleRows = 0;

for await (const values of parseDelimited(stream)) {
  if (!headers) {
    headers = values.map(normalizeHeader);
    continue;
  }
  if (!values.some(Boolean)) continue;
  sourceRows += 1;
  const row = Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
  const candidate = candidateFor(row);
  if (!candidate) continue;
  eligibleRows += 1;

  for (const [theme, pattern] of themeDefinitions) {
    if (!candidate.themes.includes(theme)) continue;
    counts.set(theme, counts.get(theme) + 1);
    const score = scoreCandidate(candidate, pattern);
    const key = `${candidate.externalId}\u0000${candidate.variantId}`;
    const bucket = buckets.get(theme);
    const previous = bucket.findIndex((item) => item.key === key);
    if (previous >= 0 && bucket[previous].score >= score) continue;
    if (previous >= 0) bucket.splice(previous, 1);
    bucket.push({ key, score, candidate });
    bucket.sort((left, right) => right.score - left.score || left.key.localeCompare(right.key));
    if (bucket.length > reportLimit) bucket.length = reportLimit;
  }
}
await completion;

console.log(JSON.stringify({
  ok: true,
  sourceRows,
  eligibleRows,
  counts: Object.fromEntries(counts),
  themes: Object.fromEntries(
    [...buckets].map(([theme, items]) => [
      theme,
      items.map(({ score, candidate }) => {
        const { primaryText, ...publicCandidate } = candidate;
        void primaryText;
        return { score, ...publicCandidate };
      }),
    ]),
  ),
}));

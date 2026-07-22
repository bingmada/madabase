import crypto from "node:crypto";
import fs from "node:fs";
import { spawn } from "node:child_process";
import { finished } from "node:stream/promises";
import { Pool } from "pg";

const exportPath = process.env.CJ_PRODUCT_EXPORT_PATH;
const databaseUrl = process.env.DATABASE_URL;
const expectedPid = process.env.CJ_COSTUME_PID;
const subscriptionId = process.env.CJ_PRODUCT_EXPORT_SUBSCRIPTION_ID || "319553";
const merchantCid = "7889430";
const imagePermissionRef = (process.env.CJ_PRODUCT_IMAGE_PERMISSION_REF
  ?? "https://developers.cj.com/docs/data-imports/product-feeds (accessed 2026-07-22; CJ Product Feed image-link and additional-image-link publisher-use guidance)").trim();
const dryRun = process.argv.includes("--dry-run") || process.env.CJ_SYNC_DRY_RUN === "1";
const selectionLimit = Number(process.env.CJ_SYNC_LIMIT || 1000);

const missing = [
  ["CJ_PRODUCT_EXPORT_PATH", exportPath],
  ["CJ_COSTUME_PID", expectedPid],
  ...(!dryRun ? [["DATABASE_URL", databaseUrl]] : []),
].filter(([, value]) => !value);

if (missing.length) {
  console.error(`Missing required env vars: ${missing.map(([key]) => key).join(", ")}`);
  process.exit(1);
}
if (!Number.isInteger(selectionLimit) || selectionLimit < 1 || selectionLimit > 50_000) {
  throw new Error("CJ_SYNC_LIMIT must be an integer between 1 and 50000");
}
if (!imagePermissionRef.startsWith("https://developers.cj.com/")) {
  throw new Error("CJ_PRODUCT_IMAGE_PERMISSION_REF must point to the official developers.cj.com documentation used for Feed-image authorization");
}

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

function validUrl(value, allowedHost) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && (!allowedHost || url.hostname === allowedHost || url.hostname === `www.${allowedHost}`) ? url : null;
  } catch {
    return null;
  }
}

function cjLinkIdentity(value) {
  try {
    const url = new URL(value);
    const match = url.pathname.match(/\/click-(\d+)-(\d+)(?:\/|$)/);
    if (!match) return null;
    return { pid: match[1], aid: match[2] };
  } catch {
    return null;
  }
}

function cjProductLink(value) {
  const tracking = cjLinkIdentity(value);
  if (!tracking) return null;
  try {
    const trackingUrl = new URL(value);
    const destination = validUrl(trackingUrl.searchParams.get("url") || "", "abracadabranyc.com");
    return destination ? { destination, tracking, trackingUrl: trackingUrl.toString() } : null;
  } catch {
    return null;
  }
}

function parsePrice(value) {
  const match = value.replaceAll(",", "").match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function slugify(value) {
  return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 90) || "product";
}

function classify(title, productType, description) {
  const primary = `${title} ${productType}`.toLowerCase();
  const secondary = description.toLowerCase();
  if (/\b(prop|animatronic|animated|weapon|sword|axe|skeleton|statue|figure|decoration)\b/.test(primary)) return "props-animatronics";
  if (/\b(mask|prosthetic|appliance|fangs?|teeth|latex mask)\b/.test(primary)) return "masks-prosthetics";
  if (/\b(wig|facial hair|makeup|make-up|cosmetic|eyelash|beard|moustache|mustache|face paint)\b/.test(primary)) return "wigs-makeup";
  if (/\b(costume|dress|jacket|coat|suit|robe|tights|corset|catsuit|mascot|uniform)\b/.test(primary)) return "costumes";
  if (/\b(prosthetic|wig|makeup|facial hair)\b/.test(secondary)) return /\b(prosthetic)\b/.test(secondary) ? "masks-prosthetics" : "wigs-makeup";
  return "accessories-party-effects";
}

function normalizeAvailability(value) {
  const clean = value.toLowerCase().replaceAll("_", " ").trim();
  if (["in stock", "out of stock", "preorder", "backorder"].includes(clean)) return clean;
  return clean || "unknown";
}

function stableToken(value) {
  return crypto.createHash("sha256").update(value).digest("base64url").slice(0, 32);
}

const categoryShares = [
  ["costumes", 0.30],
  ["accessories-party-effects", 0.20],
  ["masks-prosthetics", 0.18],
  ["props-animatronics", 0.18],
  ["wigs-makeup", 0.14],
];

function categoryQuotas(limit) {
  const quotas = new Map();
  let allocated = 0;
  for (const [category, share] of categoryShares) {
    const quota = Math.floor(limit * share);
    quotas.set(category, quota);
    allocated += quota;
  }
  for (let index = 0; allocated < limit; index = (index + 1) % categoryShares.length) {
    const category = categoryShares[index][0];
    quotas.set(category, quotas.get(category) + 1);
    allocated += 1;
  }
  return quotas;
}

function selectionScore(product) {
  let score = 0;
  if (product.tracking?.pid === expectedPid) score += 500;
  else if (product.tracking) score += 100;
  if (product.availability === "in stock") score += 140;
  else if (product.availability === "preorder" || product.availability === "backorder") score += 45;
  else if (product.availability === "out of stock") score -= 180;
  if (product.price != null) score += 30;
  if (product.imageUrls.length) score += 15;
  if (product.description) score += 10;
  if (product.brand) score += 5;
  if (product.productType) score += 15;
  if (product.premium) score += 45;
  if (product.halloween) score += 20;
  if (product.rental) score += 5;
  return score;
}

function compareCandidate(left, right) {
  return right.score - left.score || left.key.localeCompare(right.key);
}

function addBoundedCandidate(bucket, candidate, limit) {
  if (limit < 1) return;
  bucket.push(candidate);
  if (bucket.length >= limit * 2) {
    bucket.sort(compareCandidate);
    bucket.length = limit;
  }
}

function finalizeCandidates(bucket, limit) {
  bucket.sort(compareCandidate);
  bucket.length = Math.min(bucket.length, limit);
  return bucket;
}

function chunk(items, size) {
  const batches = [];
  for (let index = 0; index < items.length; index += size) batches.push(items.slice(index, index + size));
  return batches;
}

function databaseProduct(product) {
  const copy = { ...product };
  delete copy.imageUrls;
  delete copy.trackingUrl;
  delete copy.tracking;
  return copy;
}

function normalizeProduct(row) {
  const externalId = pick(row, ["id", "sku", "advertiser_sku", "manufacturer_sku", "merchant_product_id"]);
  const title = pick(row, ["title", "name", "product_name"]);
  const rawLink = pick(row, ["link", "buy_url", "buyurl", "tracking_url", "affiliate_url", "advertiser_deep_link"]);
  const cjLink = cjProductLink(rawLink);
  const destination = cjLink?.destination || validUrl(
    pick(row, ["destination_url", "destinationurl", "product_url", "mobile_link", "ads_redirect"]),
    "abracadabranyc.com",
  );
  if (!externalId || !title) {
    return { rejection: "missingIdentity" };
  }
  if (!destination) {
    return { rejection: "invalidDestination" };
  }

  const variantId = destination.searchParams.get("variant") || pick(row, ["variant_id", "item_group_id"]) || "";
  const productType = pick(row, ["product_type", "google_product_category", "category"]);
  const description = pick(row, ["description"]);
  const categorySource = [title, productType, description].join(" ");
  const priceText = pick(row, ["sale_price", "price"]);
  const currency = (priceText.match(/\b[A-Z]{3}\b/)?.[0] || pick(row, ["currency"]) || "USD").toUpperCase();
  const imageUrls = [
    pick(row, ["image_link", "image_url", "image"]),
    ...pick(row, ["additional_image_link", "additional_image_urls"]).split(","),
  ].map((value) => value.trim()).filter((value) => validUrl(value));
  const trackingUrl = cjLink?.trackingUrl || "";
  const tracking = cjLink?.tracking || null;
  const price = parsePrice(priceText);

  return { product: {
    id: crypto.randomUUID(),
    externalId,
    variantId,
    sourceFeedId: pick(row, ["feed_id", "catalog_id"]) || subscriptionId,
    slug: `${slugify(title)}-${stableToken(`${externalId}:${variantId}`).slice(0, 7).toLowerCase()}`,
    title,
    description,
    brand: pick(row, ["brand", "manufacturer"]),
    productType,
    categorySlug: classify(title, productType, description),
    tags: pick(row, ["tags", "keywords"]).split(/[,|]/).map((value) => value.trim()).filter(Boolean).slice(0, 40),
    audience: [pick(row, ["age_group"]), pick(row, ["gender"])].filter(Boolean),
    price,
    currency,
    availability: normalizeAvailability(pick(row, ["availability", "stock_status"])),
    destinationUrl: destination.toString(),
    premium: price != null && price >= 1000,
    professional: /professional|theatrical|stage|prosthetic|animatronic/i.test(categorySource),
    halloween: /halloween|spooky|haunted|costume/i.test(categorySource),
    rental: /rental|rent\b/i.test(categorySource),
    raw: row,
    imageUrls: [...new Set(imageUrls)],
    trackingUrl,
    tracking,
  } };
}

const quotas = categoryQuotas(selectionLimit);
const categoryBuckets = new Map(categoryShares.map(([category]) => [category, []]));
const globalCandidates = [];
const eligibleCategories = Object.fromEntries(categoryShares.map(([category]) => [category, 0]));
const { stream: exportStream, completion: exportCompletion } = openExport(exportPath);
let headers = null;
let sourceRows = 0;
let eligible = 0;
let rejected = 0;
const rejectionReasons = { missingIdentity: 0, invalidDestination: 0 };

for await (const values of parseDelimited(exportStream)) {
  if (!headers) {
    headers = values.map(normalizeHeader);
    continue;
  }
  if (!values.some(Boolean)) continue;
  sourceRows += 1;
  const row = Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
  const { product, rejection } = normalizeProduct(row);
  if (!product) {
    rejected += 1;
    rejectionReasons[rejection] += 1;
    continue;
  }

  eligible += 1;
  eligibleCategories[product.categorySlug] += 1;
  const candidate = {
    product,
    score: selectionScore(product),
    key: `${product.externalId}\u0000${product.variantId}`,
  };
  addBoundedCandidate(categoryBuckets.get(product.categorySlug), candidate, quotas.get(product.categorySlug));
  addBoundedCandidate(globalCandidates, candidate, selectionLimit);
}
await exportCompletion;
if (!headers || sourceRows === 0) throw new Error("CJ export has no product rows");

const selectedCandidates = [];
const selectedKeys = new Set();
for (const [category] of categoryShares) {
  for (const candidate of finalizeCandidates(categoryBuckets.get(category), quotas.get(category))) {
    selectedCandidates.push(candidate);
    selectedKeys.add(candidate.key);
  }
}
for (const candidate of finalizeCandidates(globalCandidates, selectionLimit)) {
  if (selectedCandidates.length >= selectionLimit) break;
  if (selectedKeys.has(candidate.key)) continue;
  selectedCandidates.push(candidate);
  selectedKeys.add(candidate.key);
}
selectedCandidates.sort(compareCandidate);
const normalized = selectedCandidates.map(({ product }) => product);
const now = new Date();

const audit = {
  ok: true,
  dryRun,
  sourceRows,
  eligible,
  selectionLimit,
  selectionMode: "balanced-relevance",
  accepted: normalized.length,
  rejected,
  rejectionReasons,
  trackingLinks: normalized.filter((product) => product.tracking).length,
  expectedPidLinks: normalized.filter((product) => product.tracking?.pid === expectedPid).length,
  unexpectedPidLinks: normalized.filter((product) => product.tracking && product.tracking.pid !== expectedPid).length,
  withImages: normalized.filter((product) => product.imageUrls.length > 0).length,
  withPrices: normalized.filter((product) => product.price != null).length,
  premium: normalized.filter((product) => product.premium).length,
  professional: normalized.filter((product) => product.professional).length,
  halloween: normalized.filter((product) => product.halloween).length,
  availability: Object.fromEntries(
    [...new Set(normalized.map((product) => product.availability))]
      .sort()
      .map((availability) => [availability, normalized.filter((product) => product.availability === availability).length]),
  ),
  priceBands: {
    under50: normalized.filter((product) => product.price != null && product.price < 50).length,
    from50To199: normalized.filter((product) => product.price != null && product.price >= 50 && product.price < 200).length,
    from200To999: normalized.filter((product) => product.price != null && product.price >= 200 && product.price < 1000).length,
    from1000: normalized.filter((product) => product.price != null && product.price >= 1000).length,
  },
  categories: Object.fromEntries(
    [...new Set(normalized.map((product) => product.categorySlug))]
      .sort()
      .map((category) => [category, normalized.filter((product) => product.categorySlug === category).length]),
  ),
  eligibleCategories,
};

if (dryRun) {
  console.log(JSON.stringify(audit, null, 2));
  process.exit(0);
}

const pool = new Pool({ connectionString: databaseUrl, max: 4 });
const client = await pool.connect();
const runId = crypto.randomUUID();

try {
  await client.query("BEGIN");
  const merchantResult = await client.query(
    `INSERT INTO "Merchant" ("id", "slug", "name", "network", "advertiserCid", "createdAt", "updatedAt")
     VALUES ($1, 'abracadabra-nyc', 'Abracadabra NYC', 'cj', $2, NOW(), NOW())
     ON CONFLICT ("network", "advertiserCid") DO UPDATE SET "name" = EXCLUDED."name", "updatedAt" = NOW()
     RETURNING "id"`,
    [crypto.randomUUID(), merchantCid],
  );
  const merchantId = merchantResult.rows[0].id;
  await client.query(
    `INSERT INTO "ProductSyncRun" ("id", "merchantId", "source", "status", "seenCount", "failedCount", "startedAt")
     VALUES ($1, $2, 'cj-product-export', 'running', $3, $4, $5)`,
    [runId, merchantId, normalized.length, rejected, now],
  );

  let insertedOrUpdated = 0;
  for (const batch of chunk(normalized, 400)) {
    const productPayload = batch.map(databaseProduct);
    const result = await client.query(
      `WITH input AS (
         SELECT * FROM jsonb_to_recordset($2::jsonb) AS x(
           "id" text, "externalId" text, "variantId" text, "sourceFeedId" text, "slug" text,
           "title" text, "description" text, "brand" text, "productType" text, "categorySlug" text,
           "tags" text[], "audience" text[], "price" numeric, "currency" text, "availability" text,
           "destinationUrl" text, "premium" boolean, "professional" boolean, "halloween" boolean,
           "rental" boolean, "raw" jsonb
         )
       )
       INSERT INTO "MerchantProduct" (
         "id", "merchantId", "externalId", "variantId", "sourceFeedId", "slug", "title", "description",
         "brand", "productType", "categorySlug", "tags", "audience", "price", "currency", "availability",
         "destinationUrl", "premium", "professional", "halloween", "rental", "firstSeenAt", "lastSeenAt",
         "raw", "createdAt", "updatedAt"
       )
       SELECT "id", $1, "externalId", "variantId", NULLIF("sourceFeedId", ''), "slug", "title", NULLIF("description", ''),
         NULLIF("brand", ''), NULLIF("productType", ''), "categorySlug", "tags", "audience", "price", "currency",
         "availability", "destinationUrl", "premium", "professional", "halloween", "rental", $3, $3, "raw", NOW(), NOW()
       FROM input
       ON CONFLICT ("merchantId", "externalId", "variantId") DO UPDATE SET
         "sourceFeedId" = EXCLUDED."sourceFeedId", "title" = EXCLUDED."title", "description" = EXCLUDED."description",
         "brand" = EXCLUDED."brand", "productType" = EXCLUDED."productType", "categorySlug" = EXCLUDED."categorySlug",
         "tags" = EXCLUDED."tags", "audience" = EXCLUDED."audience", "price" = EXCLUDED."price",
         "currency" = EXCLUDED."currency", "availability" = EXCLUDED."availability",
         "destinationUrl" = EXCLUDED."destinationUrl", "premium" = EXCLUDED."premium",
         "professional" = EXCLUDED."professional", "halloween" = EXCLUDED."halloween", "rental" = EXCLUDED."rental",
         "lastSeenAt" = EXCLUDED."lastSeenAt", "softRetiredAt" = NULL, "raw" = EXCLUDED."raw", "updatedAt" = NOW()
       RETURNING "id", "externalId", "variantId"`,
      [merchantId, JSON.stringify(productPayload), now],
    );
    insertedOrUpdated += result.rowCount ?? 0;
    const ids = new Map(result.rows.map((row) => [`${row.externalId}\u0000${row.variantId}`, row.id]));

    for (const product of batch) {
      const productId = ids.get(`${product.externalId}\u0000${product.variantId}`);
      if (!productId) continue;
      for (const [position, url] of product.imageUrls.entries()) {
        await client.query(
          `INSERT INTO "MerchantProductImage" ("id", "productId", "url", "position", "usageStatus", "permissionRef", "createdAt", "updatedAt")
           VALUES ($1, $2, $3, $4, 'authorized', $5, NOW(), NOW())
           ON CONFLICT ("productId", "url") DO UPDATE SET
             "position" = EXCLUDED."position", "usageStatus" = 'authorized',
             "permissionRef" = EXCLUDED."permissionRef", "updatedAt" = NOW()`,
          [crypto.randomUUID(), productId, url, position, imagePermissionRef],
        );
      }

      if (product.tracking && product.tracking.pid === expectedPid) {
        await client.query(
          `INSERT INTO "AffiliateLink" (
             "id", "network", "merchantId", "merchantProductId", "site", "pid", "aid", "clickToken",
             "destinationUrl", "trackingUrl", "active", "createdAt", "updatedAt"
           ) VALUES ($1, 'cj', $2, $3, 'costume', $4, $5, $6, $7, $8, false, NOW(), NOW())
           ON CONFLICT ("clickToken") DO UPDATE SET
             "merchantProductId" = EXCLUDED."merchantProductId", "destinationUrl" = EXCLUDED."destinationUrl",
             "trackingUrl" = EXCLUDED."trackingUrl", "aid" = EXCLUDED."aid",
             "active" = CASE
               WHEN "AffiliateLink"."trackingUrl" = EXCLUDED."trackingUrl"
                 AND "AffiliateLink"."destinationUrl" = EXCLUDED."destinationUrl"
                 AND "AffiliateLink"."aid" = EXCLUDED."aid"
               THEN "AffiliateLink"."active" ELSE false END,
             "verifiedAt" = CASE
               WHEN "AffiliateLink"."trackingUrl" = EXCLUDED."trackingUrl"
                 AND "AffiliateLink"."destinationUrl" = EXCLUDED."destinationUrl"
                 AND "AffiliateLink"."aid" = EXCLUDED."aid"
               THEN "AffiliateLink"."verifiedAt" ELSE NULL END,
             "lastCheckedAt" = CASE
               WHEN "AffiliateLink"."trackingUrl" = EXCLUDED."trackingUrl"
                 AND "AffiliateLink"."destinationUrl" = EXCLUDED."destinationUrl"
                 AND "AffiliateLink"."aid" = EXCLUDED."aid"
               THEN "AffiliateLink"."lastCheckedAt" ELSE NULL END,
             "updatedAt" = NOW()`,
          [crypto.randomUUID(), merchantId, productId, product.tracking.pid, product.tracking.aid, stableToken(`${product.externalId}:${product.variantId}:${expectedPid}:${product.tracking.aid}`), product.destinationUrl, product.trackingUrl],
        );
      }
    }
  }

  const retiredResult = await client.query(
    `UPDATE "MerchantProduct"
     SET "availability" = 'out of stock', "softRetiredAt" = COALESCE("softRetiredAt", NOW()), "updatedAt" = NOW()
     WHERE "merchantId" = $1 AND "lastSeenAt" < $2 AND "softRetiredAt" IS NULL`,
    [merchantId, now],
  );
  await client.query(
    `UPDATE "ProductSyncRun" SET "status" = 'completed', "updatedCount" = $2, "retiredCount" = $3,
       "completedAt" = NOW() WHERE "id" = $1`,
    [runId, insertedOrUpdated, retiredResult.rowCount ?? 0],
  );
  await client.query("COMMIT");
  console.log(JSON.stringify({ ok: true, runId, seen: normalized.length, rejected, retired: retiredResult.rowCount ?? 0 }));
} catch (error) {
  await client.query("ROLLBACK");
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  client.release();
  await pool.end();
}

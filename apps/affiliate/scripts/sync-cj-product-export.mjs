import crypto from "node:crypto";
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { Pool } from "pg";

const exportPath = process.env.CJ_PRODUCT_EXPORT_PATH;
const databaseUrl = process.env.DATABASE_URL;
const expectedPid = process.env.CJ_COSTUME_PID;
const subscriptionId = process.env.CJ_PRODUCT_EXPORT_SUBSCRIPTION_ID || "319553";
const merchantCid = "7889430";
const dryRun = process.argv.includes("--dry-run") || process.env.CJ_SYNC_DRY_RUN === "1";

const missing = [
  ["CJ_PRODUCT_EXPORT_PATH", exportPath],
  ["CJ_COSTUME_PID", expectedPid],
  ...(!dryRun ? [["DATABASE_URL", databaseUrl]] : []),
].filter(([, value]) => !value);

if (missing.length) {
  console.error(`Missing required env vars: ${missing.map(([key]) => key).join(", ")}`);
  process.exit(1);
}

function readExport(pathname) {
  if (!fs.existsSync(pathname)) throw new Error(`CJ export does not exist: ${pathname}`);
  if (pathname.toLowerCase().endsWith(".zip")) {
    return execFileSync("unzip", ["-p", pathname], { encoding: "utf8", maxBuffer: 512 * 1024 * 1024 });
  }
  return fs.readFileSync(pathname, "utf8");
}

function parseDelimited(text, delimiter = "\t") {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (quoted) {
      if (char === '"' && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"' && field === "") quoted = true;
    else if (char === delimiter) {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      field = "";
    } else field += char;
  }

  if (field || row.length) {
    row.push(field.replace(/\r$/, ""));
    rows.push(row);
  }
  return rows;
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

function classify(text) {
  const value = text.toLowerCase();
  if (/mask|prosthetic|latex/.test(value)) return "masks-prosthetics";
  if (/wig|facial hair|makeup|cosmetic|eyelash/.test(value)) return "wigs-makeup";
  if (/prop|animatronic|weapon|sword|axe|skeleton|statue|figure/.test(value)) return "props-animatronics";
  if (/costume|dress|jacket|coat|suit|robe|tights|corset|catsuit/.test(value)) return "costumes";
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

const parsed = parseDelimited(readExport(exportPath));
if (parsed.length < 2) throw new Error("CJ export has no product rows");
const headers = parsed[0].map(normalizeHeader);
const inputRows = parsed.slice(1).filter((values) => values.some(Boolean)).map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])));
const now = new Date();
const normalized = [];
let rejected = 0;
const rejectionReasons = { missingIdentity: 0, invalidDestination: 0 };

for (const row of inputRows) {
  const externalId = pick(row, ["id", "sku", "advertiser_sku", "manufacturer_sku", "merchant_product_id"]);
  const title = pick(row, ["title", "name", "product_name"]);
  const rawLink = pick(row, ["link", "buy_url", "buyurl", "tracking_url", "affiliate_url", "advertiser_deep_link"]);
  const cjLink = cjProductLink(rawLink);
  const destination = cjLink?.destination || validUrl(
    pick(row, ["destination_url", "destinationurl", "product_url", "mobile_link", "ads_redirect"]),
    "abracadabranyc.com",
  );
  if (!externalId || !title) {
    rejected += 1;
    rejectionReasons.missingIdentity += 1;
    continue;
  }
  if (!destination) {
    rejected += 1;
    rejectionReasons.invalidDestination += 1;
    continue;
  }

  const variantId = destination.searchParams.get("variant") || pick(row, ["variant_id", "item_group_id"]) || "";
  const categorySource = [title, pick(row, ["product_type", "google_product_category", "category"]), pick(row, ["description"])].join(" ");
  const priceText = pick(row, ["sale_price", "price"]);
  const currency = (priceText.match(/\b[A-Z]{3}\b/)?.[0] || pick(row, ["currency"]) || "USD").toUpperCase();
  const imageUrls = [
    pick(row, ["image_link", "image_url", "image"]),
    ...pick(row, ["additional_image_link", "additional_image_urls"]).split(","),
  ].map((value) => value.trim()).filter((value) => validUrl(value));
  const trackingUrl = cjLink?.trackingUrl || "";
  const tracking = cjLink?.tracking || null;
  const price = parsePrice(priceText);

  normalized.push({
    id: crypto.randomUUID(),
    externalId,
    variantId,
    sourceFeedId: pick(row, ["feed_id", "catalog_id"]) || subscriptionId,
    slug: `${slugify(title)}-${stableToken(`${externalId}:${variantId}`).slice(0, 7).toLowerCase()}`,
    title,
    description: pick(row, ["description"]),
    brand: pick(row, ["brand", "manufacturer"]),
    productType: pick(row, ["product_type", "google_product_category", "category"]),
    categorySlug: classify(categorySource),
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
  });
}

const audit = {
  ok: true,
  dryRun,
  sourceRows: inputRows.length,
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
  categories: Object.fromEntries(
    [...new Set(normalized.map((product) => product.categorySlug))]
      .sort()
      .map((category) => [category, normalized.filter((product) => product.categorySlug === category).length]),
  ),
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
          `INSERT INTO "MerchantProductImage" ("id", "productId", "url", "position", "usageStatus", "createdAt", "updatedAt")
           VALUES ($1, $2, $3, $4, 'pending', NOW(), NOW())
           ON CONFLICT ("productId", "url") DO UPDATE SET "position" = EXCLUDED."position", "updatedAt" = NOW()`,
          [crypto.randomUUID(), productId, url, position],
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
             "trackingUrl" = EXCLUDED."trackingUrl", "aid" = EXCLUDED."aid", "active" = false,
             "verifiedAt" = NULL, "updatedAt" = NOW()`,
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

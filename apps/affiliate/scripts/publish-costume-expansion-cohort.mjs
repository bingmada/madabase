import crypto from "node:crypto";
import { Pool } from "pg";

const apply = process.argv.includes("--apply");
const databaseUrl = process.env.DATABASE_URL;
const expectedPid = process.env.CJ_COSTUME_PID;
const allowedTrackingHosts = ["anrdoezrs.net", "dpbolvw.net", "jdoqocy.com", "kqzyfj.com", "qksrv.net", "tkqlhce.com"];

if (!databaseUrl || !expectedPid) {
  console.error("DATABASE_URL and CJ_COSTUME_PID are required");
  process.exit(1);
}

const families = [
  { key: "inflatable-costumes", category: "costumes", target: 4, include: /\binflat(?:able|ing)\b.*\bcostume\b|\bcostume\b.*\binflat(?:able|ing)\b/i, exclude: /decoration|yard|outdoor/i, use: "an inflatable wearable costume with a manageable fan, battery, movement, visibility, and event-duration plan" },
  { key: "mascot-costumes", category: "costumes", target: 4, include: /\bmascot\b/i, exclude: /head only|mask only/i, use: "a mascot, parade, promotion, performance, or full-character appearance" },
  { key: "historical-theatrical", category: "costumes", target: 4, include: /\b(theatrical|renaissance|victorian|medieval|period costume|historical)\b/i, exclude: /book|decoration/i, use: "a theater, historical, themed-event, or reusable period-costume wardrobe" },
  { key: "plus-size-costumes", category: "costumes", target: 4, include: /\b(plus size|plus-size|1x|2x|3x|4x|5x)\b/i, exclude: /tights?|stockings?|wig|mask/i, use: "a measured plus-size costume with enough movement, layering room, and a workable return path" },
  { key: "couples-groups", category: "costumes", target: 4, include: /\b(couple|couples|group|family set|duo)\b/i, exclude: /accessor|jewelry/i, use: "a coordinated couple, family, or group look whose pieces, sizing, timing, and responsibilities are explicit" },
  { key: "silicone-masks", category: "masks-prosthetics", target: 4, include: /\bsilicone\b.*\bmask\b|\bmask\b.*\bsilicone\b/i, exclude: /display|stand/i, use: "a premium creature or character transformation where exact head fit, ventilation, vision, weight, and realistic wear time are understood" },
  { key: "foam-latex-prosthetics", category: "masks-prosthetics", target: 4, include: /\bfoam latex\b|\blatex prosthetic\b|\bprosthetic appliance\b/i, exclude: /mask|kit without/i, use: "a practiced prosthetic application with compatible adhesive, makeup, ventilation, removal, and skin-contact checks" },
  { key: "adhesives-removers", category: "wigs-makeup", target: 4, include: /\b(spirit gum|prosthetic adhesive|medical adhesive|adhesive remover|spirit gum remover)\b/i, exclude: /eyelash|nail glue/i, use: "a compatible theatrical makeup, wig, facial-hair, or prosthetic application-and-removal system" },
  { key: "uv-projectors", category: "accessories-party-effects", target: 4, include: /\b(blacklight|black light|uv light|spotlight|projector)\b/i, exclude: /makeup|paint|costume/i, use: "a measured indoor or weather-protected Halloween lighting scene with a safe power, aiming, cable, and guest-clearance plan" },
  { key: "outdoor-props", category: "props-animatronics", target: 4, include: /\b(inflatable|graveyard|tombstone|outdoor prop|yard prop|cemetery)\b/i, exclude: /costume|mask|wig|makeup/i, use: "an outdoor or porch Halloween display with verified dimensions, anchoring, weather limits, power, guest clearance, and storage" },
];

function normalizedUrl(value) {
  const url = new URL(value);
  url.hash = "";
  url.searchParams.sort();
  return url.toString();
}

function normalizedTitle(value) {
  return value.toLowerCase().replace(/\b(adult|mens?|womens?|deluxe|premium|professional)\b/g, " ").replace(/[^a-z0-9]+/g, " ").trim();
}

function validateLink(product) {
  try {
    const tracking = new URL(product.trackingUrl);
    const identity = tracking.pathname.match(/\/click-(\d+)-(\d+)(?:\/|$)/);
    const destination = new URL(product.destinationUrl);
    const embedded = tracking.searchParams.get("url");
    const hostAllowed = allowedTrackingHosts.some((host) => tracking.hostname === host || tracking.hostname.endsWith(`.${host}`));
    return Boolean(
      tracking.protocol === "https:"
      && hostAllowed
      && identity
      && identity[1] === expectedPid
      && identity[2] === product.aid
      && product.pid === expectedPid
      && embedded
      && ["abracadabranyc.com", "www.abracadabranyc.com"].includes(destination.hostname)
      && normalizedUrl(embedded) === normalizedUrl(product.destinationUrl)
      && normalizedUrl(product.linkDestinationUrl) === normalizedUrl(product.destinationUrl),
    );
  } catch {
    return false;
  }
}

function score(product) {
  const price = Number(product.price ?? 0);
  return (product.availability === "in stock" ? 120 : 0)
    + (product.halloween ? 30 : 0)
    + (product.professional ? 20 : 0)
    + Math.min((product.description?.length ?? 0) / 25, 30)
    + (price > 0 ? 15 : 0)
    + (product.variantId ? 10 : 0);
}

function chooseFamily(products, family, usedIds, usedTitles) {
  const selected = products
    .filter((product) => !usedIds.has(product.id) && !usedTitles.has(normalizedTitle(product.title)))
    .filter((product) => family.include.test(`${product.title} ${product.productType} ${product.description}`))
    .filter((product) => !family.exclude.test(`${product.title} ${product.productType}`))
    .filter(validateLink)
    .sort((left, right) => score(right) - score(left) || left.title.localeCompare(right.title))
    .slice(0, family.target)
    .map((product) => ({ ...product, family }));
  if (selected.length !== family.target) throw new Error(`${family.key} produced ${selected.length}/${family.target} eligible products`);
  return selected;
}

function editorialFor(product) {
  const price = product.price
    ? new Intl.NumberFormat("en-US", { style: "currency", currency: product.currency }).format(Number(product.price))
    : "a currently listed price";
  const checks = [
    "the exact model, variant, measurements, materials, and included pieces",
    "visibility, movement, skin contact, power, or weather limits that apply",
    "delivery timing, setup, cleanup, storage, and the current return terms",
  ];
  return {
    buyerJob: `Decide whether ${product.title} fits ${product.family.use}; confirm ${checks.join(", ")} before ordering.`,
    summary: `${product.title} is listed by Abracadabra NYC at ${price}. This official-feed buying note identifies the exact variant and the checks that matter before checkout; it is not a hands-on review.`,
    guidance: {
      bestFor: product.family.use,
      confirmBeforeOrdering: checks,
      skipIf: "Skip when the exact identity, fit, materials, included pieces, safe-use limits, delivery window, or storage plan cannot be confirmed.",
    },
    evidence: {
      source: "Abracadabra NYC CJ Product Feed",
      evidenceMode: "official-spec",
      productIdentity: { externalId: product.externalId, variantId: product.variantId },
      selection: `Owner-approved August 2026 additive Costume expansion: ${product.family.key}`,
      linkValidation: "active exact embedded destination, dedicated Costume PID, AID, HTTPS CJ host, and Abracadabra host",
      imagePermissionRef: product.permissionRef,
      reviewedAt: new Date().toISOString(),
      handsOn: false,
    },
  };
}

const pool = new Pool({ connectionString: databaseUrl, max: 2 });
const client = await pool.connect();
try {
  const result = await client.query(
    `SELECT product."id", product."externalId", product."variantId", product."slug", product."title",
       product."description", product."productType", product."price", product."currency", product."availability",
       product."professional", product."halloween", product."destinationUrl",
       image."permissionRef", link."id" AS "linkId", link."pid", link."aid", link."trackingUrl",
       link."destinationUrl" AS "linkDestinationUrl"
     FROM "MerchantProduct" product
     JOIN "Merchant" merchant ON merchant."id" = product."merchantId"
     JOIN LATERAL (
       SELECT image."permissionRef" FROM "MerchantProductImage" image
       WHERE image."productId" = product."id" AND image."usageStatus" = 'authorized' AND image."permissionRef" IS NOT NULL
       ORDER BY image."position" ASC LIMIT 1
     ) image ON true
     JOIN LATERAL (
       SELECT link."id", link."pid", link."aid", link."trackingUrl", link."destinationUrl"
       FROM "AffiliateLink" link
       WHERE link."merchantProductId" = product."id" AND link."site" = 'costume'
         AND link."network" = 'cj' AND link."pid" = $1 AND link."active" = true AND link."verifiedAt" IS NOT NULL
       ORDER BY link."updatedAt" DESC LIMIT 1
     ) link ON true
     WHERE merchant."slug" = 'abracadabra-nyc' AND merchant."advertiserCid" = '7889430'
       AND product."softRetiredAt" IS NULL AND product."availability" <> 'out of stock'
       AND NOT EXISTS (
         SELECT 1 FROM "EditorialProduct" editorial
         WHERE editorial."merchantProductId" = product."id" AND editorial."status" = 'published' AND editorial."indexable" = true
       )`,
    [expectedPid],
  );
  const selected = [];
  const usedIds = new Set();
  const usedTitles = new Set();
  for (const family of families) {
    const picks = chooseFamily(result.rows, family, usedIds, usedTitles);
    for (const product of picks) {
      selected.push(product);
      usedIds.add(product.id);
      usedTitles.add(normalizedTitle(product.title));
    }
  }
  console.log(JSON.stringify({
    mode: apply ? "apply" : "preview",
    sourceProducts: result.rows.length,
    selected: selected.length,
    exactLinks: selected.filter(validateLink).length,
    authorizedImages: selected.filter((product) => product.permissionRef).length,
    families: Object.fromEntries(families.map((family) => [family.key, selected.filter((product) => product.family.key === family.key).length])),
  }));
  selected.forEach((product) => console.log(`${product.family.key} | ${product.price ?? "n/a"} ${product.currency} | ${product.title} | ${product.slug}`));
  if (!apply) process.exit(0);

  await client.query("BEGIN");
  for (const product of selected) {
    const editorial = editorialFor(product);
    await client.query(
      `UPDATE "MerchantProduct" SET "categorySlug" = $1, "updatedAt" = NOW() WHERE "id" = $2`,
      [product.family.category, product.id],
    );
    await client.query(
      `INSERT INTO "EditorialProduct" (
         "id", "merchantProductId", "slug", "status", "indexable", "buyerJob", "summary", "guidance", "evidence",
         "curatedAt", "publishedAt", "createdAt", "updatedAt"
       ) VALUES ($1, $2, $3, 'published', true, $4, $5, $6::jsonb, $7::jsonb, NOW(), NOW(), NOW(), NOW())
       ON CONFLICT ("merchantProductId") DO UPDATE SET
         "slug" = EXCLUDED."slug", "status" = 'published', "indexable" = true,
         "buyerJob" = EXCLUDED."buyerJob", "summary" = EXCLUDED."summary",
         "guidance" = EXCLUDED."guidance", "evidence" = EXCLUDED."evidence",
         "curatedAt" = NOW(), "publishedAt" = COALESCE("EditorialProduct"."publishedAt", NOW()), "updatedAt" = NOW()`,
      [
        crypto.randomUUID(),
        product.id,
        product.slug,
        editorial.buyerJob,
        editorial.summary,
        JSON.stringify(editorial.guidance),
        JSON.stringify(editorial.evidence),
      ],
    );
  }
  await client.query("COMMIT");
  console.log(JSON.stringify({ ok: true, published: selected.length, additive: true }));
} catch (error) {
  try { await client.query("ROLLBACK"); } catch {}
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  client.release();
  await pool.end();
}


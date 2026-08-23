import crypto from "node:crypto";
import { Pool } from "pg";
import { assertSearchRecoveryPublishingAllowed } from "./search-recovery-freeze.mjs";

const apply = process.argv.includes("--apply");
if (apply) assertSearchRecoveryPublishingAllowed({ sites: "costume", action: "new-indexable-cohort" });
const databaseUrl = process.env.DATABASE_URL;
const expectedPid = process.env.CJ_COSTUME_PID;
const allowedTrackingHosts = ["anrdoezrs.net", "dpbolvw.net", "jdoqocy.com", "kqzyfj.com", "qksrv.net", "tkqlhce.com"];

if (!databaseUrl || !expectedPid) {
  console.error("DATABASE_URL and CJ_COSTUME_PID are required");
  process.exit(1);
}

const families = [
  { key: "high-end-costumes", category: "costumes", target: 4, include: /^(High End Costume|Costume Rental - High End Costume)$/i, exclude: /accessor/i, use: "a premium or rental-grade costume whose exact pieces, measurements, deposit or return terms, and event workflow are understood" },
  { key: "mascot-costumes", category: "costumes", target: 4, include: /^Mascots$/i, exclude: /head only|mask only/i, use: "a mascot, parade, promotion, performance, or full-character appearance" },
  { key: "historical-theatrical", category: "costumes", target: 4, include: /^(Costume Rental - Colonial & Victorian|Colonial & Victorian|Costume Rental - Middle Ages|Costume Rental - 1920's-1950's|The Ages - 1920's-1950's)$/i, exclude: /accessor/i, use: "a theater, historical, themed-event, or reusable period-costume wardrobe" },
  { key: "adult-costumes", category: "costumes", target: 4, include: /^(Adult Costume|Adult Costume - Adult Womens Costume|Adult Costume - Men's Costume)$/i, exclude: /accessor/i, use: "an adult costume with measured fit, complete-piece inventory, movement room, and a workable return path" },
  { key: "child-costumes", category: "costumes", target: 4, include: /^Child Costume$/i, exclude: /accessor/i, use: "a child costume whose fit, visibility, movement, warmth, supervision, and event duration are appropriate" },
  { key: "costume-wigs", category: "wigs-makeup", target: 4, include: /^Wigs$/i, exclude: /stand|display/i, use: "a costume wig with understood cap fit, fiber and heat limits, styling, secure wear, detangling, and storage" },
  { key: "masks-masquerade", category: "masks-prosthetics", target: 4, include: /^(Masks|Masks-Masquerade|Silicone Masks)$/i, exclude: /display|stand/i, use: "a mask-based transformation where exact head fit, ventilation, vision, weight, skin contact, and realistic wear time are understood" },
  { key: "prosthetics-sfx", category: "masks-prosthetics", target: 4, include: /^(Makeup - Prosthetics|Makeup - Special Effects Makeup|Gore)$/i, exclude: /kit without/i, use: "a practiced prosthetic or special-effects application with compatible materials, ventilation, removal, and skin-contact checks" },
  { key: "theatrical-makeup", category: "wigs-makeup", target: 4, include: /^Makeup - (Paints|Beauty Makeup|Body Gems|Blood|Teeth|Glitter|Contacts|Hairspray)$/i, exclude: /display/i, use: "a theatrical face or body makeup plan with exact contents, skin and eye-area limits, removal, hygiene, and cleanup understood" },
  { key: "props-animatronics", category: "props-animatronics", target: 4, include: /^(High End Prop|Props|Prop Rental - High End Prop|Prop Rental|Animatronics)$/i, exclude: /costume|mask|wig|makeup/i, use: "a prop or animatronic scene with verified dimensions, stability, power, weather limits, guest clearance, storage, and current rental or return terms" },
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
  const candidates = products
    .filter((product) => !usedIds.has(product.id) && !usedTitles.has(normalizedTitle(product.title)))
    .filter((product) => family.include.test(product.productType ?? ""))
    .filter((product) => !family.exclude.test(`${product.title} ${product.productType}`))
    .filter(validateLink)
    .sort((left, right) => score(right) - score(left) || left.title.localeCompare(right.title));
  const selected = [];
  const familyTitles = new Set(usedTitles);
  for (const product of candidates) {
    const titleKey = normalizedTitle(product.title);
    if (familyTitles.has(titleKey)) continue;
    selected.push({ ...product, family });
    familyTitles.add(titleKey);
    if (selected.length === family.target) break;
  }
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

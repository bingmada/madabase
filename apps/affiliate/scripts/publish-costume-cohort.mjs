import crypto from "node:crypto";
import { Pool } from "pg";

const apply = process.argv.includes("--apply");
const databaseUrl = process.env.DATABASE_URL;
const expectedPid = process.env.CJ_COSTUME_PID;
const targetPerCategory = 5;
const allowedTrackingHosts = ["anrdoezrs.net", "dpbolvw.net", "jdoqocy.com", "kqzyfj.com", "qksrv.net", "tkqlhce.com"];

if (!databaseUrl || !expectedPid) {
  console.error("DATABASE_URL and CJ_COSTUME_PID are required");
  process.exit(1);
}

const categoryRules = {
  costumes: {
    include: /\b(costume|mascot|uniform|dress|robe|jumpsuit|bodysuit|armor|wings?)\b/i,
    exclude: /\b(animatronic|animated prop|fog fluid|fog machine)\b/i,
    use: "a costume, mascot, cosplay, theater, or performance look",
    checks: ["the exact size chart and garment measurements", "every included and missing piece", "movement, visibility, layers, and event duration", "delivery timing, alterations, and the current return window"],
  },
  "props-animatronics": {
    include: /\b(prop|animatronic|animated|decoration|display|fog machine|skeleton|statue|coffin|tombstone)\b/i,
    exclude: /\b(mask|wig|makeup|costume)\b/i,
    use: "a haunted attraction, event display, stage, party, or seasonal installation",
    checks: ["assembled dimensions, weight, and delivery route", "power, sound, motion, supervision, and venue rules", "setup time, transport, weather exposure, and safety clearance", "off-season storage, care, and current return terms"],
  },
  "masks-prosthetics": {
    include: /\b(mask|prosthetic|appliance|fangs?|teeth|latex|horns?|nose|ears?)\b/i,
    exclude: /\b(animatronic|animated prop|costume|wig)\b/i,
    use: "a mask, prosthetic, creature, cosplay, theater, or special-effects look",
    checks: ["head or face fit and the exact material", "visibility, ventilation, speech, and realistic wear time", "skin-contact compatibility, adhesives, and application supplies", "safe removal, cleanup, storage, and current return terms"],
  },
  "wigs-makeup": {
    include: /\b(wig|makeup|make-up|face paint|body paint|hair|beard|moustache|mustache|eyelash|lipstick|spirit gum|adhesive|fake blood|glitter)\b/i,
    exclude: /\b(animatronic|animated prop|costume|mascot)\b/i,
    use: "a wig, character transformation, cosplay, theater, or special-effects makeup plan",
    checks: ["cap, fiber, shade, material, or skin-contact details", "heat limits and compatible application products", "practice time, touch-ups, ventilation, and event duration", "removal, cleaning, shape-preserving storage, and current return terms"],
  },
  "accessories-party-effects": {
    include: /\b(hat|crown|headpiece|gloves?|cape|tail|ears?|jewelry|necklace|bracelet|stockings?|tights|boots?|shoes?|bag|wand|sword|shield|accessor)\b/i,
    exclude: /\b(animatronic|animated prop)\b/i,
    use: "a costume finishing piece, party, parade, stage look, or themed event",
    checks: ["dimensions, quantity, fit, and included pieces", "materials, closures, movement, and comfort", "how it works with the rest of the outfit or venue", "delivery timing, care, storage, and current return terms"],
  },
};

function normalizedTitle(value) {
  return value.toLowerCase().replace(/\b(adult|mens?|womens?|deluxe|premium|professional)\b/g, " ").replace(/[^a-z0-9]+/g, " ").trim();
}

function normalizedUrl(value) {
  const url = new URL(value);
  url.hash = "";
  url.searchParams.sort();
  return url.toString();
}

function validateLink(product) {
  const tracking = new URL(product.trackingUrl);
  const identity = tracking.pathname.match(/\/click-(\d+)-(\d+)(?:\/|$)/);
  const destination = new URL(product.destinationUrl);
  const embedded = tracking.searchParams.get("url");
  const hostAllowed = allowedTrackingHosts.some((host) => tracking.hostname === host || tracking.hostname.endsWith(`.${host}`));
  if (tracking.protocol !== "https:" || !hostAllowed || !identity) return false;
  if (identity[1] !== expectedPid || product.pid !== expectedPid || identity[2] !== product.aid) return false;
  if (!embedded || destination.protocol !== "https:" || !["abracadabranyc.com", "www.abracadabranyc.com"].includes(destination.hostname)) return false;
  return normalizedUrl(embedded) === normalizedUrl(product.destinationUrl)
    && normalizedUrl(product.linkDestinationUrl) === normalizedUrl(product.destinationUrl);
}

function score(product) {
  const price = Number(product.price ?? 0);
  return (product.professional ? 90 : 0)
    + (product.premium ? 70 : 0)
    + (product.halloween ? 35 : 0)
    + (product.availability === "in stock" ? 25 : 0)
    + Math.min((product.description?.length ?? 0) / 20, 35)
    + (price > 0 ? 15 : 0);
}

function chooseCategory(products, category) {
  const rule = categoryRules[category];
  const eligible = products
    .filter((product) => rule.include.test(product.title) && !rule.exclude.test(product.title))
    .filter(validateLink)
    .sort((a, b) => score(b) - score(a) || a.title.localeCompare(b.title));
  const selected = [];
  const usedTitles = new Set();
  const bands = [
    (product) => product.premium || product.professional || Number(product.price) >= 1000,
    (product) => Number(product.price) >= 200 && Number(product.price) < 1000,
    (product) => Number(product.price) >= 50 && Number(product.price) < 200,
    (product) => Number(product.price) > 0 && Number(product.price) < 50,
    () => true,
  ];

  for (const band of bands) {
    const match = eligible.find((product) => band(product) && !usedTitles.has(normalizedTitle(product.title)));
    if (!match) continue;
    selected.push({ ...match, targetCategory: category });
    usedTitles.add(normalizedTitle(match.title));
  }
  for (const product of eligible) {
    if (selected.length >= targetPerCategory) break;
    const titleKey = normalizedTitle(product.title);
    if (usedTitles.has(titleKey)) continue;
    selected.push({ ...product, targetCategory: category });
    usedTitles.add(titleKey);
  }
  if (selected.length !== targetPerCategory) {
    throw new Error(`${category} produced ${selected.length}/${targetPerCategory} publishable products after category and link checks`);
  }
  return selected;
}

function editorialFor(product) {
  const rule = categoryRules[product.targetCategory];
  const price = product.price ? new Intl.NumberFormat("en-US", { style: "currency", currency: product.currency }).format(Number(product.price)) : "a currently listed price";
  const flags = [product.premium ? "premium-priced" : null, product.professional ? "professional-use" : null, product.halloween ? "Halloween-relevant" : null].filter(Boolean);
  const position = flags.length ? `${flags.join(", ")} option` : "listed option";
  return {
    buyerJob: `Decide whether ${product.title} fits ${rule.use}; confirm ${rule.checks.join(", ")} before ordering.`,
    summary: `${product.title} is a ${position} from Abracadabra NYC at ${price}. Compare it by ${rule.checks.slice(0, 3).join(", ")}, then confirm the exact variant, availability, shipping, and returns.`,
    guidance: {
      bestFor: rule.use,
      confirmBeforeOrdering: rule.checks,
      skipIf: `Skip this option if its exact measurements, materials, setup, delivery timing, or care requirements do not fit the real event plan.`,
    },
    evidence: {
      source: "Abracadabra NYC CJ Product Feed",
      productIdentity: { externalId: product.externalId, variantId: product.variantId },
      linkValidation: "exact embedded destination, dedicated PID, AID, HTTPS CJ host, and Abracadabra host",
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
    `SELECT mp."id", mp."externalId", mp."variantId", mp."slug", mp."title", mp."description",
       mp."productType", mp."categorySlug", mp."price", mp."currency", mp."availability",
       mp."premium", mp."professional", mp."halloween", mp."destinationUrl",
       image."permissionRef", link."id" AS "linkId", link."pid", link."aid", link."trackingUrl",
       link."destinationUrl" AS "linkDestinationUrl"
     FROM "MerchantProduct" mp
     JOIN "Merchant" merchant ON merchant."id" = mp."merchantId"
     JOIN LATERAL (
       SELECT image."permissionRef" FROM "MerchantProductImage" image
       WHERE image."productId" = mp."id" AND image."usageStatus" = 'authorized' AND image."permissionRef" IS NOT NULL
       ORDER BY image."position" ASC LIMIT 1
     ) image ON true
     JOIN LATERAL (
       SELECT link."id", link."pid", link."aid", link."trackingUrl", link."destinationUrl" FROM "AffiliateLink" link
       WHERE link."merchantProductId" = mp."id" AND link."site" = 'costume' AND link."pid" = $1
       ORDER BY link."updatedAt" DESC LIMIT 1
     ) link ON true
     WHERE merchant."slug" = 'abracadabra-nyc' AND merchant."advertiserCid" = '7889430'
       AND mp."softRetiredAt" IS NULL AND mp."availability" <> 'out of stock'`,
    [expectedPid],
  );
  const selected = [];
  const usedProductIds = new Set();
  const usedProductTitles = new Set();
  for (const category of Object.keys(categoryRules)) {
    const available = result.rows.filter((product) => !usedProductIds.has(product.id) && !usedProductTitles.has(normalizedTitle(product.title)));
    const categorySelection = chooseCategory(available, category);
    for (const product of categorySelection) {
      selected.push(product);
      usedProductIds.add(product.id);
      usedProductTitles.add(normalizedTitle(product.title));
    }
  }
  const validation = {
    mode: apply ? "apply" : "preview",
    selected: selected.length,
    categories: Object.fromEntries(Object.keys(categoryRules).map((category) => [category, selected.filter((product) => product.targetCategory === category).length])),
    exactLinks: selected.filter(validateLink).length,
    authorizedImages: selected.filter((product) => product.permissionRef).length,
  };
  console.log(JSON.stringify(validation));
  selected.forEach((product) => console.log(`${product.targetCategory} | ${product.price ?? "n/a"} ${product.currency} | ${product.title} | ${product.slug}`));
  if (!apply) process.exit(0);

  await client.query("BEGIN");
  const selectedProductIds = selected.map((product) => product.id);
  const selectedLinkIds = selected.map((product) => product.linkId);
  await client.query(
    `UPDATE "AffiliateLink" SET "active" = false, "verifiedAt" = NULL, "lastCheckedAt" = NOW(), "updatedAt" = NOW()
     WHERE "site" = 'costume' AND "pid" = $1 AND NOT ("id" = ANY($2::text[]))`,
    [expectedPid, selectedLinkIds],
  );
  await client.query(
    `UPDATE "EditorialProduct" SET "status" = 'draft', "indexable" = false, "publishedAt" = NULL, "updatedAt" = NOW()
     WHERE "merchantProductId" IN (
       SELECT product."id" FROM "MerchantProduct" product
       JOIN "Merchant" merchant ON merchant."id" = product."merchantId"
       WHERE merchant."slug" = 'abracadabra-nyc' AND merchant."advertiserCid" = '7889430'
     ) AND NOT ("merchantProductId" = ANY($1::text[]))`,
    [selectedProductIds],
  );
  for (const product of selected) {
    const editorial = editorialFor(product);
    await client.query(
      `UPDATE "MerchantProduct" SET "categorySlug" = $1, "updatedAt" = NOW() WHERE "id" = $2`,
      [product.targetCategory, product.id],
    );
    await client.query(
      `UPDATE "AffiliateLink" SET "active" = true, "verifiedAt" = NOW(), "lastCheckedAt" = NOW(), "updatedAt" = NOW()
       WHERE "id" = $1 AND "merchantProductId" = $2 AND "site" = 'costume' AND "pid" = $3`,
      [product.linkId, product.id, expectedPid],
    );
    await client.query(
      `INSERT INTO "EditorialProduct" (
         "id", "merchantProductId", "slug", "status", "indexable", "buyerJob", "summary", "guidance", "evidence",
         "curatedAt", "publishedAt", "createdAt", "updatedAt"
       ) VALUES ($1, $2, $3, 'published', true, $4, $5, $6::jsonb, $7::jsonb, NOW(), NOW(), NOW(), NOW())
       ON CONFLICT ("merchantProductId") DO UPDATE SET
         "slug" = EXCLUDED."slug", "status" = 'published', "indexable" = true,
         "buyerJob" = EXCLUDED."buyerJob", "summary" = EXCLUDED."summary", "guidance" = EXCLUDED."guidance",
         "evidence" = EXCLUDED."evidence", "curatedAt" = NOW(), "publishedAt" = COALESCE("EditorialProduct"."publishedAt", NOW()), "updatedAt" = NOW()`,
      [crypto.randomUUID(), product.id, product.slug, editorial.buyerJob, editorial.summary, JSON.stringify(editorial.guidance), JSON.stringify(editorial.evidence)],
    );
  }
  await client.query("COMMIT");
  console.log(JSON.stringify({ ok: true, published: selected.length, indexable: selected.length, activeLinks: selected.length }));
} catch (error) {
  try { await client.query("ROLLBACK"); } catch {}
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  client.release();
  await pool.end();
}

import crypto from "node:crypto";
import { readFile } from "node:fs/promises";
import { Pool } from "pg";
import { assertSearchRecoveryPublishingAllowed } from "./search-recovery-freeze.mjs";

const apply = process.argv.includes("--apply");
if (apply) assertSearchRecoveryPublishingAllowed({ sites: "costume", action: "new-indexable-cohort" });
const databaseUrl = process.env.DATABASE_URL;
const expectedPid = process.env.CJ_COSTUME_PID;
const picks = JSON.parse(
  await readFile(new URL("../config/costume-halloween-products.json", import.meta.url), "utf8"),
);
const allowedTrackingHosts = ["anrdoezrs.net", "dpbolvw.net", "jdoqocy.com", "kqzyfj.com", "qksrv.net", "tkqlhce.com"];

if (!databaseUrl || !expectedPid) {
  console.error("DATABASE_URL and CJ_COSTUME_PID are required");
  process.exit(1);
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
  const embeddedDestination = tracking.searchParams.get("url");
  const merchantDestination = new URL(product.destinationUrl);
  const hostAllowed = allowedTrackingHosts.some(
    (host) => tracking.hostname === host || tracking.hostname.endsWith(`.${host}`),
  );

  return Boolean(
    tracking.protocol === "https:"
      && hostAllowed
      && identity
      && identity[1] === expectedPid
      && identity[2] === product.aid
      && product.pid === expectedPid
      && embeddedDestination
      && merchantDestination.protocol === "https:"
      && ["abracadabranyc.com", "www.abracadabranyc.com"].includes(merchantDestination.hostname)
      && normalizedUrl(embeddedDestination) === normalizedUrl(product.destinationUrl)
      && normalizedUrl(product.linkDestinationUrl) === normalizedUrl(product.destinationUrl),
  );
}

function editorialFor(pick, product) {
  return {
    guidance: {
      bestFor: pick.bestFor,
      confirmBeforeOrdering: pick.confirmBeforeOrdering,
      skipIf: pick.skipIf,
    },
    evidence: {
      source: "Abracadabra NYC CJ Product Feed",
      evidenceMode: "official-spec",
      productIdentity: {
        externalId: product.externalId,
        variantId: product.variantId,
      },
      selection: `Owner-approved bounded Halloween 2026 edit: ${pick.collection}`,
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
       product."availability", product."destinationUrl",
       image."permissionRef", link."id" AS "linkId", link."pid", link."aid", link."trackingUrl",
       link."destinationUrl" AS "linkDestinationUrl", link."active", link."verifiedAt"
     FROM "MerchantProduct" product
     JOIN "Merchant" merchant ON merchant."id" = product."merchantId"
     JOIN LATERAL (
       SELECT image."permissionRef" FROM "MerchantProductImage" image
       WHERE image."productId" = product."id"
         AND image."usageStatus" = 'authorized' AND image."permissionRef" IS NOT NULL
       ORDER BY image."position" ASC LIMIT 1
     ) image ON true
     JOIN LATERAL (
       SELECT link."id", link."pid", link."aid", link."trackingUrl", link."destinationUrl",
         link."active", link."verifiedAt"
       FROM "AffiliateLink" link
       WHERE link."merchantProductId" = product."id"
         AND link."site" = 'costume' AND link."network" = 'cj' AND link."pid" = $1
       ORDER BY link."updatedAt" DESC LIMIT 1
     ) link ON true
     WHERE merchant."slug" = 'abracadabra-nyc' AND merchant."advertiserCid" = '7889430'
       AND product."softRetiredAt" IS NULL AND product."slug" = ANY($2::text[])`,
    [expectedPid, picks.map((pick) => pick.slug)],
  );

  const productsBySlug = new Map(result.rows.map((product) => [product.slug, product]));
  const failures = [];
  for (const pick of picks) {
    const product = productsBySlug.get(pick.slug);
    if (!product) failures.push(`${pick.slug}: product, authorized image, or dedicated-PID link missing`);
    else if (product.title !== pick.expectedTitle) failures.push(`${pick.slug}: title identity mismatch`);
    else if (product.availability === "out of stock") failures.push(`${pick.slug}: out of stock`);
    else if (!product.permissionRef) failures.push(`${pick.slug}: image authorization missing`);
    else if (!product.active || !product.verifiedAt) failures.push(`${pick.slug}: verified active link missing`);
    else if (!validateLink(product)) failures.push(`${pick.slug}: tracking or destination identity mismatch`);
  }

  console.log(JSON.stringify({
    mode: apply ? "apply" : "preview",
    requested: picks.length,
    found: result.rows.length,
    valid: picks.length - failures.length,
    failures: failures.length,
  }));
  failures.forEach((failure) => console.error(failure));
  picks.forEach((pick) => {
    const product = productsBySlug.get(pick.slug);
    if (product) console.log(`${pick.collection} | ${pick.targetCategory} | ${product.title} | ${product.slug}`);
  });

  if (failures.length) throw new Error("Halloween cohort validation failed; no records changed");
  if (!apply) process.exit(0);

  await client.query("BEGIN");
  for (const pick of picks) {
    const product = productsBySlug.get(pick.slug);
    const editorial = editorialFor(pick, product);
    await client.query(
      `UPDATE "MerchantProduct"
       SET "categorySlug" = $1, "halloween" = true, "updatedAt" = NOW()
       WHERE "id" = $2`,
      [pick.targetCategory, product.id],
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
         "curatedAt" = NOW(), "publishedAt" = COALESCE("EditorialProduct"."publishedAt", NOW()),
         "updatedAt" = NOW()`,
      [
        crypto.randomUUID(),
        product.id,
        pick.slug,
        pick.buyerJob,
        pick.summary,
        JSON.stringify(editorial.guidance),
        JSON.stringify(editorial.evidence),
      ],
    );
  }
  await client.query("COMMIT");
  console.log(JSON.stringify({ ok: true, published: picks.length, additive: true }));
} catch (error) {
  try {
    await client.query("ROLLBACK");
  } catch {}
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  client.release();
  await pool.end();
}

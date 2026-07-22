import { Pool } from "pg";

const ADVERTISER_CID = "7889430";
const DEFAULT_PERMISSION_REF = "https://developers.cj.com/docs/data-imports/product-feeds (accessed 2026-07-22; CJ Product Feed image-link and additional-image-link publisher-use guidance)";
const apply = process.argv.includes("--apply");
const databaseUrl = process.env.DATABASE_URL;
const permissionRef = (process.env.CJ_PRODUCT_IMAGE_PERMISSION_REF ?? DEFAULT_PERMISSION_REF).trim();

if (!databaseUrl) {
  console.error("Missing required env var: DATABASE_URL");
  process.exit(1);
}

if (!permissionRef.startsWith("https://developers.cj.com/")) {
  console.error("CJ_PRODUCT_IMAGE_PERMISSION_REF must point to the official developers.cj.com documentation used for this authorization decision");
  process.exit(1);
}

const pool = new Pool({ connectionString: databaseUrl, max: 1 });
const client = await pool.connect();

try {
  const scope = await client.query(
    `SELECT
       COUNT(*)::int AS "imageCount",
       COUNT(DISTINCT image."productId")::int AS "productCount",
       COUNT(*) FILTER (WHERE image."usageStatus" = 'authorized' AND image."permissionRef" = $2)::int AS "alreadyAuthorized"
     FROM "MerchantProductImage" image
     JOIN "MerchantProduct" product ON product."id" = image."productId"
     JOIN "Merchant" merchant ON merchant."id" = product."merchantId"
     WHERE merchant."network" = 'cj' AND merchant."advertiserCid" = $1`,
    [ADVERTISER_CID, permissionRef],
  );

  const summary = scope.rows[0];
  if (!apply) {
    console.log(JSON.stringify({
      ok: true,
      mode: "dry-run",
      advertiserCid: ADVERTISER_CID,
      permissionRef,
      ...summary,
      wouldAuthorize: summary.imageCount - summary.alreadyAuthorized,
    }));
    process.exit(0);
  }

  await client.query("BEGIN");
  const result = await client.query(
    `UPDATE "MerchantProductImage" image
     SET "usageStatus" = 'authorized', "permissionRef" = $2, "updatedAt" = NOW()
     FROM "MerchantProduct" product
     JOIN "Merchant" merchant ON merchant."id" = product."merchantId"
     WHERE image."productId" = product."id"
       AND merchant."network" = 'cj'
       AND merchant."advertiserCid" = $1
       AND (image."usageStatus" <> 'authorized' OR image."permissionRef" IS DISTINCT FROM $2)`,
    [ADVERTISER_CID, permissionRef],
  );
  await client.query("COMMIT");

  console.log(JSON.stringify({
    ok: true,
    mode: "apply",
    advertiserCid: ADVERTISER_CID,
    permissionRef,
    scopedImages: summary.imageCount,
    scopedProducts: summary.productCount,
    authorizedNow: result.rowCount ?? 0,
  }));
} catch (error) {
  await client.query("ROLLBACK").catch(() => {});
  throw error;
} finally {
  client.release();
  await pool.end();
}

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import pg from "pg";

const { Pool } = pg;
const root = path.resolve(new URL("../../..", import.meta.url).pathname);
const daysArgument = process.argv.find((argument) =>
  argument.startsWith("--days="),
);
const days = Number.parseInt(daysArgument?.slice("--days=".length) ?? "7", 10);
const asJson = process.argv.includes("--json");

if (!process.env.DATABASE_URL) {
  for (const file of [
    path.join(root, ".env.local"),
    path.join(root, "apps/web/.env.local"),
  ]) {
    if (!fs.existsSync(file)) continue;
    const line = fs
      .readFileSync(file, "utf8")
      .split(/\r?\n/)
      .find((candidate) => candidate.startsWith("DATABASE_URL="));
    if (line) {
      process.env.DATABASE_URL = line
        .slice("DATABASE_URL=".length)
        .replace(/^['"]|['"]$/g, "");
      break;
    }
  }
}

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is required.");
  process.exit(1);
}

if (!Number.isInteger(days) || days < 1 || days > 365) {
  console.error("--days must be an integer between 1 and 365.");
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

try {
  const [summary, byProduct, byPosition, recent] = await Promise.all([
    pool.query(
      `SELECT COUNT(*)::int AS "clicks",
              COUNT(DISTINCT "productSlug")::int AS "products",
              COUNT(DISTINCT "path")::int AS "pages"
       FROM "AffiliateClick"
       WHERE "createdAt" >= NOW() - ($1::int * INTERVAL '1 day')`,
      [days],
    ),
    pool.query(
      `SELECT "site", "productSlug", COUNT(*)::int AS "clicks"
       FROM "AffiliateClick"
       WHERE "createdAt" >= NOW() - ($1::int * INTERVAL '1 day')
       GROUP BY "site", "productSlug"
       ORDER BY "clicks" DESC, "site", "productSlug"
       LIMIT 50`,
      [days],
    ),
    pool.query(
      `SELECT "site", "position", COUNT(*)::int AS "clicks"
       FROM "AffiliateClick"
       WHERE "createdAt" >= NOW() - ($1::int * INTERVAL '1 day')
       GROUP BY "site", "position"
       ORDER BY "clicks" DESC, "site", "position"
       LIMIT 50`,
      [days],
    ),
    pool.query(
      `SELECT "createdAt", "site", "productSlug", "position", "path"
       FROM "AffiliateClick"
       ORDER BY "createdAt" DESC
       LIMIT 20`,
    ),
  ]);

  const report = {
    generatedAt: new Date().toISOString(),
    days,
    summary: summary.rows[0],
    byProduct: byProduct.rows,
    byPosition: byPosition.rows,
    recent: recent.rows,
  };

  if (asJson) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(`Affiliate clicks — last ${days} days`);
    console.table([report.summary]);
    console.log("By product");
    console.table(report.byProduct);
    console.log("By CTA position");
    console.table(report.byPosition);
    console.log("Most recent");
    console.table(report.recent);
  }
} finally {
  await pool.end();
}

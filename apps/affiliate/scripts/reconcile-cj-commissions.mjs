import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;
const responsePath = process.env.CJ_COMMISSION_DETAIL_PATH;
const endpoint = process.env.CJ_COMMISSION_GRAPHQL_ENDPOINT;
const queryPath = process.env.CJ_COMMISSION_QUERY_PATH;
const token = process.env.CJ_API_TOKEN;
const affiliateRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function resolveInputPath(inputPath) {
  if (!inputPath) return inputPath;
  const candidates = [
    path.resolve(process.cwd(), inputPath),
    path.resolve(affiliateRoot, inputPath),
    inputPath.startsWith("apps/affiliate/")
      ? path.resolve(affiliateRoot, inputPath.slice("apps/affiliate/".length))
      : null,
  ].filter(Boolean);
  return candidates.find((candidate) => fs.existsSync(candidate)) ?? candidates[0];
}

if (!databaseUrl) {
  console.error("Missing required env var: DATABASE_URL");
  process.exit(1);
}

async function loadPayload() {
  if (responsePath) return JSON.parse(fs.readFileSync(resolveInputPath(responsePath), "utf8"));
  if (!endpoint || !queryPath || !token) {
    throw new Error("Set CJ_COMMISSION_DETAIL_PATH, or set CJ_COMMISSION_GRAPHQL_ENDPOINT, CJ_COMMISSION_QUERY_PATH, and CJ_API_TOKEN");
  }

  const variables = JSON.parse(process.env.CJ_COMMISSION_QUERY_VARIABLES ?? "{}");
  const lookbackDays = Number(process.env.CJ_COMMISSION_LOOKBACK_DAYS ?? "");
  if (Number.isFinite(lookbackDays) && lookbackDays > 0) {
    variables.sincePostingDate = new Date(Date.now() - lookbackDays * 86_400_000).toISOString();
    delete variables.beforePostingDate;
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify({
      query: fs.readFileSync(resolveInputPath(queryPath), "utf8"),
      variables,
    }),
  });
  const payload = await response.json();
  if (!response.ok || payload.errors?.length) {
    throw new Error(`CJ Commission Detail request failed (${response.status}): ${JSON.stringify(payload.errors ?? payload)}`);
  }
  return payload;
}

function candidateArrays(value, depth = 0) {
  if (depth > 8 || value == null || typeof value !== "object") return [];
  if (Array.isArray(value)) return [value, ...value.flatMap((item) => candidateArrays(item, depth + 1))];
  return Object.values(value).flatMap((item) => candidateArrays(item, depth + 1));
}

function pick(record, names) {
  for (const name of names) {
    const value = record[name];
    if (value != null && String(value).trim()) return value;
  }
  return undefined;
}

function amount(value) {
  if (value == null || value === "") return null;
  if (typeof value === "object") value = value.amount ?? value.value;
  const parsed = Number(String(value).replaceAll(",", "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function date(value) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function normalizeRecord(record) {
  if (!record || typeof record !== "object" || Array.isArray(record)) return null;
  const externalActionId = pick(record, ["commissionId", "externalActionId", "originalActionId", "actionId", "id", "actionTrackerId"]);
  const commissionAmount = amount(pick(record, ["pubCommissionAmountPubCurrency", "pubCommissionAmountUsd", "commissionAmount", "publisherCommission", "commission", "commissionTotal"]));
  const eventAt = date(pick(record, ["eventAt", "eventDate", "actionDate", "postingDate", "occurredAt"]));
  if (!externalActionId || commissionAmount == null || !eventAt) return null;
  const firstItem = Array.isArray(record.items) ? record.items[0] : null;

  return {
    externalActionId: String(externalActionId),
    advertiserCid: String(pick(record, ["advertiserCid", "advertiserId", "advertiserIdNumeric"]) ?? ""),
    productExternalId: String(pick(record, ["productExternalId", "sku", "itemId", "advertiserSku"]) ?? firstItem?.sku ?? ""),
    sid: String(pick(record, ["sid", "shopperId", "subId", "publisherSubId"]) ?? ""),
    status: String(pick(record, ["status", "actionStatus", "lockingStatus"]) ?? "unknown").toLowerCase(),
    saleAmount: amount(pick(record, ["saleAmountPubCurrency", "saleAmountUsd", "saleAmount", "orderAmount", "sale", "orderTotal"])),
    commissionAmount,
    currency: String(pick(record, ["currency", "currencyCode"]) ?? "USD").toUpperCase(),
    eventAt,
    lockingDate: date(pick(record, ["lockingDate", "lockDate"])),
    sourceUpdatedAt: date(pick(record, ["sourceUpdatedAt", "postingDate", "lastUpdated", "updatedAt"])),
    raw: record,
  };
}

const payload = await loadPayload();
const publisherCommissionRecords = payload?.data?.publisherCommissions?.records;
const explicitRecords = Array.isArray(publisherCommissionRecords)
  ? publisherCommissionRecords.map(normalizeRecord).filter(Boolean)
  : null;
const records = explicitRecords ?? candidateArrays(payload)
  .map((items) => items.map(normalizeRecord).filter(Boolean))
  .sort((a, b) => b.length - a.length)[0] ?? [];
if (!records.length) {
  if (Array.isArray(publisherCommissionRecords) && publisherCommissionRecords.length === 0) {
    console.log(JSON.stringify({ ok: true, records: 0, matchedClicks: 0, matchedProducts: 0 }));
    process.exit(0);
  }
  throw new Error("No recognizable Commission Detail records were found in the response");
}

const pool = new Pool({ connectionString: databaseUrl, max: 3 });
const client = await pool.connect();
let matchedClicks = 0;
let matchedProducts = 0;
const merchantIds = new Map();

try {
  await client.query("BEGIN");

  for (const record of records) {
    const clickResult = record.sid
      ? await client.query(
          `SELECT click."id", click."merchantProductId", product."merchantId"
             FROM "AffiliateClick" AS click
             LEFT JOIN "MerchantProduct" AS product ON product."id" = click."merchantProductId"
            WHERE click."sid" = $1 LIMIT 1`,
          [record.sid],
        )
      : { rows: [] };
    const click = clickResult.rows[0];
    if (click) matchedClicks += 1;

    let merchantId = click?.merchantId ?? null;
    if (record.advertiserCid) {
      if (!merchantIds.has(record.advertiserCid)) {
        const merchantResult = await client.query(
          `SELECT "id" FROM "Merchant" WHERE "network" = 'cj' AND "advertiserCid" = $1 LIMIT 1`,
          [record.advertiserCid],
        );
        merchantIds.set(record.advertiserCid, merchantResult.rows[0]?.id ?? null);
      }
      merchantId = merchantIds.get(record.advertiserCid) ?? null;
    }

    let merchantProductId = click?.merchantProductId ?? null;
    if (!merchantProductId && merchantId && record.productExternalId) {
      const productResult = await client.query(
        `SELECT "id" FROM "MerchantProduct" WHERE "merchantId" = $1 AND "externalId" = $2 ORDER BY "lastSeenAt" DESC LIMIT 1`,
        [merchantId, record.productExternalId],
      );
      merchantProductId = productResult.rows[0]?.id ?? null;
    }
    if (merchantProductId) matchedProducts += 1;

    await client.query(
      `INSERT INTO "AffiliateTransaction" (
         "id", "network", "externalActionId", "merchantId", "merchantProductId", "affiliateClickId", "sid",
         "status", "saleAmount", "commissionAmount", "currency", "eventAt", "lockingDate", "sourceUpdatedAt",
         "raw", "createdAt", "updatedAt"
       ) VALUES ($14, 'cj', $1, $2, $3, $4, NULLIF($5, ''), $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())
       ON CONFLICT ("network", "externalActionId") DO UPDATE SET
         "merchantId" = EXCLUDED."merchantId", "merchantProductId" = EXCLUDED."merchantProductId",
         "affiliateClickId" = EXCLUDED."affiliateClickId", "sid" = EXCLUDED."sid", "status" = EXCLUDED."status",
         "saleAmount" = EXCLUDED."saleAmount", "commissionAmount" = EXCLUDED."commissionAmount",
         "currency" = EXCLUDED."currency", "eventAt" = EXCLUDED."eventAt", "lockingDate" = EXCLUDED."lockingDate",
         "sourceUpdatedAt" = EXCLUDED."sourceUpdatedAt", "raw" = EXCLUDED."raw", "updatedAt" = NOW()`,
      [record.externalActionId, merchantId, merchantProductId, click?.id ?? null, record.sid, record.status, record.saleAmount, record.commissionAmount, record.currency, record.eventAt, record.lockingDate, record.sourceUpdatedAt, record.raw, crypto.randomUUID()],
    );
  }

  await client.query("COMMIT");
  console.log(JSON.stringify({ ok: true, records: records.length, matchedClicks, matchedProducts }));
} catch (error) {
  await client.query("ROLLBACK");
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  client.release();
  await pool.end();
}

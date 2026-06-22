import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("../../..", import.meta.url).pathname);
const contentPath = path.join(root, "apps/affiliate/lib/content.ts");
const outputPath = path.join(root, "apps/affiliate/lib/amazon-overrides.ts");

const accessKey = process.env.AMAZON_PAAPI_ACCESS_KEY;
const secretKey = process.env.AMAZON_PAAPI_SECRET_KEY;
const partnerTag = process.env.AMAZON_PAAPI_PARTNER_TAG;
const host = process.env.AMAZON_PAAPI_HOST ?? "webservices.amazon.com";
const region = process.env.AMAZON_PAAPI_REGION ?? "us-east-1";
const marketplace = process.env.AMAZON_PAAPI_MARKETPLACE ?? "www.amazon.com";

const missing = [
  ["AMAZON_PAAPI_ACCESS_KEY", accessKey],
  ["AMAZON_PAAPI_SECRET_KEY", secretKey],
  ["AMAZON_PAAPI_PARTNER_TAG", partnerTag],
].filter(([, value]) => !value);

if (missing.length) {
  console.error(`Missing required env vars: ${missing.map(([key]) => key).join(", ")}`);
  process.exit(1);
}

const content = fs.readFileSync(contentPath, "utf8");
const products = [...content.matchAll(/\n  \{\n    site: "(pet|homeoffice|baby)",\n    slug: "([^"]+)",\n    asin: "([A-Z0-9]{10})",/g)].map((match) => ({
  site: match[1],
  slug: match[2],
  asin: match[3],
}));

if (!products.length) {
  console.error("No ASIN-backed products found in content.ts");
  process.exit(1);
}

function hash(value) {
  return crypto.createHash("sha256").update(value, "utf8").digest("hex");
}

function hmac(key, value, encoding) {
  return crypto.createHmac("sha256", key).update(value, "utf8").digest(encoding);
}

function getSignatureKey(key, dateStamp, signingRegion, serviceName) {
  const kDate = hmac(`AWS4${key}`, dateStamp);
  const kRegion = hmac(kDate, signingRegion);
  const kService = hmac(kRegion, serviceName);
  return hmac(kService, "aws4_request");
}

function amzDateParts(date = new Date()) {
  const iso = date.toISOString().replace(/[:-]|\.\d{3}/g, "");
  return {
    amzDate: iso,
    dateStamp: iso.slice(0, 8),
  };
}

async function getItems(batch) {
  const target = "com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems";
  const service = "ProductAdvertisingAPI";
  const uri = "/paapi5/getitems";
  const endpoint = `https://${host}${uri}`;
  const { amzDate, dateStamp } = amzDateParts();
  const payload = JSON.stringify({
    ItemIds: batch.map((item) => item.asin),
    ItemIdType: "ASIN",
    PartnerTag: partnerTag,
    PartnerType: "Associates",
    Marketplace: marketplace,
    Resources: ["DetailPageURL", "Images.Primary.Large", "Images.Primary.Medium", "ItemInfo.Title", "ItemInfo.Features"],
  });

  const canonicalHeaders = [
    ["content-encoding", "amz-1.0"],
    ["content-type", "application/json; charset=utf-8"],
    ["host", host],
    ["x-amz-date", amzDate],
    ["x-amz-target", target],
  ];
  const signedHeaders = canonicalHeaders.map(([key]) => key).join(";");
  const canonicalRequest = [
    "POST",
    uri,
    "",
    canonicalHeaders.map(([key, value]) => `${key}:${value}\n`).join(""),
    signedHeaders,
    hash(payload),
  ].join("\n");
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = ["AWS4-HMAC-SHA256", amzDate, credentialScope, hash(canonicalRequest)].join("\n");
  const signature = hmac(getSignatureKey(secretKey, dateStamp, region, service), stringToSign, "hex");
  const authorization = `AWS4-HMAC-SHA256 Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: authorization,
      "Content-Encoding": "amz-1.0",
      "Content-Type": "application/json; charset=utf-8",
      Host: host,
      "X-Amz-Date": amzDate,
      "X-Amz-Target": target,
    },
    body: payload,
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`PA-API request failed ${response.status}: ${text}`);
  }

  return JSON.parse(text);
}

const overrides = {};
for (let i = 0; i < products.length; i += 10) {
  const batch = products.slice(i, i + 10);
  const data = await getItems(batch);
  const items = data.ItemsResult?.Items ?? [];

  for (const item of items) {
    const product = batch.find((candidate) => candidate.asin === item.ASIN);
    if (!product) continue;

    overrides[product.slug] = {
      amazonTitle: item.ItemInfo?.Title?.DisplayValue,
      amazonImage: item.Images?.Primary?.Large?.URL ?? item.Images?.Primary?.Medium?.URL,
      amazonDetailUrl: item.DetailPageURL,
      amazonFeatures: item.ItemInfo?.Features?.DisplayValues?.slice(0, 5),
    };
  }
}

const output = `import type { Product } from "./types";

export type AmazonProductOverride = Pick<Product, "amazonTitle" | "amazonImage" | "amazonDetailUrl" | "amazonFeatures">;

export const amazonProductOverrides: Record<string, AmazonProductOverride> = ${JSON.stringify(overrides, null, 2)};
`;

fs.writeFileSync(outputPath, output);
console.log(`Wrote ${Object.keys(overrides).length} Amazon overrides to ${path.relative(root, outputPath)}`);

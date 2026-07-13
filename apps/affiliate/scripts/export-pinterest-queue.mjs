import fs from "node:fs";
import path from "node:path";

const DEFAULT_SITES = ["style", "baby", "homeoffice", "pet"];

function parseArgs(argv) {
  const options = {
    baseUrl: "http://127.0.0.1:3011",
    limit: 12,
    sites: [],
    output: null,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const [name, inlineValue] = argv[index].split("=", 2);
    const value = inlineValue ?? argv[index + 1];
    if (["--base-url", "--limit", "--site", "--output"].includes(name) && inlineValue === undefined) index += 1;
    if (name === "--base-url") options.baseUrl = value;
    else if (name === "--limit") options.limit = Number.parseInt(value, 10);
    else if (name === "--site") options.sites.push(value);
    else if (name === "--output") options.output = value;
    else throw new Error(`Unknown option: ${argv[index]}`);
  }

  if (!Number.isFinite(options.limit) || options.limit < 1 || options.limit > 100) {
    throw new Error("--limit must be between 1 and 100.");
  }
  if (options.sites.length === 0) options.sites = DEFAULT_SITES;
  return options;
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

async function fetchFeed(baseUrl, site, limit) {
  const url = new URL("/api/distribution-feed", baseUrl);
  url.searchParams.set("site", site);
  url.searchParams.set("limit", String(limit));
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Could not fetch ${url}: HTTP ${response.status}`);
  return response.json();
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const feeds = [];
  for (const site of options.sites) feeds.push(await fetchFeed(options.baseUrl, site, options.limit));
  const rows = feeds.flatMap((feed) => feed.items);
  const headers = ["status", "site", "board", "pin_title", "pin_description", "destination_url", "pin_image_url", "alt_text", "source_url", "id"];
  const csv = [
    headers.join(","),
    ...rows.map((row) => ["ready", row.site, row.board, row.pinTitle, row.pinDescription, row.destinationUrl, row.pinImageUrl, row.altText, row.sourceUrl, row.id].map(csvCell).join(",")),
  ].join("\n");
  const output = options.output ?? path.join(".affiliate-distribution", `pinterest-queue-${new Date().toISOString().slice(0, 10)}.csv`);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${csv}\n`, "utf8");
  console.log(`Wrote ${rows.length} Pinterest queue item(s) to ${path.resolve(output)}`);
}

main().catch((error) => {
  console.error(`Pinterest queue export failed: ${error.message}`);
  process.exitCode = 1;
});

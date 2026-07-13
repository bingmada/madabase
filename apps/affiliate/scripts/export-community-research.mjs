import fs from "node:fs";
import path from "node:path";

const SITE_TARGETS = {
  network: {
    reddit: ["HomeNetworking", "wifi"],
    forums: ["snbforums.com", "community.tp-link.com", "community.ui.com"],
  },
  smarthome: {
    reddit: ["homeassistant", "smarthome"],
    forums: ["community.home-assistant.io", "community.smartthings.com", "community.tp-link.com"],
  },
};

function parseArgs(argv) {
  const options = { baseUrl: "http://127.0.0.1:3011", limit: 6, output: null };
  for (let index = 0; index < argv.length; index += 1) {
    const [name, inlineValue] = argv[index].split("=", 2);
    const value = inlineValue ?? argv[index + 1];
    if (["--base-url", "--limit", "--output"].includes(name) && inlineValue === undefined) index += 1;
    if (name === "--base-url") options.baseUrl = value;
    else if (name === "--limit") options.limit = Number.parseInt(value, 10);
    else if (name === "--output") options.output = value;
    else throw new Error(`Unknown option: ${argv[index]}`);
  }
  if (!Number.isFinite(options.limit) || options.limit < 1 || options.limit > 25) {
    throw new Error("--limit must be between 1 and 25.");
  }
  return options;
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function trackedUrl(sourceUrl, platform, id) {
  const url = new URL(sourceUrl);
  url.searchParams.set("utm_source", platform);
  url.searchParams.set("utm_medium", "community");
  url.searchParams.set("utm_campaign", `${url.host.split(".")[0]}_helpful_answers`);
  url.searchParams.set("utm_content", id.replaceAll(":", "_"));
  return url.toString();
}

async function fetchFeed(baseUrl, site, limit) {
  const url = new URL("/api/distribution-feed", baseUrl);
  url.searchParams.set("site", site);
  url.searchParams.set("limit", String(limit));
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Could not fetch ${url}: HTTP ${response.status}`);
  return response.json();
}

function searchRows(feed) {
  const targets = SITE_TARGETS[feed.site];
  return feed.items.flatMap((item, index) => {
    const topic = item.pinTitle.replace(/\b(review|buying notes|best)\b/gi, "").replace(/\s+/g, " ").trim();
    const subreddit = targets.reddit[index % targets.reddit.length];
    const forum = targets.forums[index % targets.forums.length];
    const redditQuery = `subreddit:${subreddit} ${topic}`;
    const forumQuery = `site:${forum} ${topic}`;
    const common = {
      status: "research",
      site: feed.site,
      topic,
      answerAngle: item.pinDescription,
      linkPolicy: "Answer the question in full first. Add the evidence link only when it directly supports the answer and community rules allow it.",
      contentId: item.id,
    };

    return [
      {
        ...common,
        platform: "reddit",
        community: `r/${subreddit}`,
        searchUrl: `https://www.reddit.com/search/?q=${encodeURIComponent(redditQuery)}&sort=new`,
        evidenceUrl: trackedUrl(item.sourceUrl, "reddit", item.id),
      },
      {
        ...common,
        platform: "quora",
        community: "Quora",
        searchUrl: `https://www.quora.com/search?q=${encodeURIComponent(topic)}`,
        evidenceUrl: trackedUrl(item.sourceUrl, "quora", item.id),
      },
      {
        ...common,
        platform: "forum",
        community: forum,
        searchUrl: `https://www.bing.com/search?q=${encodeURIComponent(forumQuery)}`,
        evidenceUrl: trackedUrl(item.sourceUrl, forum, item.id),
      },
    ];
  });
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const feeds = [];
  for (const site of Object.keys(SITE_TARGETS)) feeds.push(await fetchFeed(options.baseUrl, site, options.limit));
  const rows = feeds.flatMap(searchRows);
  const headers = ["status", "site", "platform", "community", "topic", "search_url", "answer_angle", "evidence_url", "link_policy", "content_id"];
  const csv = [
    headers.join(","),
    ...rows.map((row) => [row.status, row.site, row.platform, row.community, row.topic, row.searchUrl, row.answerAngle, row.evidenceUrl, row.linkPolicy, row.contentId].map(csvCell).join(",")),
  ].join("\n");
  const output = options.output ?? path.join(".affiliate-distribution", `community-research-${new Date().toISOString().slice(0, 10)}.csv`);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${csv}\n`, "utf8");
  console.log(`Wrote ${rows.length} community research item(s) to ${path.resolve(output)}`);
}

main().catch((error) => {
  console.error(`Community research export failed: ${error.message}`);
  process.exitCode = 1;
});

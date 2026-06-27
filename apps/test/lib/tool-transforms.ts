export function formatJson(value: string) {
  return JSON.stringify(JSON.parse(value), null, 2);
}

export function minifyJson(value: string) {
  return JSON.stringify(JSON.parse(value));
}

export function encodeBase64(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

export function decodeBase64(value: string) {
  const binary = atob(value.trim());
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function encodeUrlComponent(value: string) {
  return encodeURIComponent(value);
}

export function decodeUrlComponent(value: string) {
  return decodeURIComponent(value);
}

export function parseUrlParts(input: string) {
  const url = new URL(input);
  return JSON.stringify(
    {
      href: url.href,
      protocol: url.protocol,
      host: url.host,
      hostname: url.hostname,
      pathname: url.pathname,
      search: url.search,
      hash: url.hash,
    },
    null,
    2,
  );
}

export function addCenterImageToSvg(svg: string, imageDataUrl: string, options: { size?: number; padding?: number } = {}) {
  const size = options.size ?? 44;
  const padding = options.padding ?? 8;
  const viewBoxMatch = svg.match(/viewBox="([^"]+)"/);
  const widthMatch = svg.match(/width="(\d+(?:\.\d+)?)"/);
  const heightMatch = svg.match(/height="(\d+(?:\.\d+)?)"/);
  const [, , , viewWidthRaw, viewHeightRaw] = viewBoxMatch?.[1].split(/\s+/).map(Number) ?? [];
  const width = Number.isFinite(viewWidthRaw) ? viewWidthRaw : Number(widthMatch?.[1] ?? 196);
  const height = Number.isFinite(viewHeightRaw) ? viewHeightRaw : Number(heightMatch?.[1] ?? 196);
  const x = (width - size) / 2;
  const y = (height - size) / 2;
  const backgroundSize = size + padding * 2;
  const backgroundX = (width - backgroundSize) / 2;
  const backgroundY = (height - backgroundSize) / 2;
  const escapedDataUrl = imageDataUrl.replaceAll("&", "&amp;").replaceAll('"', "&quot;");
  const overlay = [
    `<rect x="${backgroundX}" y="${backgroundY}" width="${backgroundSize}" height="${backgroundSize}" rx="${Math.max(4, padding)}" fill="#ffffff"/>`,
    `<image href="${escapedDataUrl}" x="${x}" y="${y}" width="${size}" height="${size}" preserveAspectRatio="xMidYMid meet"/>`,
  ].join("");

  return svg.replace("</svg>", `${overlay}</svg>`);
}

function normalizeLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export type ToolLocale = "en" | "zh";

function cjkCharacters(value: string) {
  return Array.from(value.matchAll(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu)).length;
}

export function textStats(value: string) {
  const latinWords = value.replace(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu, " ").trim().split(/\s+/).filter(Boolean);
  const cjkCount = cjkCharacters(value);
  const words = value.trim().split(/\s+/).filter(Boolean);
  const lines = value.length ? value.split(/\r\n|\r|\n/).length : 0;
  const sentences = value.split(/[.!?。！？]+/).map((item) => item.trim()).filter(Boolean).length;
  const paragraphs = value.split(/\n\s*\n/).map((item) => item.trim()).filter(Boolean).length;
  const wordLikeCount = latinWords.length + cjkCount;
  return {
    characters: value.length,
    charactersNoSpaces: value.replace(/\s/g, "").length,
    words: words.length,
    latinWords: latinWords.length,
    cjkCharacters: cjkCount,
    wordLikeCount,
    lines,
    sentences,
    paragraphs,
    bytes: new TextEncoder().encode(value).length,
    readingMinutes: Math.max(1, Math.ceil(wordLikeCount / 250)),
  };
}

export function textStatsReport(value: string, locale: ToolLocale = "en") {
  const stats = textStats(value);
  if (locale === "zh") {
    return [
      `词数（英文按词、中文按字）：${stats.wordLikeCount}`,
      `英文单词：${stats.latinWords}`,
      `中文/CJK 字符：${stats.cjkCharacters}`,
      `字符数：${stats.characters}`,
      `不含空格字符数：${stats.charactersNoSpaces}`,
      `行数：${stats.lines}`,
      `段落数：${stats.paragraphs}`,
      `句子数：${stats.sentences}`,
      `字节数：${stats.bytes}`,
      `预计阅读时间：${stats.readingMinutes} 分钟`,
    ].join("\n");
  }
  return [
    `Words: ${stats.wordLikeCount}`,
    `Latin words: ${stats.latinWords}`,
    `CJK characters: ${stats.cjkCharacters}`,
    `Characters: ${stats.characters}`,
    `Characters without spaces: ${stats.charactersNoSpaces}`,
    `Lines: ${stats.lines}`,
    `Paragraphs: ${stats.paragraphs}`,
    `Sentences: ${stats.sentences}`,
    `Bytes: ${stats.bytes}`,
    `Reading time: ${stats.readingMinutes} min`,
  ].join("\n");
}

export function cleanWhitespace(value: string, mode: "compact" | "preserve-lines" | "pdf" = "compact") {
  if (mode === "preserve-lines") {
    return value.split(/\r\n|\r|\n/).map((line) => line.replace(/[ \t]+/g, " ").trim()).join("\n").replace(/\n{3,}/g, "\n\n").trim();
  }
  if (mode === "pdf") {
    return value
      .replace(/-\s*\n\s*/g, "")
      .replace(/(?<![。！？.!?])\n(?!\n)/g, " ")
      .replace(/[ \t]+/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }
  return value.replace(/\s+/g, " ").trim();
}

export function caseReport(value: string, locale: ToolLocale = "en") {
  const items = locale === "zh"
    ? [
        ["全大写", value.toUpperCase()],
        ["全小写", value.toLowerCase()],
        ["标题格式", value.replace(/[-_]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())],
        ["句首大写", value.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, (char) => char.toUpperCase())],
      ]
    : [
        ["UPPERCASE", value.toUpperCase()],
        ["lowercase", value.toLowerCase()],
        ["Title Case", value.replace(/[-_]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())],
        ["Sentence case", value.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, (char) => char.toUpperCase())],
      ];
  return items.map(([label, result]) => `${label}: ${result}`).join("\n\n");
}

export function sortLines(value: string) {
  return normalizeLines(value).sort((a, b) => a.localeCompare(b)).join("\n");
}

export function dedupeLines(value: string) {
  return Array.from(new Set(normalizeLines(value))).join("\n");
}

export function removeEmptyLines(value: string) {
  return value.split(/\r\n|\r|\n/).filter((line) => line.trim()).join("\n");
}

export function randomizeLines(value: string) {
  const lines = normalizeLines(value);
  const shuffled = [...lines];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled.join("\n");
}

export function extractEmails(value: string, locale: ToolLocale = "en") {
  return [...value.matchAll(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi)].map((match) => match[0]).join("\n") || (locale === "zh" ? "未找到邮箱地址。" : "No emails found.");
}

export function extractUrls(value: string, locale: ToolLocale = "en") {
  return [...value.matchAll(/https?:\/\/[^\s<>"']+/gi)].map((match) => match[0].replace(/[),.;:!?]+$/g, "")).join("\n") || (locale === "zh" ? "未找到 URL。" : "No URLs found.");
}

export function extractNumbers(value: string, locale: ToolLocale = "en") {
  return [...value.matchAll(/-?\d+(?:\.\d+)?/g)].map((match) => match[0]).join("\n") || (locale === "zh" ? "未找到数字。" : "No numbers found.");
}

export function unicodeEscape(value: string) {
  return Array.from(value).map((char) => `\\u${char.codePointAt(0)?.toString(16).padStart(4, "0") ?? "0000"}`).join("");
}

export function unicodeUnescape(value: string) {
  return value.replace(/\\u\{([\dA-F]+)\}|\\u([\dA-F]{4})/gi, (_, braced: string | undefined, plain: string | undefined) =>
    String.fromCodePoint(Number.parseInt(braced ?? plain ?? "0", 16)),
  );
}

export function textToHex(value: string) {
  return Array.from(new TextEncoder().encode(value), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function hexToText(value: string) {
  const normalized = value.replace(/\s+/g, "");
  if (normalized.length % 2 !== 0 || /[^\dA-F]/i.test(normalized)) throw new Error("Hex input must contain complete byte pairs.");
  const bytes = normalized.match(/.{2}/g)?.map((item) => Number.parseInt(item, 16)) ?? [];
  return new TextDecoder().decode(Uint8Array.from(bytes));
}

export function textToBinary(value: string) {
  return Array.from(new TextEncoder().encode(value), (byte) => byte.toString(2).padStart(8, "0")).join(" ");
}

export function binaryToText(value: string) {
  const bytes = value.trim().split(/\s+/).filter(Boolean).map((item) => {
    if (!/^[01]{8}$/.test(item)) throw new Error("Binary input must use 8-bit byte groups.");
    return Number.parseInt(item, 2);
  });
  return new TextDecoder().decode(Uint8Array.from(bytes));
}

export function stripHtml(value: string) {
  const spaced = value.replace(/<\/(p|div|h[1-6]|li|article|section|br)>/gi, " ");
  if (typeof DOMParser !== "undefined") {
    const parsed = new DOMParser().parseFromString(spaced, "text/html");
    return (parsed.body.textContent ?? "").replace(/\s+/g, " ").trim();
  }
  return spaced.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function markdownToText(value: string) {
  return value
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_~>#-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function readingTime(value: string, locale: ToolLocale = "en") {
  const minutes = textStats(value).readingMinutes;
  return locale === "zh" ? `预计阅读时间：${minutes} 分钟` : `${minutes} min read`;
}

export function loremIpsum(paragraphCount: string | number) {
  const count = Math.max(1, Math.min(10, Number(paragraphCount) || 3));
  return Array.from({ length: count }, () => "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae sem at nibh facilisis posuere.").join("\n\n");
}

export async function csvToJson(value: string) {
  const Papa = (await import("papaparse")).default;
  const parsed = Papa.parse<Record<string, string>>(value, {
    header: true,
    skipEmptyLines: true,
  });
  if (parsed.errors.length > 0) {
    throw new Error(parsed.errors.map((error) => error.message).join("; "));
  }
  return JSON.stringify(parsed.data, null, 2);
}

export async function jsonToCsv(value: string) {
  const Papa = (await import("papaparse")).default;
  const parsed = JSON.parse(value) as unknown;
  if (!Array.isArray(parsed)) {
    throw new Error("JSON to CSV expects an array of objects.");
  }
  return Papa.unparse(parsed);
}

export async function jsonToYaml(value: string) {
  const YAML = (await import("yaml")).default;
  return YAML.stringify(JSON.parse(value)).trim();
}

export async function yamlToJson(value: string) {
  const YAML = (await import("yaml")).default;
  return JSON.stringify(YAML.parse(value), null, 2);
}

export async function tomlToJson(value: string) {
  const toml = await import("smol-toml");
  return JSON.stringify(toml.parse(value), null, 2);
}

export async function formatYaml(value: string) {
  const YAML = (await import("yaml")).default;
  return YAML.stringify(YAML.parse(value)).trim();
}

export async function formatSql(value: string) {
  const { format } = await import("sql-formatter");
  return format(value, {
    language: "postgresql",
    keywordCase: "upper",
    tabWidth: 2,
  }).trim();
}

export async function formatHtml(value: string) {
  const prettier = (await import("prettier/standalone")).default;
  const htmlPlugin = (await import("prettier/plugins/html")).default;
  return (
    await prettier.format(value, {
      parser: "html",
      plugins: [htmlPlugin],
    })
  ).trim();
}

export async function formatCss(value: string) {
  const prettier = (await import("prettier/standalone")).default;
  const postcssPlugin = (await import("prettier/plugins/postcss")).default;
  return (
    await prettier.format(value, {
      parser: "css",
      plugins: [postcssPlugin],
    })
  ).trim();
}

export async function formatJavascript(value: string) {
  const prettier = (await import("prettier/standalone")).default;
  const babelPlugin = (await import("prettier/plugins/babel")).default;
  const estreePlugin = (await import("prettier/plugins/estree")).default;
  return (
    await prettier.format(value, {
      parser: "babel",
      plugins: [babelPlugin, estreePlugin],
    })
  ).trim();
}

export function runRegexTest(pattern: string, flags: string, input: string, replacement = "") {
  const regex = new RegExp(pattern, flags);
  const matchRegex = regex.global ? regex : new RegExp(regex.source, `${regex.flags}g`);
  const matches = [...input.matchAll(matchRegex)];
  const replacementPreview = input.replace(matchRegex, replacement);
  const output = matches.length
    ? `${matches
        .map((item, index) => {
          const groups = item.slice(1).map((group, groupIndex) => `  group ${groupIndex + 1}: ${group ?? ""}`).join("\n");
          return `match ${index + 1}: ${item[0]}\nindex: ${item.index ?? 0}${groups ? `\n${groups}` : ""}`;
        })
        .join("\n\n")}\n\nReplacement preview:\n${replacementPreview}`
    : "No matches.";

  return { matches, output, replacementPreview };
}

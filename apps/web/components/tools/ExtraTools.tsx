"use client";

import QRCode from "qrcode";
import { useEffect, useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n";
import {
  addCenterImageToSvg,
  binaryToText,
  caseReport,
  cleanWhitespace,
  csvToJson,
  dedupeLines,
  extractEmails,
  extractNumbers,
  extractUrls,
  formatCss,
  formatJavascript,
  formatSql,
  formatYaml,
  hexToText,
  jsonToCsv,
  jsonToYaml,
  loremIpsum,
  markdownToText,
  parseUrlParts,
  randomizeLines,
  readingTime,
  removeEmptyLines,
  runRegexTest,
  sortLines,
  stripHtml,
  textStatsReport,
  textToBinary,
  textToHex,
  tomlToJson,
  unicodeEscape,
  unicodeUnescape,
  yamlToJson,
} from "@/lib/tool-transforms";
import { localizeText, toolCopy, type LocalizedText } from "@/lib/tool-ui-copy";
import { fireAndForgetToolExecution } from "@/lib/tool-usage-client";
import { CopyButton, ResetButton, StatusMessage, ToolButton, ToolHistory, ToolInput, ToolPanel, ToolTextarea, useToolHistory } from "./ToolPrimitives";

type JsonDiffRow = { path: string; status: "added" | "removed" | "changed"; before?: string; after?: string };

function formatXml(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return "";

  const parser = new DOMParser();
  const parsed = parser.parseFromString(trimmed, "application/xml");
  const error = parsed.querySelector("parsererror");
  if (error) {
    throw new Error("Invalid XML. Check tag names, nesting, and closing tags.");
  }

  const compact = trimmed.replace(/>\s+</g, "><");
  const tokens = compact.match(/<[^>]+>|[^<]+/g) ?? [];
  let indent = 0;

  return tokens
    .map((token) => {
      const current = token.trim();
      if (!current) return "";
      if (/^<\//.test(current)) indent = Math.max(indent - 1, 0);
      const line = `${"  ".repeat(indent)}${current}`;
      if (/^<[^!?/][^>]*[^/]?>$/.test(current) && !current.includes("</")) indent += 1;
      return line;
    })
    .filter(Boolean)
    .join("\n");
}

function escapeHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function downloadTextFile(filename: string, value: string) {
  if (!value) return;
  const blob = new Blob([value], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function normalizeLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
}

async function digestText(input: string, algorithm: "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512") {
  const bytes = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest(algorithm, bytes);
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function makeSlug(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function parseUserAgentString(input: string) {
  const value = input.trim();
  if (!value) throw new Error("Paste a user agent string first.");
  const lower = value.toLowerCase();
  const edge = /edg\/([\d.]+)/i.exec(value);
  const opera = /opr\/([\d.]+)/i.exec(value);
  const chrome = /chrome\/([\d.]+)/i.exec(value);
  const firefox = /firefox\/([\d.]+)/i.exec(value);
  const safari = /version\/([\d.]+).*safari/i.exec(value);
  const ie = /msie\s([\d.]+)/i.exec(value) ?? /trident\/.*rv:([\d.]+)/i.exec(value);
  const android = /android\s([\d.]+)/i.exec(value);
  const iphone = /iphone os ([\d_]+)/i.exec(value);
  const ipad = /cpu os ([\d_]+)/i.exec(value);
  const mac = /mac os x ([\d_]+)/i.exec(value);
  const webkit = /applewebkit\/([\d.]+)/i.exec(value);
  const gecko = /gecko\/([\d.]+)/i.exec(value);
  const trident = /trident\/([\d.]+)/i.exec(value);

  const browser = edge
    ? `Microsoft Edge ${edge[1]}`
    : opera
      ? `Opera ${opera[1]}`
      : chrome && !/chromium/i.test(value)
        ? `Chrome ${chrome[1]}`
        : firefox
          ? `Firefox ${firefox[1]}`
          : safari
            ? `Safari ${safari[1]}`
            : ie
              ? `Internet Explorer ${ie[1]}`
              : "Unknown browser";

  const os = /windows nt 10/i.test(value)
    ? "Windows 10/11"
    : /windows nt 6\.3/i.test(value)
      ? "Windows 8.1"
      : /windows nt 6\.1/i.test(value)
        ? "Windows 7"
        : android
          ? `Android ${android[1]}`
          : iphone
            ? `iOS ${iphone[1].replaceAll("_", ".")}`
            : ipad
              ? `iPadOS ${ipad[1].replaceAll("_", ".")}`
              : mac
                ? `macOS ${mac[1].replaceAll("_", ".")}`
                : /linux/i.test(value)
                  ? "Linux"
                  : "Unknown OS";

  const device = /ipad|tablet/i.test(value) ? "Tablet" : /mobile|iphone|android/i.test(value) ? "Mobile" : "Desktop or bot";
  const engine = webkit ? `WebKit/Blink ${webkit[1]}` : gecko && firefox ? `Gecko ${gecko[1]}` : trident ? `Trident ${trident[1]}` : "Unknown engine";
  const flags = [
    lower.includes("bot") || lower.includes("crawler") || lower.includes("spider") ? "Possible bot/crawler" : null,
    lower.includes("wv") ? "Android WebView" : null,
    lower.includes("mobile") ? "Mobile token present" : null,
  ].filter(Boolean);

  return JSON.stringify({ browser, operatingSystem: os, deviceType: device, renderingEngine: engine, flags, raw: value }, null, 2);
}

function parseLooseFields(value: string) {
  return Object.fromEntries(
    value
      .split(/\n|,/)
      .map((line) => {
        const [key = "", ...rest] = line.split(/[:=]/);
        return [key.trim().toLowerCase(), rest.join(":").trim()];
      })
      .filter(([key, item]) => key && item),
  );
}

function splitDiffInput(value: string) {
  const delimiter = /\n-{3,}\n/;
  const parts = value.split(delimiter);
  if (parts.length < 2) {
    throw new Error("Separate the two text blocks with a line containing ---.");
  }
  return [parts[0] ?? "", parts.slice(1).join("\n---\n")];
}

function lineDiffReport(value: string, locale: Locale = "en") {
  const [left, right] = splitDiffInput(value);
  const leftLines = left.split(/\r\n|\r|\n/);
  const rightLines = right.split(/\r\n|\r|\n/);
  const max = Math.max(leftLines.length, rightLines.length);
  const rows: string[] = [];
  let added = 0;
  let removed = 0;
  let changed = 0;

  for (let index = 0; index < max; index += 1) {
    const before = leftLines[index];
    const after = rightLines[index];
    if (before === after) {
      rows.push(`  ${String(index + 1).padStart(3, " ")}  ${before ?? ""}`);
      continue;
    }
    if (before === undefined) {
      added += 1;
      rows.push(`+ ${String(index + 1).padStart(3, " ")}  ${after ?? ""}`);
      continue;
    }
    if (after === undefined) {
      removed += 1;
      rows.push(`- ${String(index + 1).padStart(3, " ")}  ${before}`);
      continue;
    }
    changed += 1;
    rows.push(`- ${String(index + 1).padStart(3, " ")}  ${before}`);
    rows.push(`+ ${String(index + 1).padStart(3, " ")}  ${after}`);
  }

  const header = locale === "zh"
    ? `变更摘要：新增 ${added} 行，删除 ${removed} 行，修改 ${changed} 行`
    : `Summary: ${added} added, ${removed} removed, ${changed} changed`;
  return `${header}\n\n${rows.join("\n")}`;
}

function parseEnvToJson(value: string) {
  const result: Record<string, string> = {};
  const lines = value.split(/\r\n|\r|\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const normalized = line.startsWith("export ") ? line.slice(7).trim() : line;
    const equalsIndex = normalized.indexOf("=");
    if (equalsIndex <= 0) {
      throw new Error(`Invalid .env line: ${rawLine}`);
    }
    const key = normalized.slice(0, equalsIndex).trim();
    let item = normalized.slice(equalsIndex + 1).trim();
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) {
      throw new Error(`Invalid environment variable name: ${key}`);
    }
    if ((item.startsWith('"') && item.endsWith('"')) || (item.startsWith("'") && item.endsWith("'"))) {
      item = item.slice(1, -1);
    }
    result[key] = item;
  }
  return JSON.stringify(result, null, 2);
}

function quoteEnvValue(value: unknown) {
  const text = typeof value === "string" ? value : JSON.stringify(value);
  if (/^[A-Za-z0-9_./:-]*$/.test(text)) return text;
  return JSON.stringify(text);
}

function jsonToEnvLines(value: string) {
  const parsed = JSON.parse(value) as unknown;
  if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") {
    throw new Error("JSON to ENV expects a flat JSON object.");
  }
  return Object.entries(parsed as Record<string, unknown>)
    .map(([key, item]) => {
      if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) {
        throw new Error(`Invalid environment variable name: ${key}`);
      }
      return `${key}=${quoteEnvValue(item)}`;
    })
    .join("\n");
}

function parseQueryString(value: string) {
  const input = value.trim().replace(/^[^?]*\?/, "").replace(/^#/, "");
  const params = new URLSearchParams(input);
  const result: Record<string, string | string[]> = {};
  for (const [key, item] of params.entries()) {
    const current = result[key];
    if (current === undefined) result[key] = item;
    else if (Array.isArray(current)) current.push(item);
    else result[key] = [current, item];
  }
  return JSON.stringify(result, null, 2);
}

function buildQueryString(value: string) {
  const parsed = JSON.parse(value) as unknown;
  if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") {
    throw new Error("Query string builder expects a JSON object.");
  }
  const params = new URLSearchParams();
  for (const [key, item] of Object.entries(parsed as Record<string, unknown>)) {
    if (Array.isArray(item)) {
      item.forEach((entry) => params.append(key, String(entry)));
    } else if (item !== undefined && item !== null) {
      params.set(key, String(item));
    }
  }
  return params.toString();
}

function parseHttpHeaders(value: string) {
  const result: Record<string, string | string[]> = {};
  for (const rawLine of value.split(/\r\n|\r|\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    const separator = line.indexOf(":");
    if (separator <= 0) {
      throw new Error(`Invalid header line: ${rawLine}`);
    }
    const key = line.slice(0, separator).trim().toLowerCase();
    const item = line.slice(separator + 1).trim();
    const current = result[key];
    if (current === undefined) result[key] = item;
    else if (Array.isArray(current)) current.push(item);
    else result[key] = [current, item];
  }
  return JSON.stringify(result, null, 2);
}

function fieldNumber(fields: Record<string, string>, keys: string[], fallback = 0) {
  const key = keys.find((item) => fields[item] !== undefined);
  if (!key) return fallback;
  const value = Number(fields[key].replace(/[^\d.-]/g, ""));
  return Number.isFinite(value) ? value : fallback;
}

function money(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);
}

const zodiacSigns = ["aries", "taurus", "gemini", "cancer", "leo", "virgo", "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"];
const zodiacZh: Record<string, string> = {
  "白羊": "aries",
  "金牛": "taurus",
  "双子": "gemini",
  "巨蟹": "cancer",
  "狮子": "leo",
  "处女": "virgo",
  "天秤": "libra",
  "天蝎": "scorpio",
  "射手": "sagittarius",
  "摩羯": "capricorn",
  "水瓶": "aquarius",
  "双鱼": "pisces",
};

function normalizeZodiac(value: string) {
  const lower = value.toLowerCase();
  return zodiacSigns.find((sign) => lower.includes(sign)) ?? Object.entries(zodiacZh).find(([key]) => value.includes(key))?.[1] ?? "aries";
}

function zodiacCompatibility(input: string, locale: Locale = "en") {
  const parts = input.split(/\n|,|，|\/|\+/).map((item) => item.trim()).filter(Boolean);
  const first = normalizeZodiac(parts[0] ?? input);
  const second = normalizeZodiac(parts[1] ?? input);
  const a = zodiacSigns.indexOf(first);
  const b = zodiacSigns.indexOf(second);
  const distance = Math.min(Math.abs(a - b), 12 - Math.abs(a - b));
  const score = Math.max(52, 94 - distance * 7 + (a % 4 === b % 4 ? 8 : 0));
  if (locale === "zh") {
    return [
      `${first.toUpperCase()} + ${second.toUpperCase()}`,
      `契合度：${Math.min(98, score)}%`,
      distance <= 2 ? "相处风格：自然顺畅，但需要持续制造新鲜感。" : "相处风格：互补性更强，需要通过明确沟通磨合节奏。",
      "提示：星座配对适合作为聊天参考，不是关系结论。",
    ].join("\n");
  }
  return [`${first.toUpperCase()} + ${second.toUpperCase()}`, `Compatibility: ${Math.min(98, score)}%`, distance <= 2 ? "Style: naturally smooth, but remember to keep novelty alive." : "Style: complementary, with more room for growth through clear communication.", "Tip: use this as a conversation prompt, not a relationship verdict."].join("\n");
}

function fiveElements(input: string, locale: Locale = "en") {
  const date = new Date(input.trim());
  if (Number.isNaN(date.getTime())) throw new Error("Enter a date like 1995-08-17.");
  const stems = ["Wood", "Wood", "Fire", "Fire", "Earth", "Earth", "Metal", "Metal", "Water", "Water"];
  const branches = ["Water", "Earth", "Wood", "Wood", "Earth", "Fire", "Fire", "Earth", "Metal", "Metal", "Earth", "Water"];
  const year = date.getFullYear();
  const yearStem = stems[(year - 4) % 10];
  const yearBranch = branches[(year - 4) % 12];
  const monthElement = stems[date.getMonth() % stems.length];
  const dayElement = branches[date.getDate() % branches.length];
  const counts = [yearStem, yearBranch, monthElement, dayElement].reduce<Record<string, number>>((acc, item) => {
    acc[item] = (acc[item] ?? 0) + 1;
    return acc;
  }, {});
  const elementZh: Record<string, string> = { Wood: "木", Fire: "火", Earth: "土", Metal: "金", Water: "水" };
  if (locale === "zh") {
    return [
      `出生日期：${date.toISOString().slice(0, 10)}`,
      `五行估算：${Object.entries(counts).map(([key, count]) => `${elementZh[key] ?? key} x${count}`).join("，")}`,
      `较强元素：${elementZh[Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? ""] ?? "较均衡"}`,
      "提示：这是基于日期的轻量参考，不是完整八字排盘。",
    ].join("\n");
  }
  return [`Birth date: ${date.toISOString().slice(0, 10)}`, `Estimated elements: ${Object.entries(counts).map(([key, count]) => `${key} x${count}`).join(", ")}`, `Strongest: ${Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Balanced"}`, "Note: this is a lightweight calendar-based reference, not a full BaZi reading."].join("\n");
}

function bmi(input: string, locale: Locale = "en") {
  const fields = parseLooseFields(input);
  const heightCm = fieldNumber(fields, ["height", "身高", "height cm"], 170);
  const weightKg = fieldNumber(fields, ["weight", "体重", "weight kg"], 65);
  const value = weightKg / (heightCm / 100) ** 2;
  const category = value < 18.5 ? ["Underweight", "偏瘦"] : value < 25 ? ["Normal", "正常"] : value < 30 ? ["Overweight", "超重"] : ["Obesity", "肥胖"];
  return locale === "zh"
    ? [`BMI：${value.toFixed(1)}`, `分类：${category[1]}`, `身高：${heightCm} cm`, `体重：${weightKg} kg`].join("\n")
    : [`BMI: ${value.toFixed(1)}`, `Category: ${category[0]}`, `Height: ${heightCm} cm`, `Weight: ${weightKg} kg`].join("\n");
}

function calories(input: string, locale: Locale = "en") {
  const fields = parseLooseFields(input);
  const sex = `${fields.sex ?? fields["性别"] ?? "male"}`.toLowerCase();
  const age = fieldNumber(fields, ["age", "年龄"], 30);
  const height = fieldNumber(fields, ["height", "身高"], 170);
  const weight = fieldNumber(fields, ["weight", "体重"], 65);
  const activity = fieldNumber(fields, ["activity", "活动系数"], 1.375);
  const bmr = 10 * weight + 6.25 * height - 5 * age + (sex.includes("female") || sex.includes("女") ? -161 : 5);
  const tdee = bmr * activity;
  return locale === "zh"
    ? [`基础代谢：${Math.round(bmr)} kcal/天`, `维持热量：${Math.round(tdee)} kcal/天`, `减脂参考：${Math.round(tdee - 400)} kcal/天`, `增肌参考：${Math.round(tdee + 250)} kcal/天`].join("\n")
    : [`BMR: ${Math.round(bmr)} kcal/day`, `Maintenance calories: ${Math.round(tdee)} kcal/day`, `Fat loss reference: ${Math.round(tdee - 400)} kcal/day`, `Muscle gain reference: ${Math.round(tdee + 250)} kcal/day`].join("\n");
}

function financialGoal(input: string, locale: Locale = "en") {
  const fields = parseLooseFields(input);
  const target = fieldNumber(fields, ["target", "目标"], 100000);
  const current = fieldNumber(fields, ["current", "已有"], 10000);
  const months = Math.max(1, fieldNumber(fields, ["months", "月数"], 36));
  const annualReturn = fieldNumber(fields, ["return", "收益率"], 4) / 100;
  const monthlyRate = annualReturn / 12;
  const futureCurrent = current * (1 + monthlyRate) ** months;
  const monthly = monthlyRate === 0 ? (target - current) / months : (target - futureCurrent) * monthlyRate / ((1 + monthlyRate) ** months - 1);
  return locale === "zh"
    ? [`目标金额：${money(target)}`, `已有资金预计增长到：${money(futureCurrent)}`, `每月需储蓄：${money(Math.max(0, monthly))}`, `假设年化收益：${(annualReturn * 100).toFixed(1)}%`].join("\n")
    : [`Target: ${money(target)}`, `Current projected value: ${money(futureCurrent)}`, `Required monthly savings: ${money(Math.max(0, monthly))}`, `Assumption: ${(annualReturn * 100).toFixed(1)}% annual return`].join("\n");
}

function sleepPlan(input: string, locale: Locale = "en") {
  const fields = parseLooseFields(input);
  const wake = fields.wake ?? fields["起床"] ?? "07:00";
  const [hour = 7, minute = 0] = wake.split(":").map(Number);
  const wakeDate = new Date();
  wakeDate.setHours(hour, minute, 0, 0);
  const options = [6, 5, 4].map((cycles) => {
    const bedtime = new Date(wakeDate.getTime() - cycles * 90 * 60 * 1000 - 15 * 60 * 1000);
    return locale === "zh" ? `${cycles} 个睡眠周期：建议 ${bedtime.toTimeString().slice(0, 5)} 入睡` : `${cycles} cycles: ${bedtime.toTimeString().slice(0, 5)} bedtime`;
  });
  return locale === "zh"
    ? [`起床时间：${wakeDate.toTimeString().slice(0, 5)}`, ...options, "已预留 15 分钟入睡缓冲。"].join("\n")
    : [`Wake time: ${wakeDate.toTimeString().slice(0, 5)}`, ...options, "Includes a 15-minute fall-asleep buffer."].join("\n");
}

function retirement(input: string, locale: Locale = "en") {
  const fields = parseLooseFields(input);
  const age = fieldNumber(fields, ["age", "年龄"], 30);
  const retireAge = fieldNumber(fields, ["retire", "退休年龄"], 60);
  const current = fieldNumber(fields, ["current", "已有"], 100000);
  const monthly = fieldNumber(fields, ["monthly", "每月"], 3000);
  const annualReturn = fieldNumber(fields, ["return", "收益率"], 5) / 100;
  const months = Math.max(0, (retireAge - age) * 12);
  const monthlyRate = annualReturn / 12;
  const futureCurrent = current * (1 + monthlyRate) ** months;
  const futureMonthly = monthlyRate === 0 ? monthly * months : monthly * (((1 + monthlyRate) ** months - 1) / monthlyRate);
  return locale === "zh"
    ? [`距离退休：${Math.max(0, retireAge - age)} 年`, `预计退休储蓄：${money(futureCurrent + futureMonthly)}`, `已有资金贡献：${money(futureCurrent)}`, `每月投入贡献：${money(futureMonthly)}`].join("\n")
    : [`Years to retirement: ${Math.max(0, retireAge - age)}`, `Projected savings: ${money(futureCurrent + futureMonthly)}`, `From current savings: ${money(futureCurrent)}`, `From monthly contributions: ${money(futureMonthly)}`].join("\n");
}

function GenericTextTransformTool({
  label,
  sample,
  transform,
  tool,
  outputLabel = "Output",
  locale = "en",
}: {
  label: string;
  sample: string;
  transform: (value: string, locale: Locale) => string | Promise<string>;
  tool: string;
  outputLabel?: string;
  locale?: Locale;
}) {
  const copy = toolCopy(locale);
  const [input, setInput] = useState(sample);
  const [output, setOutput] = useState("");
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState<"success" | "error">("success");
  const history = useToolHistory(`madabase:${tool}:history`);

  async function run() {
    try {
      const nextOutput = await transform(input, locale);
      setOutput(nextOutput);
      history.remember(input, nextOutput);
      setMessage(copy.done);
      setTone("success");
      fireAndForgetToolExecution(tool);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : copy.unable);
      setTone("error");
    }
  }

  return (
    <ToolPanel label={locale === "zh" ? "本地浏览器工具" : "local browser tool"}>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <ToolTextarea label={label} value={input} onChange={setInput} rows={10} />
          <div className="flex flex-wrap gap-2">
            <ToolButton onClick={run}>{copy.run}</ToolButton>
            <ResetButton label={copy.reset} onClick={() => { setInput(sample); setOutput(""); setMessage(""); }} />
          </div>
          <StatusMessage message={message} tone={tone} />
        </div>
        <div className="space-y-4">
          <ToolTextarea label={outputLabel} value={output} readOnly rows={10} />
          <div className="flex flex-wrap gap-2">
            <CopyButton value={output} label={copy.copy} copiedLabel={copy.copied} />
            <ToolButton variant="secondary" onClick={() => downloadTextFile(`${tool}-output.txt`, output)}>{copy.download}</ToolButton>
          </div>
          <ToolHistory
            items={history.items}
            locale={locale}
            onClear={history.clear}
            onUse={(item) => {
              setInput(item.input);
              setOutput(item.output);
              setMessage("");
            }}
          />
        </div>
      </div>
    </ToolPanel>
  );
}

type UtilityGroup = "text" | "list" | "extract" | "encoding" | "writing";

type UtilityOperation = {
  id: string;
  label: LocalizedText;
  sample: LocalizedText;
  outputLabel: LocalizedText;
  transform: (value: string, locale: Locale) => string | Promise<string>;
};

const utilityOperations: Record<UtilityGroup, UtilityOperation[]> = {
  text: [
    {
      id: "text-stats",
      label: { en: "Text stats", zh: "字数统计" },
      sample: { en: "Madabase helps developers ship faster with useful browser tools.", zh: "Madabase 提供 JSON、二维码、文本清理等在线工具，帮助团队更快完成日常处理。" },
      outputLabel: { en: "Statistics", zh: "统计结果" },
      transform: textStatsReport,
    },
    {
      id: "clean-whitespace",
      label: { en: "Clean whitespace", zh: "清理空白" },
      sample: { en: "  Madabase    builds   tools.\n\n  Clean   this text.  ", zh: "  这是一段   从网页复制来的文本。\n\n\n  里面有多余空格、空行和缩进。  " },
      outputLabel: { en: "Clean text", zh: "清理结果" },
      transform: (value) => cleanWhitespace(value),
    },
    {
      id: "clean-pdf-copy",
      label: { en: "Clean PDF copy", zh: "清理 PDF 复制文本" },
      sample: { en: "This is a hyphen-\nated line from a PDF.\nThe next line should continue.", zh: "这是一段从 PDF\n复制出来的文本。\n英文 hyphen-\nation 会被合并。" },
      outputLabel: { en: "Clean text", zh: "清理结果" },
      transform: (value) => cleanWhitespace(value, "pdf"),
    },
    {
      id: "normalize-lines",
      label: { en: "Preserve paragraphs", zh: "保留段落清理" },
      sample: { en: "  Keep   this paragraph.\n  Trim each line.\n\n  Keep the next paragraph.  ", zh: "  保留这个段落。\n  每行只清理多余空格。\n\n  第二段仍然保留。  " },
      outputLabel: { en: "Clean text", zh: "清理结果" },
      transform: (value) => cleanWhitespace(value, "preserve-lines"),
    },
    {
      id: "case-report",
      label: { en: "Convert case", zh: "大小写转换" },
      sample: { en: "madabase growth infrastructure", zh: "madabase growth infrastructure" },
      outputLabel: { en: "Converted cases", zh: "转换结果" },
      transform: caseReport,
    },
    {
      id: "html-stripper",
      label: { en: "HTML to text", zh: "HTML 转纯文本" },
      sample: { en: "<article><h1>Madabase</h1><p>Useful tools.</p></article>", zh: "<article><h1>Madabase</h1><p>实用在线工具。</p></article>" },
      outputLabel: { en: "Plain text", zh: "纯文本" },
      transform: stripHtml,
    },
    {
      id: "markdown-to-text",
      label: { en: "Markdown to text", zh: "Markdown 转纯文本" },
      sample: { en: "# Madabase Tools\n\nBuild **useful** tools with [links](https://tools.madabase.com).", zh: "# Madabase Tools\n\n把 **Markdown** 内容转换成纯文本，保留链接文字。" },
      outputLabel: { en: "Plain text", zh: "纯文本" },
      transform: markdownToText,
    },
  ],
  list: [
    {
      id: "line-sorter",
      label: { en: "Sort lines", zh: "行排序" },
      sample: { en: "banana\napple\ncarrot", zh: "香蕉\n苹果\n胡萝卜" },
      outputLabel: { en: "Sorted lines", zh: "排序结果" },
      transform: sortLines,
    },
    {
      id: "line-deduplicator",
      label: { en: "Deduplicate", zh: "按行去重" },
      sample: { en: "api\njson\napi\nseo", zh: "接口\nJSON\n接口\nSEO" },
      outputLabel: { en: "Unique lines", zh: "去重结果" },
      transform: dedupeLines,
    },
    {
      id: "empty-line-remover",
      label: { en: "Remove empty lines", zh: "移除空行" },
      sample: { en: "Madabase\n\n\nTools\n\nTests", zh: "第一行\n\n\n第二行\n\n第三行" },
      outputLabel: { en: "Cleaned text", zh: "处理结果" },
      transform: removeEmptyLines,
    },
    {
      id: "list-randomizer",
      label: { en: "Randomize", zh: "随机打乱" },
      sample: { en: "alpha\nbeta\ngamma\ndelta", zh: "方案 A\n方案 B\n方案 C\n方案 D" },
      outputLabel: { en: "Randomized lines", zh: "随机结果" },
      transform: randomizeLines,
    },
  ],
  extract: [
    {
      id: "email-extractor",
      label: { en: "Extract emails", zh: "提取邮箱" },
      sample: { en: "Contact hello@madabase.com or team@example.dev for access.", zh: "请联系 hello@madabase.com 或 team@example.dev 获取权限。" },
      outputLabel: { en: "Emails", zh: "邮箱列表" },
      transform: extractEmails,
    },
    {
      id: "url-extractor",
      label: { en: "Extract URLs", zh: "提取 URL" },
      sample: { en: "Visit https://tools.madabase.com and https://example.com/docs.", zh: "访问 https://tools.madabase.com 和 https://example.com/docs 查看示例。" },
      outputLabel: { en: "URLs", zh: "URL 列表" },
      transform: extractUrls,
    },
    {
      id: "number-extractor",
      label: { en: "Extract numbers", zh: "提取数字" },
      sample: { en: "Orders: 24 today, 138 this week, 1200 this month.", zh: "今天 24 单，本周 138 单，本月 1200 单。" },
      outputLabel: { en: "Numbers", zh: "数字列表" },
      transform: extractNumbers,
    },
  ],
  encoding: [
    {
      id: "unicode-escape",
      label: { en: "Unicode escape", zh: "Unicode 转义" },
      sample: { en: "Madabase Tools", zh: "Madabase 工具" },
      outputLabel: { en: "Escaped text", zh: "转义结果" },
      transform: unicodeEscape,
    },
    {
      id: "unicode-unescape",
      label: { en: "Unicode unescape", zh: "Unicode 反转义" },
      sample: "\\u004d\\u0061\\u0064\\u0061\\u0062\\u0061\\u0073\\u0065",
      outputLabel: { en: "Text", zh: "文本" },
      transform: unicodeUnescape,
    },
    {
      id: "text-to-hex",
      label: { en: "Text to hex", zh: "文本转 Hex" },
      sample: { en: "Madabase", zh: "工具" },
      outputLabel: { en: "Hex", zh: "Hex 结果" },
      transform: textToHex,
    },
    {
      id: "hex-to-text",
      label: { en: "Hex to text", zh: "Hex 转文本" },
      sample: "4d61646162617365",
      outputLabel: { en: "Text", zh: "文本" },
      transform: hexToText,
    },
    {
      id: "text-to-binary",
      label: { en: "Text to binary", zh: "文本转二进制" },
      sample: { en: "Mada", zh: "码" },
      outputLabel: { en: "Binary", zh: "二进制结果" },
      transform: textToBinary,
    },
    {
      id: "binary-to-text",
      label: { en: "Binary to text", zh: "二进制转文本" },
      sample: "01001101 01100001 01100100 01100001",
      outputLabel: { en: "Text", zh: "文本" },
      transform: binaryToText,
    },
  ],
  writing: [
    {
      id: "reading-time",
      label: { en: "Reading time", zh: "阅读时间" },
      sample: { en: "Madabase helps teams format JSON, run tests, and build small workflows faster.", zh: "Madabase 帮助团队快速格式化 JSON、运行测试，并完成日常文本处理。" },
      outputLabel: { en: "Reading estimate", zh: "阅读估算" },
      transform: readingTime,
    },
    {
      id: "lorem-ipsum",
      label: { en: "Lorem ipsum", zh: "占位文本" },
      sample: "3",
      outputLabel: { en: "Generated text", zh: "生成文本" },
      transform: loremIpsum,
    },
  ],
};

const utilitySlugMap: Record<string, { group: UtilityGroup; operation: string }> = {
  "word-counter": { group: "text", operation: "text-stats" },
  "character-counter": { group: "text", operation: "text-stats" },
  "case-converter": { group: "text", operation: "case-report" },
  "text-cleaner": { group: "text", operation: "clean-whitespace" },
  "html-stripper": { group: "text", operation: "html-stripper" },
  "markdown-to-text": { group: "text", operation: "markdown-to-text" },
  "line-sorter": { group: "list", operation: "line-sorter" },
  "line-deduplicator": { group: "list", operation: "line-deduplicator" },
  "empty-line-remover": { group: "list", operation: "empty-line-remover" },
  "list-randomizer": { group: "list", operation: "list-randomizer" },
  "email-extractor": { group: "extract", operation: "email-extractor" },
  "url-extractor": { group: "extract", operation: "url-extractor" },
  "number-extractor": { group: "extract", operation: "number-extractor" },
  "unicode-escape": { group: "encoding", operation: "unicode-escape" },
  "unicode-unescape": { group: "encoding", operation: "unicode-unescape" },
  "hex-to-text": { group: "encoding", operation: "hex-to-text" },
  "text-to-hex": { group: "encoding", operation: "text-to-hex" },
  "binary-to-text": { group: "encoding", operation: "binary-to-text" },
  "text-to-binary": { group: "encoding", operation: "text-to-binary" },
  "reading-time": { group: "writing", operation: "reading-time" },
  "lorem-ipsum": { group: "writing", operation: "lorem-ipsum" },
};

function UtilityToolbox({ group, initialOperation, tool, locale = "en" }: { group: UtilityGroup; initialOperation: string; tool: string; locale?: Locale }) {
  const copy = toolCopy(locale);
  const operations = utilityOperations[group];
  const initial = operations.find((operation) => operation.id === initialOperation) ?? operations[0];
  const [operationId, setOperationId] = useState(initial.id);
  const operation = operations.find((item) => item.id === operationId) ?? initial;
  const [input, setInput] = useState(localizeText(operation.sample, locale));
  const [output, setOutput] = useState("");
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState<"success" | "error">("success");
  const history = useToolHistory(`madabase:${tool}:${operation.id}:history`);

  function selectOperation(nextOperation: UtilityOperation) {
    setOperationId(nextOperation.id);
    setInput(localizeText(nextOperation.sample, locale));
    setOutput("");
    setMessage("");
  }

  async function run() {
    try {
      const nextOutput = await operation.transform(input, locale);
      setOutput(nextOutput);
      history.remember(input, nextOutput);
      setMessage(copy.done);
      setTone("success");
      fireAndForgetToolExecution(tool);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : copy.unable);
      setTone("error");
    }
  }

  return (
    <ToolPanel label={locale === "zh" ? "工具箱" : "Toolbox"}>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {operations.map((item) => (
            <ToolButton key={item.id} variant={item.id === operation.id ? "primary" : "secondary"} onClick={() => selectOperation(item)}>
              {localizeText(item.label, locale)}
            </ToolButton>
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-4">
            <ToolTextarea label={copy.input} value={input} onChange={setInput} rows={10} />
            <div className="flex flex-wrap gap-2">
              <ToolButton onClick={run}>{copy.run}</ToolButton>
              <ResetButton label={copy.reset} onClick={() => { setInput(localizeText(operation.sample, locale)); setOutput(""); setMessage(""); }} />
            </div>
            <StatusMessage message={message} tone={tone} />
          </div>
          <div className="space-y-4">
            <ToolTextarea label={localizeText(operation.outputLabel, locale)} value={output} readOnly rows={10} />
            <div className="flex flex-wrap gap-2">
              <CopyButton value={output} label={copy.copy} copiedLabel={copy.copied} />
              <ToolButton variant="secondary" onClick={() => downloadTextFile(`${operation.id}-output.txt`, output)}>{copy.download}</ToolButton>
            </div>
            <ToolHistory
              items={history.items}
              locale={locale}
              onClear={history.clear}
              onUse={(item) => {
                setInput(item.input);
                setOutput(item.output);
                setMessage("");
              }}
            />
          </div>
        </div>
      </div>
    </ToolPanel>
  );
}

export function JsonDiff({ locale = "en" }: { locale?: Locale }) {
  const copy = toolCopy(locale);
  const sampleLeft = '{"name":"Madabase","mode":"old","tools":["json","jwt"],"active":true}';
  const sampleRight = '{"name":"Madabase","mode":"new","tools":["json","jwt","qr"],"active":true}';
  const [left, setLeft] = useState(sampleLeft);
  const [right, setRight] = useState(sampleRight);
  const [rows, setRows] = useState<JsonDiffRow[]>([]);
  const [output, setOutput] = useState("");
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState<"success" | "error">("success");

  function flattenJson(value: unknown, prefix = "$", result: Record<string, unknown> = {}) {
    if (Array.isArray(value)) {
      value.forEach((item, index) => flattenJson(item, `${prefix}[${index}]`, result));
      if (value.length === 0) result[prefix] = [];
      return result;
    }
    if (value && typeof value === "object") {
      const entries = Object.entries(value as Record<string, unknown>);
      if (entries.length === 0) result[prefix] = {};
      entries.forEach(([key, item]) => flattenJson(item, `${prefix}.${key}`, result));
      return result;
    }
    result[prefix] = value;
    return result;
  }

  function run() {
    try {
      const leftJson = JSON.parse(left) as unknown;
      const rightJson = JSON.parse(right) as unknown;
      const leftFlat = flattenJson(leftJson);
      const rightFlat = flattenJson(rightJson);
      const keys = Array.from(new Set([...Object.keys(leftFlat), ...Object.keys(rightFlat)])).sort();
      const nextRows: JsonDiffRow[] = [];
      for (const key of keys) {
        const before = leftFlat[key];
        const after = rightFlat[key];
        if (!(key in leftFlat)) {
          nextRows.push({ path: key, status: "added", after: JSON.stringify(after) });
          continue;
        }
        if (!(key in rightFlat)) {
          nextRows.push({ path: key, status: "removed", before: JSON.stringify(before) });
          continue;
        }
        if (JSON.stringify(before) !== JSON.stringify(after)) {
          nextRows.push({ path: key, status: "changed", before: JSON.stringify(before), after: JSON.stringify(after) });
        }
      }
      const nextOutput = nextRows.length
        ? nextRows.map((row) => `${row.status.toUpperCase()} ${row.path}\n- ${row.before ?? ""}\n+ ${row.after ?? ""}`).join("\n\n")
        : locale === "zh" ? "未发现差异。" : "No differences found.";
      setRows(nextRows);
      setOutput(nextOutput);
      setMessage(nextRows.length ? (locale === "zh" ? `找到 ${nextRows.length} 处变更路径。` : `${nextRows.length} changed path${nextRows.length === 1 ? "" : "s"} found.`) : locale === "zh" ? "未发现差异。" : "No differences found.");
      setTone("success");
      fireAndForgetToolExecution("json-diff");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : locale === "zh" ? "JSON 输入无效。" : "Invalid JSON input.");
      setTone("error");
    }
  }

  return (
    <ToolPanel>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <ToolTextarea label={locale === "zh" ? "左侧 JSON" : "Left JSON"} value={left} onChange={setLeft} rows={10} />
          <ToolTextarea label={locale === "zh" ? "右侧 JSON" : "Right JSON"} value={right} onChange={setRight} rows={10} />
          <div className="flex flex-wrap gap-2">
            <ToolButton onClick={run}>{locale === "zh" ? "对比 JSON" : "Compare JSON"}</ToolButton>
            <ResetButton label={copy.reset} onClick={() => { setLeft(sampleLeft); setRight(sampleRight); setRows([]); setOutput(""); setMessage(""); }} />
          </div>
          <StatusMessage message={message} tone={tone} />
        </div>
        <div className="space-y-4">
          <div className="min-h-[280px] rounded-md border border-[var(--border)] bg-white p-3">
            <p className="code-font text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-soft)]">{locale === "zh" ? "路径差异" : "Path diff"}</p>
            <div className="mt-3 space-y-2">
              {rows.length > 0 ? rows.map((row) => (
                <div key={`${row.path}-${row.status}`} className="rounded-md border border-[var(--border)] bg-[var(--surface-muted)] p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <code className="text-xs font-semibold text-[var(--text)]">{row.path}</code>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold uppercase ${row.status === "added" ? "bg-emerald-100 text-emerald-700" : row.status === "removed" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"}`}>{locale === "zh" ? ({ added: "新增", removed: "删除", changed: "变更" }[row.status]) : row.status}</span>
                  </div>
                  {row.before ? <pre className="mt-2 overflow-auto rounded bg-rose-50 px-2 py-1 text-xs text-rose-800">- {row.before}</pre> : null}
                  {row.after ? <pre className="mt-2 overflow-auto rounded bg-emerald-50 px-2 py-1 text-xs text-emerald-800">+ {row.after}</pre> : null}
                </div>
              )) : <p className="text-sm text-[var(--text-muted)]">{locale === "zh" ? "运行对比后查看变更路径。" : "Run a comparison to inspect changed JSON paths."}</p>}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <CopyButton value={output} label={copy.copy} copiedLabel={copy.copied} />
            <ToolButton variant="secondary" onClick={() => downloadTextFile("json-diff.txt", output)}>{copy.download}</ToolButton>
          </div>
        </div>
      </div>
    </ToolPanel>
  );
}

export function JsonEscape({ locale = "en" }: { locale?: Locale }) {
  return <GenericTextTransformTool label={locale === "zh" ? "JSON 字符串" : "JSON string"} sample={'{"message":"hello \"world\""}'} tool="json-escape" transform={(value) => JSON.stringify(value)} outputLabel={locale === "zh" ? "转义结果" : "Escaped output"} locale={locale} />;
}

export function YamlFormatter({ locale = "en" }: { locale?: Locale }) {
  return <GenericTextTransformTool label={locale === "zh" ? "YAML 输入" : "YAML input"} sample={"name: Madabase\ntools:\n  - JSON Formatter\n  - JWT Decoder"} tool="yaml-formatter" transform={formatYaml} outputLabel={locale === "zh" ? "格式化后的 YAML" : "Formatted YAML"} locale={locale} />;
}

export function XmlFormatter({ locale = "en" }: { locale?: Locale }) {
  return <GenericTextTransformTool label={locale === "zh" ? "XML 输入" : "XML input"} sample={'<root><tool>Madabase</tool><type>formatter</type></root>'} tool="xml-formatter" transform={formatXml} outputLabel={locale === "zh" ? "格式化后的 XML" : "Formatted XML"} locale={locale} />;
}

export function SqlFormatter({ locale = "en" }: { locale?: Locale }) {
  return <GenericTextTransformTool label={locale === "zh" ? "SQL 输入" : "SQL input"} sample={"select id,name from users where status='active' order by created_at desc"} tool="sql-formatter" transform={formatSql} outputLabel={locale === "zh" ? "格式化后的 SQL" : "Formatted SQL"} locale={locale} />;
}

export function RegexTester({ locale = "en" }: { locale?: Locale }) {
  const copy = toolCopy(locale);
  const [pattern, setPattern] = useState("madabase");
  const [flags, setFlags] = useState("gi");
  const [input, setInput] = useState("Madabase builds tools. madabase writes SEO pages.");
  const [replacement, setReplacement] = useState("toolbox");
  const [output, setOutput] = useState("");
  const [highlighted, setHighlighted] = useState("");
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState<"success" | "error">("success");

  function run() {
    try {
      const result = runRegexTest(pattern, flags, input, replacement);
      const matches = result.matches;
      let cursor = 0;
      const parts: string[] = [];
      for (const match of matches) {
        const index = match.index ?? 0;
        parts.push(escapeHtml(input.slice(cursor, index)));
        parts.push(`<mark class="rounded bg-amber-200 px-1 text-[var(--text)]">${escapeHtml(match[0])}</mark>`);
        cursor = index + match[0].length;
      }
      parts.push(escapeHtml(input.slice(cursor)));
      setHighlighted(parts.join(""));
      setOutput(result.output);
      setMessage(locale === "zh" ? `找到 ${matches.length} 个匹配。` : `Found ${matches.length} match${matches.length === 1 ? "" : "es"}.`);
      setTone("success");
      fireAndForgetToolExecution("regex-tester");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : locale === "zh" ? "正则表达式无效。" : "Invalid regex.");
      setTone("error");
    }
  }

  return (
    <ToolPanel>
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <ToolInput label={locale === "zh" ? "正则表达式" : "Pattern"} value={pattern} onChange={setPattern} />
          <ToolInput label={locale === "zh" ? "标志" : "Flags"} value={flags} onChange={setFlags} />
        </div>
        <ToolInput label={locale === "zh" ? "替换文本" : "Replacement"} value={replacement} onChange={setReplacement} />
        <ToolTextarea label={locale === "zh" ? "测试文本" : "Test text"} value={input} onChange={setInput} rows={8} />
        <div className="flex flex-wrap gap-2">
          <ToolButton onClick={run}>{locale === "zh" ? "测试正则" : "Test regex"}</ToolButton>
          <CopyButton value={output} label={copy.copy} copiedLabel={copy.copied} />
          <ToolButton variant="secondary" onClick={() => downloadTextFile("regex-result.txt", output)}>{copy.download}</ToolButton>
        </div>
        <StatusMessage message={message} tone={tone} />
        <div className="rounded-md border border-[var(--border)] bg-white p-3">
          <p className="code-font text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-soft)]">{locale === "zh" ? "高亮匹配" : "Highlighted matches"}</p>
          <div className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[var(--text)]" dangerouslySetInnerHTML={{ __html: highlighted || escapeHtml(input) }} />
        </div>
        <ToolTextarea label={locale === "zh" ? "匹配结果" : "Matches"} value={output} readOnly rows={8} />
      </div>
    </ToolPanel>
  );
}

export function CronGenerator({ locale = "en" }: { locale?: Locale }) {
  const [minute, setMinute] = useState("0");
  const [hour, setHour] = useState("9");
  const [dayOfWeek, setDayOfWeek] = useState("*");
  const copy = {
    minute: locale === "zh" ? "分钟" : "Minute",
    hour: locale === "zh" ? "小时" : "Hour",
    dayOfWeek: locale === "zh" ? "星期" : "Day of week",
    invalid: locale === "zh" ? "请输入 0-23 的小时和 0-59 的分钟来预览执行时间。" : "Use numeric hour 0-23 and minute 0-59 to preview runs.",
    noRun: locale === "zh" ? "未来 14 天内没有匹配的执行时间。" : "No run in the next 14 days.",
    presets: locale === "zh"
      ? [
          ["每天 9 点", "0", "9", "*"],
          ["每小时", "0", "*", "*"],
          ["周一 9 点", "0", "9", "1"],
          ["周五 17 点", "0", "17", "5"],
        ]
      : [
          ["Daily 9 AM", "0", "9", "*"],
          ["Hourly", "0", "*", "*"],
          ["Monday 9 AM", "0", "9", "1"],
          ["Friday 5 PM", "0", "17", "5"],
        ],
    expression: locale === "zh" ? "Cron 表达式" : "Cron expression",
    nextRuns: locale === "zh" ? "接下来执行时间" : "Next runs",
    copy: locale === "zh" ? "复制" : "Copy",
    copied: locale === "zh" ? "已复制" : "Copied",
    generate: locale === "zh" ? "生成" : "Generate",
  };
  const runs = useMemo(() => {
    const minuteValue = Number(minute);
    const hourValue = Number(hour);
    if (!Number.isInteger(minuteValue) || !Number.isInteger(hourValue) || minuteValue < 0 || minuteValue > 59 || hourValue < 0 || hourValue > 23) {
      return [copy.invalid];
    }
    const items: string[] = [];
    const cursor = new Date();
    cursor.setSeconds(0, 0);
    for (let offset = 0; items.length < 5 && offset < 14; offset += 1) {
      const candidate = new Date(cursor);
      candidate.setDate(cursor.getDate() + offset);
      candidate.setHours(hourValue, minuteValue, 0, 0);
      if (candidate <= cursor) continue;
      if (dayOfWeek !== "*" && candidate.getDay() !== Number(dayOfWeek)) continue;
      items.push(candidate.toLocaleString());
    }
    return items.length ? items : [copy.noRun];
  }, [copy.invalid, copy.noRun, dayOfWeek, hour, minute]);
  const cronExpression = `${minute || "*"} ${hour || "*"} * * ${dayOfWeek || "*"}`;

  return (
    <ToolPanel>
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <ToolInput label={copy.minute} value={minute} onChange={setMinute} />
          <ToolInput label={copy.hour} value={hour} onChange={setHour} />
          <ToolInput label={copy.dayOfWeek} value={dayOfWeek} onChange={setDayOfWeek} />
        </div>
        <div className="flex flex-wrap gap-2">
          {copy.presets.map(([label, nextMinute, nextHour, nextDay]) => (
            <ToolButton key={label} variant="secondary" onClick={() => { setMinute(nextMinute); setHour(nextHour); setDayOfWeek(nextDay); }}>{label}</ToolButton>
          ))}
        </div>
        <ToolTextarea label={copy.expression} value={cronExpression} readOnly rows={3} />
        <ToolTextarea label={copy.nextRuns} value={runs.join("\n")} readOnly rows={5} />
        <div className="flex flex-wrap gap-2">
          <CopyButton value={cronExpression} label={copy.copy} copiedLabel={copy.copied} />
          <ToolButton onClick={() => fireAndForgetToolExecution("cron-generator")}>{copy.generate}</ToolButton>
        </div>
      </div>
    </ToolPanel>
  );
}

export function HashGenerator({ locale = "en" }: { locale?: Locale }) {
  return <GenericTextTransformTool label={locale === "zh" ? "纯文本" : "Plain text"} sample="Madabase" tool="hash-generator" transform={async (value) => {
    const [sha1, sha256, sha384, sha512] = await Promise.all([
      digestText(value, "SHA-1"),
      digestText(value, "SHA-256"),
      digestText(value, "SHA-384"),
      digestText(value, "SHA-512"),
    ]);
    return [`SHA-1: ${sha1}`, `SHA-256: ${sha256}`, `SHA-384: ${sha384}`, `SHA-512: ${sha512}`].join("\n\n");
  }} outputLabel={locale === "zh" ? "哈希结果" : "Hash output"} locale={locale} />;
}

export function ColorConverter({ locale = "en" }: { locale?: Locale }) {
  const copy = toolCopy(locale);
  const [input, setInput] = useState("#0f766e");
  const [output, setOutput] = useState("");
  const [preview, setPreview] = useState("#0f766e");
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState<"success" | "error">("success");

  function parseColor(value: string) {
    const normalized = value.trim();
    if (/^#[\dA-F]{3}$/i.test(normalized)) {
      const [, r, g, b] = normalized;
      return [r, g, b].map((part) => Number.parseInt(`${part}${part}`, 16));
    }
    if (/^#[\dA-F]{6}$/i.test(normalized)) {
      return [normalized.slice(1, 3), normalized.slice(3, 5), normalized.slice(5, 7)].map((part) => Number.parseInt(part, 16));
    }
    const rgb = normalized.match(/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i);
    if (rgb) return rgb.slice(1).map(Number);
    throw new Error(locale === "zh" ? "请输入 #0f766e 这样的 HEX，或 rgb(15, 118, 110) 这样的 RGB。" : "Use HEX like #0f766e or RGB like rgb(15, 118, 110).");
  }

  function convert() {
    try {
      const [red, green, blue] = parseColor(input);
      if ([red, green, blue].some((item) => item < 0 || item > 255)) throw new Error(locale === "zh" ? "RGB 数值必须在 0 到 255 之间。" : "RGB values must be between 0 and 255.");
      const max = Math.max(red, green, blue) / 255;
      const min = Math.min(red, green, blue) / 255;
      const lightness = (max + min) / 2;
      const delta = max - min;
      const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));
      let hue = 0;
      if (delta !== 0) {
        const r = red / 255;
        const g = green / 255;
        const b = blue / 255;
        hue = max === r ? ((g - b) / delta) % 6 : max === g ? (b - r) / delta + 2 : (r - g) / delta + 4;
      }
      const h = Math.round(hue * 60 < 0 ? hue * 60 + 360 : hue * 60);
      const hex = `#${[red, green, blue].map((item) => item.toString(16).padStart(2, "0")).join("")}`;
      setPreview(hex);
      setOutput([`HEX: ${hex}`, `RGB: rgb(${red}, ${green}, ${blue})`, `HSL: hsl(${h}, ${Math.round(saturation * 100)}%, ${Math.round(lightness * 100)}%)`, `CSS variable: --color: ${hex};`].join("\n"));
      setMessage(locale === "zh" ? "颜色已转换。" : "Color converted.");
      setTone("success");
      fireAndForgetToolExecution("color-converter");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : locale === "zh" ? "无法转换颜色。" : "Unable to convert color.");
      setTone("error");
    }
  }

  return (
    <ToolPanel>
      <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
        <div className="space-y-4">
          <ToolInput label={locale === "zh" ? "颜色" : "Color"} value={input} onChange={setInput} />
          <div className="flex flex-wrap gap-2">
            <ToolButton onClick={convert}>{locale === "zh" ? "转换" : "Convert"}</ToolButton>
            <CopyButton value={output} label={copy.copy} copiedLabel={copy.copied} />
          </div>
          <StatusMessage message={message} tone={tone} />
          <ToolTextarea label={locale === "zh" ? "转换结果" : "Converted values"} value={output} readOnly rows={6} />
        </div>
        <div className="rounded-md border border-[var(--border)] bg-white p-4">
          <div className="aspect-square rounded-md border border-[var(--border)]" style={{ background: preview }} />
          <p className="mt-3 text-sm font-semibold text-[var(--text)]">{preview}</p>
        </div>
      </div>
    </ToolPanel>
  );
}

export function PasswordGenerator({ locale = "en" }: { locale?: Locale }) {
  const copy = toolCopy(locale);
  const [length, setLength] = useState("16");
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [output, setOutput] = useState("");
  const [message, setMessage] = useState("");

  function generate() {
    const pools = [
      includeUppercase ? "ABCDEFGHJKLMNPQRSTUVWXYZ" : "",
      includeLowercase ? "abcdefghijkmnopqrstuvwxyz" : "",
      includeNumbers ? "23456789" : "",
      includeSymbols ? "!@#$%^&*_-+=" : "",
    ].filter(Boolean);
    const chars = pools.join("");
    const size = Math.max(8, Math.min(128, Number(length) || 16));
    if (!chars) {
      setMessage(locale === "zh" ? "至少选择一种字符集。" : "Choose at least one character set.");
      return;
    }
    const bytes = new Uint32Array(size);
    crypto.getRandomValues(bytes);
    setOutput(Array.from(bytes, (item) => chars[item % chars.length]).join(""));
    setMessage(locale === "zh" ? `已生成 ${size} 位密码，包含 ${pools.length} 种字符集。` : `Generated a ${size}-character password with ${pools.length} character set${pools.length === 1 ? "" : "s"}.`);
    fireAndForgetToolExecution("password-generator");
  }

  useEffect(() => {
    generate();
    // Generate once on mount; later changes wait for the explicit button.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ToolPanel>
      <div className="space-y-4">
        <ToolInput label={locale === "zh" ? "密码长度" : "Password length"} value={length} onChange={setLength} type="number" />
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: locale === "zh" ? "大写字母" : "Uppercase", checked: includeUppercase, setter: setIncludeUppercase },
            { label: locale === "zh" ? "小写字母" : "Lowercase", checked: includeLowercase, setter: setIncludeLowercase },
            { label: locale === "zh" ? "数字" : "Numbers", checked: includeNumbers, setter: setIncludeNumbers },
            { label: locale === "zh" ? "符号" : "Symbols", checked: includeSymbols, setter: setIncludeSymbols },
          ].map((option) => (
            <label key={option.label} className="flex items-center gap-2 rounded-md border border-[var(--border)] bg-white px-3 py-2 text-sm font-semibold text-[var(--text)]">
              <input type="checkbox" checked={option.checked} onChange={(event) => option.setter(event.target.checked)} />
              {option.label}
            </label>
          ))}
        </div>
        <ToolTextarea label={locale === "zh" ? "生成的密码" : "Generated password"} value={output} readOnly rows={4} />
        <div className="flex flex-wrap gap-2">
          <CopyButton value={output} label={copy.copy} copiedLabel={copy.copied} />
          <ToolButton onClick={generate}>{copy.generate}</ToolButton>
        </div>
        <StatusMessage message={message} tone="success" />
      </div>
    </ToolPanel>
  );
}

export function WordCounter({ locale = "en" }: { locale?: Locale }) {
  return <UtilityToolbox group="text" initialOperation="text-stats" tool="word-counter" locale={locale} />;
}

export function CharacterCounter({ locale = "en" }: { locale?: Locale }) {
  return <UtilityToolbox group="text" initialOperation="text-stats" tool="character-counter" locale={locale} />;
}

export function CaseConverter({ locale = "en" }: { locale?: Locale }) {
  return <UtilityToolbox group="text" initialOperation="case-report" tool="case-converter" locale={locale} />;
}

export function TextCleaner({ locale = "en" }: { locale?: Locale }) {
  return <UtilityToolbox group="text" initialOperation="clean-whitespace" tool="text-cleaner" locale={locale} />;
}

export function SlugGenerator({ locale = "en" }: { locale?: Locale }) {
  return (
    <GenericTextTransformTool
      label={locale === "zh" ? "标题" : "Title"}
      sample={locale === "zh" ? "最好用的在线开发者工具" : "Best Online Developer Tools"}
      tool="slug-generator"
      transform={makeSlug}
      outputLabel={locale === "zh" ? "生成的 Slug" : "Generated slug"}
      locale={locale}
    />
  );
}

export function QrCodeGenerator({ locale = "en" }: { locale?: Locale }) {
  const copy = toolCopy(locale);
  const [input, setInput] = useState("https://tools.madabase.com/en/tools");
  const [svg, setSvg] = useState("");
  const [logoDataUrl, setLogoDataUrl] = useState("");
  const [logoName, setLogoName] = useState("");
  const [logoSize, setLogoSize] = useState(44);
  const [darkColor, setDarkColor] = useState("#111827");
  const [lightColor, setLightColor] = useState("#ffffff");
  const [errorCorrection, setErrorCorrection] = useState<"L" | "M" | "Q" | "H">("H");
  const [pngSize, setPngSize] = useState("512");
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState<"success" | "error">("success");

  useEffect(() => {
    let cancelled = false;

    async function render() {
      if (!input.trim()) {
        setSvg("");
        setMessage("");
        return;
      }

      try {
        const nextSvg = await QRCode.toString(input, {
          type: "svg",
          errorCorrectionLevel: errorCorrection,
          margin: 2,
          width: 196,
          color: {
            dark: darkColor,
            light: lightColor,
          },
        });
        if (!cancelled) {
          setSvg(logoDataUrl ? addCenterImageToSvg(nextSvg, logoDataUrl, { size: logoSize }) : nextSvg);
          setMessage(locale === "zh" ? "二维码已生成。" : "Valid QR code generated.");
          setTone("success");
        }
      } catch (error) {
        if (!cancelled) {
          setSvg("");
          setMessage(error instanceof Error ? error.message : locale === "zh" ? "无法生成二维码。" : "Unable to generate QR code.");
          setTone("error");
        }
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [darkColor, errorCorrection, input, lightColor, locale, logoDataUrl, logoSize]);

  function handleLogoUpload(file: File | undefined) {
    if (!file) return;
    const allowedTypes = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);
    if (!allowedTypes.has(file.type)) {
      setMessage(locale === "zh" ? "请上传 PNG、JPG、WebP 或 GIF 图片作为中心 Logo。" : "Upload a PNG, JPG, WebP, or GIF image for the center logo.");
      setTone("error");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setLogoDataUrl(typeof reader.result === "string" ? reader.result : "");
      setLogoName(file.name);
      setMessage(locale === "zh" ? "中心图片已添加。" : "Center image added.");
      setTone("success");
    };
    reader.onerror = () => {
      setMessage(locale === "zh" ? "无法读取上传的图片。" : "Unable to read the uploaded image.");
      setTone("error");
    };
    reader.readAsDataURL(file);
  }

  function clearLogo() {
    setLogoDataUrl("");
    setLogoName("");
  }

  function downloadSvg() {
    downloadTextFile("madabase-qr.svg", svg);
  }

  function downloadPng() {
    if (!svg) return;
    const image = new Image();
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const size = Math.max(128, Math.min(2048, Number(pngSize) || 512));
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext("2d");
      if (!context) return;
      context.fillStyle = lightColor;
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "madabase-qr.png";
      link.click();
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      setMessage(locale === "zh" ? "无法导出 PNG。" : "Unable to export PNG.");
      setTone("error");
    };
    image.src = url;
  }

  return (
    <ToolPanel>
      <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
        <div className="space-y-4">
          <ToolInput label={locale === "zh" ? "文本或 URL" : "Text or URL"} value={input} onChange={setInput} />
          <div className="grid gap-4 sm:grid-cols-2">
            <ToolInput label={locale === "zh" ? "前景色" : "Foreground color"} value={darkColor} onChange={setDarkColor} />
            <ToolInput label={locale === "zh" ? "背景色" : "Background color"} value={lightColor} onChange={setLightColor} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="code-font text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-soft)]">{locale === "zh" ? "纠错等级" : "Error correction"}</span>
              <select value={errorCorrection} onChange={(event) => setErrorCorrection(event.target.value as "L" | "M" | "Q" | "H")} className="mt-2 h-11 w-full rounded-md border border-[var(--border)] bg-white px-3 text-sm font-semibold text-[var(--text)] outline-none transition focus:border-[var(--brand)] focus:ring-2 focus:ring-[rgba(15,118,110,0.13)]">
                <option value="L">L - 7%</option>
                <option value="M">M - 15%</option>
                <option value="Q">Q - 25%</option>
                <option value="H">H - 30%</option>
              </select>
            </label>
            <ToolInput label={locale === "zh" ? "PNG 尺寸 px" : "PNG size px"} value={pngSize} onChange={setPngSize} type="number" />
          </div>
          <label className="block">
            <span className="code-font text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-soft)]">{locale === "zh" ? "中心图片" : "Center image"}</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={(event) => handleLogoUpload(event.target.files?.[0])}
              className="mt-2 block w-full rounded-md border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--text)] file:mr-3 file:rounded-md file:border-0 file:bg-[var(--surface-code)] file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white"
            />
          </label>
          {logoName ? (
            <div className="flex flex-wrap items-center gap-2 rounded-md border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--text-muted)]">
              <span className="font-semibold text-[var(--text)]">{logoName}</span>
              <ToolButton variant="secondary" onClick={clearLogo}>{locale === "zh" ? "移除图片" : "Remove image"}</ToolButton>
            </div>
          ) : null}
          <label className="block">
            <span className="code-font text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-soft)]">{locale === "zh" ? "Logo 大小" : "Logo size"}</span>
            <input
              type="range"
              min={28}
              max={72}
              value={logoSize}
              onChange={(event) => setLogoSize(Number(event.target.value))}
              className="mt-2 w-full accent-[var(--brand)]"
            />
            <span className="mt-1 block text-xs text-[var(--text-muted)]">{logoSize}px</span>
          </label>
          <div className="flex flex-wrap gap-2">
            <CopyButton value={svg} label={locale === "zh" ? "复制 SVG" : "Copy SVG"} copiedLabel={copy.copied} />
            <ToolButton variant="secondary" onClick={downloadSvg}>{locale === "zh" ? "下载 SVG" : "Download SVG"}</ToolButton>
            <ToolButton variant="secondary" onClick={downloadPng}>{locale === "zh" ? "下载 PNG" : "Download PNG"}</ToolButton>
            <ResetButton label={copy.reset} onClick={() => { setInput("https://tools.madabase.com/en/tools"); setLogoDataUrl(""); setLogoName(""); setLogoSize(44); setDarkColor("#111827"); setLightColor("#ffffff"); setErrorCorrection("H"); setPngSize("512"); }} />
            <ToolButton onClick={() => fireAndForgetToolExecution("qr-code-generator")}>{locale === "zh" ? "生成二维码" : "Generate QR"}</ToolButton>
          </div>
          <StatusMessage message={message} tone={tone} />
        </div>
        <div className="rounded-md border border-[var(--border)] bg-white p-4">
          {svg ? <div dangerouslySetInnerHTML={{ __html: svg }} /> : <div className="grid aspect-square place-items-center text-sm text-[var(--text-soft)]">{locale === "zh" ? "暂无二维码" : "No QR code"}</div>}
        </div>
      </div>
    </ToolPanel>
  );
}

export function HtmlEncoder({ locale = "en" }: { locale?: Locale }) {
  return <GenericTextTransformTool label={locale === "zh" ? "HTML 输入" : "HTML input"} sample={'<div class="card">Madabase</div>'} tool="html-encoder" transform={(value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;")} outputLabel={locale === "zh" ? "编码后的 HTML" : "Encoded HTML"} locale={locale} />;
}

export function CssFormatter({ locale = "en" }: { locale?: Locale }) {
  return <GenericTextTransformTool label={locale === "zh" ? "CSS 输入" : "CSS input"} sample={"body{margin:0;color:#111827}.card{padding:16px;border-radius:8px}"} tool="css-formatter" transform={formatCss} outputLabel={locale === "zh" ? "格式化后的 CSS" : "Formatted CSS"} locale={locale} />;
}

export function JsFormatter({ locale = "en" }: { locale?: Locale }) {
  return <GenericTextTransformTool label={locale === "zh" ? "JavaScript 输入" : "JavaScript input"} sample={"const tools=['json','jwt'];tools.forEach(tool=>console.log(tool));"} tool="js-formatter" transform={formatJavascript} outputLabel={locale === "zh" ? "格式化后的 JavaScript" : "Formatted JavaScript"} locale={locale} />;
}

export function UrlParser({ locale = "en" }: { locale?: Locale }) {
  return <GenericTextTransformTool label={locale === "zh" ? "URL 输入" : "URL input"} sample="https://tools.madabase.com/en/tools/json-formatter?ref=seo#faq" tool="url-parser" transform={parseUrlParts} outputLabel={locale === "zh" ? "URL 解析结果" : "Parsed URL"} locale={locale} />;
}

export function UserAgentParser({ locale = "en" }: { locale?: Locale }) {
  return (
    <GenericTextTransformTool
      label={locale === "zh" ? "User Agent 字符串" : "User agent string"}
      sample="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
      tool="user-agent-parser"
      transform={parseUserAgentString}
      outputLabel={locale === "zh" ? "解析结果" : "Parsed user agent"}
      locale={locale}
    />
  );
}

type GenericToolConfig = {
  label: LocalizedText;
  sample: LocalizedText;
  outputLabel: LocalizedText;
  transform: (value: string, locale: Locale) => string | Promise<string>;
};

const genericToolConfigs: Record<string, GenericToolConfig> = {
  "line-sorter": {
    label: "Lines",
    sample: "banana\napple\ncarrot",
    outputLabel: "Sorted lines",
    transform: (value) => normalizeLines(value).split("\n").sort((a, b) => a.localeCompare(b)).join("\n"),
  },
  "line-deduplicator": {
    label: "Lines",
    sample: "api\njson\napi\nseo",
    outputLabel: "Unique lines",
    transform: (value) => Array.from(new Set(normalizeLines(value).split("\n"))).join("\n"),
  },
  "empty-line-remover": {
    label: "Text",
    sample: "Madabase\n\n\nTools\n\nTests",
    outputLabel: "Cleaned text",
    transform: (value) => value.split("\n").filter((line) => line.trim()).join("\n"),
  },
  "whitespace-normalizer": {
    label: "Text",
    sample: "Madabase     builds\t\tuseful tools.",
    outputLabel: "Normalized text",
    transform: (value) => value.replace(/\s+/g, " ").trim(),
  },
  "text-diff": {
    label: "Left text, then --- then right text",
    sample: "Title: Old JSON Guide\nStatus: Draft\nCTA: Format now\n---\nTitle: New JSON Guide\nStatus: Published\nCTA: Format JSON now",
    outputLabel: "Line diff",
    transform: lineDiffReport,
  },
  "email-extractor": {
    label: "Text",
    sample: "Contact hello@madabase.com or team@example.dev for access.",
    outputLabel: "Emails",
    transform: (value) => [...value.matchAll(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi)].map((match) => match[0]).join("\n") || "No emails found.",
  },
  "url-extractor": {
    label: "Text",
    sample: "Visit https://tools.madabase.com and https://example.com/docs.",
    outputLabel: "URLs",
    transform: (value) => [...value.matchAll(/https?:\/\/[^\s<>"']+/gi)].map((match) => match[0]).join("\n") || "No URLs found.",
  },
  "number-extractor": {
    label: "Text",
    sample: "Orders: 24 today, 138 this week, 1200 this month.",
    outputLabel: "Numbers",
    transform: (value) => [...value.matchAll(/-?\d+(?:\.\d+)?/g)].map((match) => match[0]).join("\n") || "No numbers found.",
  },
  "csv-to-json": {
    label: "CSV",
    sample: "name,role\nAda,Engineer\nLin,Designer",
    outputLabel: "JSON",
    transform: csvToJson,
  },
  "json-to-csv": {
    label: "JSON array",
    sample: '[{"name":"Ada","role":"Engineer"},{"name":"Lin","role":"Designer"}]',
    outputLabel: "CSV",
    transform: jsonToCsv,
  },
  "json-to-yaml": {
    label: "JSON",
    sample: '{"name":"Madabase","tools":60}',
    outputLabel: "YAML-like output",
    transform: jsonToYaml,
  },
  "yaml-to-json": {
    label: "Simple YAML",
    sample: "name: Madabase\ntools: 60",
    outputLabel: "JSON",
    transform: yamlToJson,
  },
  "env-to-json": {
    label: ".env content",
    sample: '# App settings\nAPP_NAME=Madabase Tools\nFEATURE_TESTS=true\nPUBLIC_URL="https://tools.madabase.com"',
    outputLabel: "JSON",
    transform: parseEnvToJson,
  },
  "json-to-env": {
    label: "JSON",
    sample: '{"APP_NAME":"Madabase Tools","FEATURE_TESTS":true,"PUBLIC_URL":"https://tools.madabase.com"}',
    outputLabel: ".env",
    transform: jsonToEnvLines,
  },
  "toml-to-json": {
    label: "Simple TOML",
    sample: 'name = "Madabase"\ntools = 60',
    outputLabel: "JSON",
    transform: tomlToJson,
  },
  "query-string-parser": {
    label: "Query string",
    sample: "https://tools.madabase.com/en/tools/json-formatter?utm_source=seo&tool=json&tag=formatter&tag=developer",
    outputLabel: "Parsed query",
    transform: parseQueryString,
  },
  "query-string-builder": {
    label: "JSON object",
    sample: '{"utm_source":"seo","tool":"json","tag":["formatter","developer"],"lang":"en"}',
    outputLabel: "Query string",
    transform: buildQueryString,
  },
  "http-header-parser": {
    label: "HTTP headers",
    sample: "content-type: application/json\ncache-control: no-cache\nset-cookie: session=abc\nset-cookie: theme=light",
    outputLabel: "JSON headers",
    transform: parseHttpHeaders,
  },
  "user-agent-parser": {
    label: "User agent",
    sample: "Mozilla/5.0 AppleWebKit/537.36 Chrome/126.0 Safari/537.36",
    outputLabel: "UA summary",
    transform: (value) => `Browser: ${value.includes("Chrome") ? "Chrome" : value.includes("Firefox") ? "Firefox" : value.includes("Safari") ? "Safari" : "Unknown"}\nMobile: ${/Mobile|Android|iPhone/i.test(value) ? "yes" : "no"}\nRaw: ${value}`,
  },
  "unicode-escape": {
    label: "Text",
    sample: "Madabase 工具",
    outputLabel: "Unicode escaped",
    transform: unicodeEscape,
  },
  "unicode-unescape": {
    label: "Unicode escaped text",
    sample: "\\u004d\\u0061\\u0064\\u0061\\u0062\\u0061\\u0073\\u0065",
    outputLabel: "Text",
    transform: unicodeUnescape,
  },
  "hex-to-text": {
    label: "Hex",
    sample: "4d61646162617365",
    outputLabel: "Text",
    transform: hexToText,
  },
  "text-to-hex": {
    label: "Text",
    sample: "Madabase",
    outputLabel: "Hex",
    transform: textToHex,
  },
  "binary-to-text": {
    label: "Binary",
    sample: "01001101 01100001 01100100 01100001",
    outputLabel: "Text",
    transform: binaryToText,
  },
  "text-to-binary": {
    label: "Text",
    sample: "Mada",
    outputLabel: "Binary",
    transform: textToBinary,
  },
  "html-stripper": {
    label: "HTML",
    sample: "<article><h1>Madabase</h1><p>Useful tools.</p></article>",
    outputLabel: "Plain text",
    transform: stripHtml,
  },
  "markdown-to-text": {
    label: "Markdown",
    sample: "# Madabase Tools\n\nBuild **useful** tools with [links](https://tools.madabase.com).",
    outputLabel: "Plain text",
    transform: markdownToText,
  },
  "reading-time": {
    label: "Article text",
    sample: "Madabase helps teams format JSON, run tests, and build small workflows faster.",
    outputLabel: "Reading time",
    transform: (value) => `${Math.max(1, Math.ceil(value.trim().split(/\s+/).filter(Boolean).length / 200))} min read`,
  },
  "lorem-ipsum": {
    label: "Paragraph count",
    sample: "3",
    outputLabel: "Generated text",
    transform: (value) => Array.from({ length: Math.max(1, Math.min(10, Number(value) || 3)) }, () => "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae sem at nibh facilisis posuere.").join("\n\n"),
  },
  "list-randomizer": {
    label: "Lines",
    sample: "alpha\nbeta\ngamma\ndelta",
    outputLabel: "Randomized lines",
    transform: (value) => normalizeLines(value).split("\n").sort(() => Math.random() - 0.5).join("\n"),
  },
  "zodiac-compatibility": {
    label: { en: "Two zodiac signs", zh: "两个星座" },
    sample: { en: "Leo, Aquarius", zh: "狮子, 水瓶" },
    outputLabel: { en: "Compatibility", zh: "配对结果" },
    transform: zodiacCompatibility,
  },
  "birthday-five-elements": {
    label: { en: "Birth date", zh: "出生日期" },
    sample: { en: "1995-08-17", zh: "1995-08-17" },
    outputLabel: { en: "Five elements estimate", zh: "五行估算" },
    transform: fiveElements,
  },
  "bmi-calculator": {
    label: { en: "Body data", zh: "身体数据" },
    sample: { en: "height: 170\nweight: 65", zh: "身高: 170\n体重: 65" },
    outputLabel: { en: "BMI result", zh: "BMI 结果" },
    transform: bmi,
  },
  "calorie-calculator": {
    label: { en: "Profile", zh: "个人信息" },
    sample: { en: "sex: female\nage: 30\nheight: 165\nweight: 58\nactivity: 1.375", zh: "性别: 女\n年龄: 30\n身高: 165\n体重: 58\n活动系数: 1.375" },
    outputLabel: { en: "Calorie estimate", zh: "热量估算" },
    transform: calories,
  },
  "financial-goal-calculator": {
    label: { en: "Goal fields", zh: "目标信息" },
    sample: { en: "target: 100000\ncurrent: 10000\nmonths: 36\nreturn: 4", zh: "目标: 100000\n已有: 10000\n月数: 36\n收益率: 4" },
    outputLabel: { en: "Savings plan", zh: "储蓄计划" },
    transform: financialGoal,
  },
  "sleep-calculator": {
    label: { en: "Wake time", zh: "起床时间" },
    sample: { en: "wake: 07:00", zh: "起床: 07:00" },
    outputLabel: { en: "Sleep plan", zh: "睡眠计划" },
    transform: sleepPlan,
  },
  "retirement-calculator": {
    label: { en: "Retirement fields", zh: "退休信息" },
    sample: { en: "age: 30\nretire: 60\ncurrent: 100000\nmonthly: 3000\nreturn: 5", zh: "年龄: 30\n退休年龄: 60\n已有: 100000\n每月: 3000\n收益率: 5" },
    outputLabel: { en: "Retirement estimate", zh: "退休估算" },
    transform: retirement,
  },
};

const fallbackGenericTool = {
  label: "Input",
  sample: "Paste text here",
  outputLabel: "Output",
  transform: (value: string) => value,
};

export function GenericTextTool({ toolSlug = "generic-text-tool", locale = "en" }: { toolSlug?: string; locale?: Locale }) {
  const utility = utilitySlugMap[toolSlug];
  if (utility) {
    return <UtilityToolbox group={utility.group} initialOperation={utility.operation} tool={toolSlug} locale={locale} />;
  }

  const config = genericToolConfigs[toolSlug] ?? fallbackGenericTool;
  return (
    <GenericTextTransformTool
      label={localizeText(config.label, locale)}
      sample={localizeText(config.sample, locale)}
      tool={toolSlug}
      transform={config.transform}
      outputLabel={localizeText(config.outputLabel, locale)}
      locale={locale}
    />
  );
}

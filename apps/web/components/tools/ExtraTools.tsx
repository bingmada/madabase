"use client";

import { useMemo, useState } from "react";
import { fireAndForgetToolExecution } from "@/lib/tool-usage-client";
import { CopyButton, ResetButton, StatusMessage, ToolButton, ToolInput, ToolPanel, ToolTextarea } from "./ToolPrimitives";

function simpleFormatMarkup(input: string) {
  return input
    .replace(/>\s*</g, ">\n<")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
}

function toTitleCase(value: string) {
  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function normalizeLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
}

function simpleHash(input: string) {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash).toString(16);
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

function parseUrl(input: string) {
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

function buildQrSvg(text: string) {
  const cells = 21;
  const size = 8;
  let seed = 0;
  for (let index = 0; index < text.length; index += 1) {
    seed = (seed + text.charCodeAt(index) * (index + 1)) % 9973;
  }

  const rects: string[] = [];
  for (let row = 0; row < cells; row += 1) {
    for (let col = 0; col < cells; col += 1) {
      const isFinder =
        (row < 7 && col < 7) ||
        (row < 7 && col >= cells - 7) ||
        (row >= cells - 7 && col < 7);
      const on = isFinder || ((row * 31 + col * 17 + seed) % 5 < 2);
      if (on) {
        rects.push(`<rect x="${col * size}" y="${row * size}" width="${size}" height="${size}" fill="#111827" />`);
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cells * size} ${cells * size}" width="${cells * size}" height="${cells * size}"><rect width="100%" height="100%" fill="#fff"/>${rects.join("")}</svg>`;
}

function GenericTextTransformTool({
  label,
  sample,
  transform,
  tool,
  outputLabel = "Output",
}: {
  label: string;
  sample: string;
  transform: (value: string) => string;
  tool: string;
  outputLabel?: string;
}) {
  const [input, setInput] = useState(sample);
  const [output, setOutput] = useState("");
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState<"success" | "error">("success");

  function run() {
    try {
      const nextOutput = transform(input);
      setOutput(nextOutput);
      setMessage("Done.");
      setTone("success");
      fireAndForgetToolExecution(tool);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to process input.");
      setTone("error");
    }
  }

  return (
    <ToolPanel>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <ToolTextarea label={label} value={input} onChange={setInput} rows={10} />
          <div className="flex flex-wrap gap-2">
            <ToolButton onClick={run}>Run</ToolButton>
            <ResetButton onClick={() => { setInput(sample); setOutput(""); setMessage(""); }} />
          </div>
          <StatusMessage message={message} tone={tone} />
        </div>
        <div className="space-y-4">
          <ToolTextarea label={outputLabel} value={output} readOnly rows={10} />
          <CopyButton value={output} />
        </div>
      </div>
    </ToolPanel>
  );
}

export function JsonDiff() {
  const sample = '{"name":"Madabase","mode":"old"}\n---\n{"name":"Madabase","mode":"new"}';
  return <GenericTextTransformTool label="Left JSON, then --- then Right JSON" sample={sample} tool="json-diff" transform={(value) => {
    const [leftRaw, rightRaw] = value.split("\n---\n");
    if (!leftRaw || !rightRaw) throw new Error("Separate two JSON documents with --- on its own line.");
    const left = JSON.stringify(JSON.parse(leftRaw), null, 2);
    const right = JSON.stringify(JSON.parse(rightRaw), null, 2);
    if (left === right) return "No differences found.";
    return `Left:\n${left}\n\nRight:\n${right}`;
  }} outputLabel="Diff result" />;
}

export function JsonEscape() {
  return <GenericTextTransformTool label="JSON string" sample={'{"message":"hello \"world\""}'} tool="json-escape" transform={(value) => JSON.stringify(value)} outputLabel="Escaped output" />;
}

export function YamlFormatter() {
  return <GenericTextTransformTool label="YAML input" sample={"name: Madabase\ntools:\n  - JSON Formatter\n  - JWT Decoder"} tool="yaml-formatter" transform={normalizeLines} outputLabel="Formatted YAML" />;
}

export function XmlFormatter() {
  return <GenericTextTransformTool label="XML input" sample={'<root><tool>Madabase</tool><type>formatter</type></root>'} tool="xml-formatter" transform={simpleFormatMarkup} outputLabel="Formatted XML" />;
}

export function SqlFormatter() {
  return <GenericTextTransformTool label="SQL input" sample={"select id,name from users where status='active' order by created_at desc"} tool="sql-formatter" transform={(value) => value.replace(/\b(select|from|where|order by|group by|insert into|values|update|set|delete)\b/gi, (match) => `\n${match.toUpperCase()}` ).trim()} outputLabel="Formatted SQL" />;
}

export function RegexTester() {
  const [pattern, setPattern] = useState("madabase");
  const [flags, setFlags] = useState("gi");
  const [input, setInput] = useState("Madabase builds tools. madabase writes SEO pages.");
  const [output, setOutput] = useState("");
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState<"success" | "error">("success");

  function run() {
    try {
      const regex = new RegExp(pattern, flags);
      const matches = [...input.matchAll(regex)].map((item) => item[0]);
      setOutput(matches.length ? matches.join("\n") : "No matches.");
      setMessage(`Found ${matches.length} match${matches.length === 1 ? "" : "es"}.`);
      setTone("success");
      fireAndForgetToolExecution("regex-tester");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Invalid regex.");
      setTone("error");
    }
  }

  return (
    <ToolPanel>
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <ToolInput label="Pattern" value={pattern} onChange={setPattern} />
          <ToolInput label="Flags" value={flags} onChange={setFlags} />
        </div>
        <ToolTextarea label="Test text" value={input} onChange={setInput} rows={8} />
        <div className="flex flex-wrap gap-2">
          <ToolButton onClick={run}>Test regex</ToolButton>
          <CopyButton value={output} />
        </div>
        <StatusMessage message={message} tone={tone} />
        <ToolTextarea label="Matches" value={output} readOnly rows={8} />
      </div>
    </ToolPanel>
  );
}

export function CronGenerator() {
  const [minute, setMinute] = useState("0");
  const [hour, setHour] = useState("9");
  const expression = `${minute || "*"} ${hour || "*"} * * *`;

  return (
    <ToolPanel>
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <ToolInput label="Minute" value={minute} onChange={setMinute} />
          <ToolInput label="Hour" value={hour} onChange={setHour} />
        </div>
        <ToolTextarea label="Cron expression" value={expression} readOnly rows={4} />
        <div className="flex flex-wrap gap-2">
          <CopyButton value={expression} />
          <ToolButton onClick={() => fireAndForgetToolExecution("cron-generator")}>Generate</ToolButton>
        </div>
      </div>
    </ToolPanel>
  );
}

export function HashGenerator() {
  return <GenericTextTransformTool label="Plain text" sample="Madabase" tool="hash-generator" transform={simpleHash} outputLabel="Hash output" />;
}

export function ColorConverter() {
  return <GenericTextTransformTool label="Hex color" sample="#0f766e" tool="color-converter" transform={(value) => {
    const normalized = value.replace("#", "");
    if (normalized.length !== 6) throw new Error("Use a 6-character hex value.");
    const red = Number.parseInt(normalized.slice(0, 2), 16);
    const green = Number.parseInt(normalized.slice(2, 4), 16);
    const blue = Number.parseInt(normalized.slice(4, 6), 16);
    return `rgb(${red}, ${green}, ${blue})`;
  }} outputLabel="RGB output" />;
}

export function PasswordGenerator() {
  const [length, setLength] = useState("16");
  const output = useMemo(() => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*";
    const size = Math.max(8, Number(length) || 16);
    return Array.from({ length: size }, (_, index) => chars[(index * 13 + size * 7) % chars.length]).join("");
  }, [length]);

  return (
    <ToolPanel>
      <div className="space-y-4">
        <ToolInput label="Password length" value={length} onChange={setLength} type="number" />
        <ToolTextarea label="Generated password" value={output} readOnly rows={4} />
        <div className="flex flex-wrap gap-2">
          <CopyButton value={output} />
          <ToolButton onClick={() => fireAndForgetToolExecution("password-generator")}>Generate</ToolButton>
        </div>
      </div>
    </ToolPanel>
  );
}

export function WordCounter() {
  return <GenericTextTransformTool label="Text input" sample="Madabase helps developers ship faster with useful browser tools." tool="word-counter" transform={(value) => `${value.trim().split(/\s+/).filter(Boolean).length} words`} outputLabel="Count result" />;
}

export function CharacterCounter() {
  return <GenericTextTransformTool label="Text input" sample="Madabase" tool="character-counter" transform={(value) => `${value.length} characters`} outputLabel="Count result" />;
}

export function CaseConverter() {
  return <GenericTextTransformTool label="Text input" sample="madabase growth infrastructure" tool="case-converter" transform={(value) => `UPPERCASE: ${value.toUpperCase()}\n\nlowercase: ${value.toLowerCase()}\n\nTitle Case: ${toTitleCase(value)}`} outputLabel="Converted cases" />;
}

export function TextCleaner() {
  return <GenericTextTransformTool label="Messy text" sample={"  Madabase    builds   tools.\n\n  Clean   this text.  "} tool="text-cleaner" transform={(value) => value.replace(/\s+/g, " ").trim()} outputLabel="Clean text" />;
}

export function SlugGenerator() {
  return <GenericTextTransformTool label="Title" sample="Best Online Developer Tools" tool="slug-generator" transform={makeSlug} outputLabel="Generated slug" />;
}

export function QrCodeGenerator() {
  const [input, setInput] = useState("https://madabase.com/en/tools");
  const svg = useMemo(() => buildQrSvg(input), [input]);

  return (
    <ToolPanel>
      <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
        <div className="space-y-4">
          <ToolInput label="Text or URL" value={input} onChange={setInput} />
          <div className="flex flex-wrap gap-2">
            <CopyButton value={svg} label="Copy SVG" />
            <ToolButton onClick={() => fireAndForgetToolExecution("qr-code-generator")}>Generate QR</ToolButton>
          </div>
        </div>
        <div className="rounded-md border border-[var(--border)] bg-white p-4">
          <div dangerouslySetInnerHTML={{ __html: svg }} />
        </div>
      </div>
    </ToolPanel>
  );
}

export function HtmlEncoder() {
  return <GenericTextTransformTool label="HTML input" sample={'<div class="card">Madabase</div>'} tool="html-encoder" transform={(value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;")} outputLabel="Encoded HTML" />;
}

export function CssFormatter() {
  return <GenericTextTransformTool label="CSS input" sample={"body{margin:0;color:#111827}.card{padding:16px;border-radius:8px}"} tool="css-formatter" transform={(value) => value.replaceAll("}", "}\n").replaceAll(";", ";\n").replaceAll("{", " {\n").trim()} outputLabel="Formatted CSS" />;
}

export function JsFormatter() {
  return <GenericTextTransformTool label="JavaScript input" sample={"const tools=['json','jwt'];tools.forEach(tool=>console.log(tool));"} tool="js-formatter" transform={(value) => value.replaceAll(";", ";\n").replaceAll("{", "{\n").replaceAll("}", "\n}")} outputLabel="Formatted JavaScript" />;
}

export function UrlParser() {
  return <GenericTextTransformTool label="URL input" sample="https://madabase.com/en/tools/json-formatter?ref=seo#faq" tool="url-parser" transform={parseUrl} outputLabel="Parsed URL" />;
}

const genericToolConfigs: Record<string, { label: string; sample: string; outputLabel: string; transform: (value: string) => string }> = {
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
    sample: "old title\nold summary\n---\nnew title\nold summary",
    outputLabel: "Line comparison",
    transform: (value) => {
      const [left = "", right = ""] = value.split("\n---\n");
      const rightLines = new Set(right.split("\n"));
      return left.split("\n").map((line) => `${rightLines.has(line) ? " " : "-"} ${line}`).concat(
        right.split("\n").filter((line) => !left.split("\n").includes(line)).map((line) => `+ ${line}`),
      ).join("\n");
    },
  },
  "email-extractor": {
    label: "Text",
    sample: "Contact hello@madabase.com or team@example.dev for access.",
    outputLabel: "Emails",
    transform: (value) => [...value.matchAll(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi)].map((match) => match[0]).join("\n") || "No emails found.",
  },
  "url-extractor": {
    label: "Text",
    sample: "Visit https://madabase.com and https://example.com/docs.",
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
    transform: (value) => {
      const [headerLine = "", ...rows] = normalizeLines(value).split("\n");
      const headers = headerLine.split(",").map((item) => item.trim());
      return JSON.stringify(rows.map((row) => Object.fromEntries(row.split(",").map((cell, index) => [headers[index] ?? `field${index + 1}`, cell.trim()]))), null, 2);
    },
  },
  "json-to-csv": {
    label: "JSON array",
    sample: '[{"name":"Ada","role":"Engineer"},{"name":"Lin","role":"Designer"}]',
    outputLabel: "CSV",
    transform: (value) => {
      const rows = JSON.parse(value) as Array<Record<string, unknown>>;
      const headers = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));
      return [headers.join(","), ...rows.map((row) => headers.map((header) => String(row[header] ?? "")).join(","))].join("\n");
    },
  },
  "json-to-yaml": {
    label: "JSON",
    sample: '{"name":"Madabase","tools":60}',
    outputLabel: "YAML-like output",
    transform: (value) => Object.entries(JSON.parse(value) as Record<string, unknown>).map(([key, item]) => `${key}: ${String(item)}`).join("\n"),
  },
  "yaml-to-json": {
    label: "Simple YAML",
    sample: "name: Madabase\ntools: 60",
    outputLabel: "JSON",
    transform: (value) => JSON.stringify(Object.fromEntries(normalizeLines(value).split("\n").map((line) => {
      const [key = "", ...rest] = line.split(":");
      return [key.trim(), rest.join(":").trim()];
    })), null, 2),
  },
  "env-to-json": {
    label: ".env content",
    sample: "APP_NAME=Madabase\nFEATURE_TESTS=true",
    outputLabel: "JSON",
    transform: (value) => JSON.stringify(Object.fromEntries(normalizeLines(value).split("\n").map((line) => {
      const [key = "", ...rest] = line.split("=");
      return [key.trim(), rest.join("=").trim()];
    })), null, 2),
  },
  "json-to-env": {
    label: "JSON",
    sample: '{"APP_NAME":"Madabase","FEATURE_TESTS":"true"}',
    outputLabel: ".env",
    transform: (value) => Object.entries(JSON.parse(value) as Record<string, unknown>).map(([key, item]) => `${key}=${String(item)}`).join("\n"),
  },
  "toml-to-json": {
    label: "Simple TOML",
    sample: 'name = "Madabase"\ntools = 60',
    outputLabel: "JSON",
    transform: (value) => JSON.stringify(Object.fromEntries(normalizeLines(value).split("\n").map((line) => {
      const [key = "", ...rest] = line.split("=");
      return [key.trim(), rest.join("=").trim().replace(/^"|"$/g, "")];
    })), null, 2),
  },
  "query-string-parser": {
    label: "Query string",
    sample: "utm_source=seo&tool=json&lang=en",
    outputLabel: "Parsed query",
    transform: (value) => JSON.stringify(Object.fromEntries(new URLSearchParams(value.replace(/^\?/, ""))), null, 2),
  },
  "query-string-builder": {
    label: "JSON object",
    sample: '{"utm_source":"seo","tool":"json","lang":"en"}',
    outputLabel: "Query string",
    transform: (value) => new URLSearchParams(JSON.parse(value) as Record<string, string>).toString(),
  },
  "http-header-parser": {
    label: "HTTP headers",
    sample: "content-type: application/json\ncache-control: no-cache",
    outputLabel: "JSON headers",
    transform: (value) => JSON.stringify(Object.fromEntries(normalizeLines(value).split("\n").map((line) => {
      const [key = "", ...rest] = line.split(":");
      return [key.trim().toLowerCase(), rest.join(":").trim()];
    })), null, 2),
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
    transform: (value) => value.split("").map((char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`).join(""),
  },
  "unicode-unescape": {
    label: "Unicode escaped text",
    sample: "\\u004d\\u0061\\u0064\\u0061\\u0062\\u0061\\u0073\\u0065",
    outputLabel: "Text",
    transform: (value) => value.replace(/\\u([\dA-F]{4})/gi, (_, code: string) => String.fromCharCode(Number.parseInt(code, 16))),
  },
  "hex-to-text": {
    label: "Hex",
    sample: "4d61646162617365",
    outputLabel: "Text",
    transform: (value) => value.replace(/\s+/g, "").match(/.{1,2}/g)?.map((item) => String.fromCharCode(Number.parseInt(item, 16))).join("") ?? "",
  },
  "text-to-hex": {
    label: "Text",
    sample: "Madabase",
    outputLabel: "Hex",
    transform: (value) => value.split("").map((char) => char.charCodeAt(0).toString(16).padStart(2, "0")).join(""),
  },
  "binary-to-text": {
    label: "Binary",
    sample: "01001101 01100001 01100100 01100001",
    outputLabel: "Text",
    transform: (value) => value.trim().split(/\s+/).map((item) => String.fromCharCode(Number.parseInt(item, 2))).join(""),
  },
  "text-to-binary": {
    label: "Text",
    sample: "Mada",
    outputLabel: "Binary",
    transform: (value) => value.split("").map((char) => char.charCodeAt(0).toString(2).padStart(8, "0")).join(" "),
  },
  "html-stripper": {
    label: "HTML",
    sample: "<article><h1>Madabase</h1><p>Useful tools.</p></article>",
    outputLabel: "Plain text",
    transform: (value) => value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim(),
  },
  "markdown-to-text": {
    label: "Markdown",
    sample: "# Madabase\n\nBuild **useful** tools with [links](https://madabase.com).",
    outputLabel: "Plain text",
    transform: (value) => value.replace(/[#*_`>-]/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\s+/g, " ").trim(),
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
    transform: (value) => normalizeLines(value).split("\n").sort((a, b) => simpleHash(b).localeCompare(simpleHash(a))).join("\n"),
  },
};

const fallbackGenericTool = {
  label: "Input",
  sample: "Paste text here",
  outputLabel: "Output",
  transform: (value: string) => value,
};

export function GenericTextTool({ toolSlug = "generic-text-tool" }: { toolSlug?: string }) {
  const config = genericToolConfigs[toolSlug] ?? fallbackGenericTool;
  return <GenericTextTransformTool label={config.label} sample={config.sample} tool={toolSlug} transform={config.transform} outputLabel={config.outputLabel} />;
}

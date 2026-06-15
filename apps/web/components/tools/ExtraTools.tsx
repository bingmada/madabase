"use client";

import QRCode from "qrcode";
import { useEffect, useMemo, useState } from "react";
import { fireAndForgetToolExecution } from "@/lib/tool-usage-client";
import { CopyButton, ResetButton, StatusMessage, ToolButton, ToolInput, ToolPanel, ToolTextarea } from "./ToolPrimitives";

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

function formatYaml(input: string) {
  const lines = input.replace(/\t/g, "  ").split("\n");
  const trimmed = lines
    .map((line) => line.replace(/\s+$/g, ""))
    .join("\n")
    .trim();
  if (!trimmed) return "";

  const stack: number[] = [];
  for (const line of trimmed.split("\n")) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const indent = line.match(/^\s*/)?.[0].length ?? 0;
    if (indent % 2 !== 0) {
      throw new Error("YAML indentation should use an even number of spaces.");
    }
    while (stack.length > 0 && indent < stack[stack.length - 1]) stack.pop();
    if (stack.length > 0 && indent > stack[stack.length - 1] + 2) {
      throw new Error("YAML indentation jumps too far. Use two spaces per level.");
    }
    if (!stack.includes(indent)) stack.push(indent);
  }

  return trimmed;
}

const sqlLineKeywords = [
  "SELECT",
  "FROM",
  "WHERE",
  "GROUP BY",
  "ORDER BY",
  "HAVING",
  "LIMIT",
  "OFFSET",
  "INNER JOIN",
  "LEFT JOIN",
  "RIGHT JOIN",
  "FULL JOIN",
  "JOIN",
  "VALUES",
  "SET",
  "RETURNING",
];

function formatSql(input: string) {
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let output = "";

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    if (char === "'" && !inDoubleQuote) inSingleQuote = !inSingleQuote;
    if (char === '"' && !inSingleQuote) inDoubleQuote = !inDoubleQuote;
    output += inSingleQuote || inDoubleQuote ? char : char.toUpperCase();
  }

  for (const keyword of sqlLineKeywords) {
    output = output.replace(new RegExp(`\\s*\\b${keyword.replace(" ", "\\s+")}\\b\\s*`, "g"), `\n${keyword} `);
  }

  return output
    .replace(/[ \t]*,[ \t]*/g, ",\n  ")
    .replace(/\(\s*/g, "(\n  ")
    .replace(/\s*\)/g, "\n)")
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .filter(Boolean)
    .map((line) => (sqlLineKeywords.some((keyword) => line.startsWith(keyword)) || line.startsWith(")") ? line : `  ${line}`))
    .join("\n")
    .replace(/^SELECT\s+/g, "SELECT\n  ")
    .trim();
}

function formatBraceCode(input: string) {
  const normalized = input
    .replace(/\s*([{};])\s*/g, "$1\n")
    .replace(/\s*,\s*/g, ", ")
    .replace(/\n+/g, "\n");
  let indent = 0;

  return normalized
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      if (line.startsWith("}")) indent = Math.max(indent - 1, 0);
      const formatted = `${"  ".repeat(indent)}${line}`;
      if (line.endsWith("{")) indent += 1;
      return formatted;
    })
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

function GenericTextTransformTool({
  label,
  sample,
  transform,
  tool,
  outputLabel = "Output",
}: {
  label: string;
  sample: string;
  transform: (value: string) => string | Promise<string>;
  tool: string;
  outputLabel?: string;
}) {
  const [input, setInput] = useState(sample);
  const [output, setOutput] = useState("");
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState<"success" | "error">("success");

  async function run() {
    try {
      const nextOutput = await transform(input);
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
          <div className="flex flex-wrap gap-2">
            <CopyButton value={output} />
            <ToolButton variant="secondary" onClick={() => downloadTextFile(`${tool}-output.txt`, output)}>Download</ToolButton>
          </div>
        </div>
      </div>
    </ToolPanel>
  );
}

export function JsonDiff() {
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
        : "No differences found.";
      setRows(nextRows);
      setOutput(nextOutput);
      setMessage(nextRows.length ? `${nextRows.length} changed path${nextRows.length === 1 ? "" : "s"} found.` : "No differences found.");
      setTone("success");
      fireAndForgetToolExecution("json-diff");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Invalid JSON input.");
      setTone("error");
    }
  }

  return (
    <ToolPanel>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <ToolTextarea label="Left JSON" value={left} onChange={setLeft} rows={10} />
          <ToolTextarea label="Right JSON" value={right} onChange={setRight} rows={10} />
          <div className="flex flex-wrap gap-2">
            <ToolButton onClick={run}>Compare JSON</ToolButton>
            <ResetButton onClick={() => { setLeft(sampleLeft); setRight(sampleRight); setRows([]); setOutput(""); setMessage(""); }} />
          </div>
          <StatusMessage message={message} tone={tone} />
        </div>
        <div className="space-y-4">
          <div className="min-h-[280px] rounded-md border border-[var(--border)] bg-white p-3">
            <p className="code-font text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-soft)]">Path diff</p>
            <div className="mt-3 space-y-2">
              {rows.length > 0 ? rows.map((row) => (
                <div key={`${row.path}-${row.status}`} className="rounded-md border border-[var(--border)] bg-[var(--surface-muted)] p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <code className="text-xs font-semibold text-[var(--text)]">{row.path}</code>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold uppercase ${row.status === "added" ? "bg-emerald-100 text-emerald-700" : row.status === "removed" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"}`}>{row.status}</span>
                  </div>
                  {row.before ? <pre className="mt-2 overflow-auto rounded bg-rose-50 px-2 py-1 text-xs text-rose-800">- {row.before}</pre> : null}
                  {row.after ? <pre className="mt-2 overflow-auto rounded bg-emerald-50 px-2 py-1 text-xs text-emerald-800">+ {row.after}</pre> : null}
                </div>
              )) : <p className="text-sm text-[var(--text-muted)]">Run a comparison to inspect changed JSON paths.</p>}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <CopyButton value={output} />
            <ToolButton variant="secondary" onClick={() => downloadTextFile("json-diff.txt", output)}>Download</ToolButton>
          </div>
        </div>
      </div>
    </ToolPanel>
  );
}

export function JsonEscape() {
  return <GenericTextTransformTool label="JSON string" sample={'{"message":"hello \"world\""}'} tool="json-escape" transform={(value) => JSON.stringify(value)} outputLabel="Escaped output" />;
}

export function YamlFormatter() {
  return <GenericTextTransformTool label="YAML input" sample={"name: Madabase\ntools:\n  - JSON Formatter\n  - JWT Decoder"} tool="yaml-formatter" transform={formatYaml} outputLabel="Formatted YAML" />;
}

export function XmlFormatter() {
  return <GenericTextTransformTool label="XML input" sample={'<root><tool>Madabase</tool><type>formatter</type></root>'} tool="xml-formatter" transform={formatXml} outputLabel="Formatted XML" />;
}

export function SqlFormatter() {
  return <GenericTextTransformTool label="SQL input" sample={"select id,name from users where status='active' order by created_at desc"} tool="sql-formatter" transform={formatSql} outputLabel="Formatted SQL" />;
}

export function RegexTester() {
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
      const regex = new RegExp(pattern, flags);
      const matchRegex = regex.global ? regex : new RegExp(regex.source, `${regex.flags}g`);
      const matches = [...input.matchAll(matchRegex)];
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
      setOutput(matches.length ? matches.map((item, index) => {
        const groups = item.slice(1).map((group, groupIndex) => `  group ${groupIndex + 1}: ${group ?? ""}`).join("\n");
        return `match ${index + 1}: ${item[0]}\nindex: ${item.index ?? 0}${groups ? `\n${groups}` : ""}`;
      }).join("\n\n") + `\n\nReplacement preview:\n${input.replace(matchRegex, replacement)}` : "No matches.");
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
        <ToolInput label="Replacement" value={replacement} onChange={setReplacement} />
        <ToolTextarea label="Test text" value={input} onChange={setInput} rows={8} />
        <div className="flex flex-wrap gap-2">
          <ToolButton onClick={run}>Test regex</ToolButton>
          <CopyButton value={output} />
          <ToolButton variant="secondary" onClick={() => downloadTextFile("regex-result.txt", output)}>Download</ToolButton>
        </div>
        <StatusMessage message={message} tone={tone} />
        <div className="rounded-md border border-[var(--border)] bg-white p-3">
          <p className="code-font text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-soft)]">Highlighted matches</p>
          <div className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[var(--text)]" dangerouslySetInnerHTML={{ __html: highlighted || escapeHtml(input) }} />
        </div>
        <ToolTextarea label="Matches" value={output} readOnly rows={8} />
      </div>
    </ToolPanel>
  );
}

export function CronGenerator() {
  const [minute, setMinute] = useState("0");
  const [hour, setHour] = useState("9");
  const [dayOfWeek, setDayOfWeek] = useState("*");
  const runs = useMemo(() => {
    const minuteValue = Number(minute);
    const hourValue = Number(hour);
    if (!Number.isInteger(minuteValue) || !Number.isInteger(hourValue) || minuteValue < 0 || minuteValue > 59 || hourValue < 0 || hourValue > 23) {
      return ["Use numeric hour 0-23 and minute 0-59 to preview runs."];
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
    return items.length ? items : ["No run in the next 14 days."];
  }, [dayOfWeek, hour, minute]);
  const cronExpression = `${minute || "*"} ${hour || "*"} * * ${dayOfWeek || "*"}`;

  return (
    <ToolPanel>
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <ToolInput label="Minute" value={minute} onChange={setMinute} />
          <ToolInput label="Hour" value={hour} onChange={setHour} />
          <ToolInput label="Day of week" value={dayOfWeek} onChange={setDayOfWeek} />
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            ["Daily 9 AM", "0", "9", "*"],
            ["Hourly", "0", "*", "*"],
            ["Monday 9 AM", "0", "9", "1"],
            ["Friday 5 PM", "0", "17", "5"],
          ].map(([label, nextMinute, nextHour, nextDay]) => (
            <ToolButton key={label} variant="secondary" onClick={() => { setMinute(nextMinute); setHour(nextHour); setDayOfWeek(nextDay); }}>{label}</ToolButton>
          ))}
        </div>
        <ToolTextarea label="Cron expression" value={cronExpression} readOnly rows={3} />
        <ToolTextarea label="Next runs" value={runs.join("\n")} readOnly rows={5} />
        <div className="flex flex-wrap gap-2">
          <CopyButton value={cronExpression} />
          <ToolButton onClick={() => fireAndForgetToolExecution("cron-generator")}>Generate</ToolButton>
        </div>
      </div>
    </ToolPanel>
  );
}

export function HashGenerator() {
  return <GenericTextTransformTool label="Plain text" sample="Madabase" tool="hash-generator" transform={async (value) => {
    const [sha1, sha256, sha384, sha512] = await Promise.all([
      digestText(value, "SHA-1"),
      digestText(value, "SHA-256"),
      digestText(value, "SHA-384"),
      digestText(value, "SHA-512"),
    ]);
    return [`SHA-1: ${sha1}`, `SHA-256: ${sha256}`, `SHA-384: ${sha384}`, `SHA-512: ${sha512}`].join("\n\n");
  }} outputLabel="Hash output" />;
}

export function ColorConverter() {
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
    throw new Error("Use HEX like #0f766e or RGB like rgb(15, 118, 110).");
  }

  function convert() {
    try {
      const [red, green, blue] = parseColor(input);
      if ([red, green, blue].some((item) => item < 0 || item > 255)) throw new Error("RGB values must be between 0 and 255.");
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
      setMessage("Color converted.");
      setTone("success");
      fireAndForgetToolExecution("color-converter");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to convert color.");
      setTone("error");
    }
  }

  return (
    <ToolPanel>
      <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
        <div className="space-y-4">
          <ToolInput label="Color" value={input} onChange={setInput} />
          <div className="flex flex-wrap gap-2">
            <ToolButton onClick={convert}>Convert</ToolButton>
            <CopyButton value={output} />
          </div>
          <StatusMessage message={message} tone={tone} />
          <ToolTextarea label="Converted values" value={output} readOnly rows={6} />
        </div>
        <div className="rounded-md border border-[var(--border)] bg-white p-4">
          <div className="aspect-square rounded-md border border-[var(--border)]" style={{ background: preview }} />
          <p className="mt-3 text-sm font-semibold text-[var(--text)]">{preview}</p>
        </div>
      </div>
    </ToolPanel>
  );
}

export function PasswordGenerator() {
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
      setMessage("Choose at least one character set.");
      return;
    }
    const bytes = new Uint32Array(size);
    crypto.getRandomValues(bytes);
    setOutput(Array.from(bytes, (item) => chars[item % chars.length]).join(""));
    setMessage(`Generated a ${size}-character password with ${pools.length} character set${pools.length === 1 ? "" : "s"}.`);
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
        <ToolInput label="Password length" value={length} onChange={setLength} type="number" />
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Uppercase", checked: includeUppercase, setter: setIncludeUppercase },
            { label: "Lowercase", checked: includeLowercase, setter: setIncludeLowercase },
            { label: "Numbers", checked: includeNumbers, setter: setIncludeNumbers },
            { label: "Symbols", checked: includeSymbols, setter: setIncludeSymbols },
          ].map((option) => (
            <label key={option.label} className="flex items-center gap-2 rounded-md border border-[var(--border)] bg-white px-3 py-2 text-sm font-semibold text-[var(--text)]">
              <input type="checkbox" checked={option.checked} onChange={(event) => option.setter(event.target.checked)} />
              {option.label}
            </label>
          ))}
        </div>
        <ToolTextarea label="Generated password" value={output} readOnly rows={4} />
        <div className="flex flex-wrap gap-2">
          <CopyButton value={output} />
          <ToolButton onClick={generate}>Generate</ToolButton>
        </div>
        <StatusMessage message={message} tone="success" />
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
  const [svg, setSvg] = useState("");
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
          errorCorrectionLevel: "M",
          margin: 2,
          width: 196,
          color: {
            dark: "#111827",
            light: "#ffffff",
          },
        });
        if (!cancelled) {
          setSvg(nextSvg);
          setMessage("Valid QR code generated.");
          setTone("success");
        }
      } catch (error) {
        if (!cancelled) {
          setSvg("");
          setMessage(error instanceof Error ? error.message : "Unable to generate QR code.");
          setTone("error");
        }
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [input]);

  return (
    <ToolPanel>
      <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
        <div className="space-y-4">
          <ToolInput label="Text or URL" value={input} onChange={setInput} />
          <div className="flex flex-wrap gap-2">
            <CopyButton value={svg} label="Copy SVG" />
            <ToolButton onClick={() => fireAndForgetToolExecution("qr-code-generator")}>Generate QR</ToolButton>
          </div>
          <StatusMessage message={message} tone={tone} />
        </div>
        <div className="rounded-md border border-[var(--border)] bg-white p-4">
          {svg ? <div dangerouslySetInnerHTML={{ __html: svg }} /> : <div className="grid aspect-square place-items-center text-sm text-[var(--text-soft)]">No QR code</div>}
        </div>
      </div>
    </ToolPanel>
  );
}

export function HtmlEncoder() {
  return <GenericTextTransformTool label="HTML input" sample={'<div class="card">Madabase</div>'} tool="html-encoder" transform={(value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;")} outputLabel="Encoded HTML" />;
}

export function CssFormatter() {
  return <GenericTextTransformTool label="CSS input" sample={"body{margin:0;color:#111827}.card{padding:16px;border-radius:8px}"} tool="css-formatter" transform={formatBraceCode} outputLabel="Formatted CSS" />;
}

export function JsFormatter() {
  return <GenericTextTransformTool label="JavaScript input" sample={"const tools=['json','jwt'];tools.forEach(tool=>console.log(tool));"} tool="js-formatter" transform={formatBraceCode} outputLabel="Formatted JavaScript" />;
}

export function UrlParser() {
  return <GenericTextTransformTool label="URL input" sample="https://madabase.com/en/tools/json-formatter?ref=seo#faq" tool="url-parser" transform={parseUrl} outputLabel="Parsed URL" />;
}

const genericToolConfigs: Record<string, { label: string; sample: string; outputLabel: string; transform: (value: string) => string | Promise<string> }> = {
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
    transform: (value) => normalizeLines(value).split("\n").sort(() => Math.random() - 0.5).join("\n"),
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

"use client";
import { useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { toolCopy } from "@/lib/tool-ui-copy";
import { fireAndForgetToolExecution } from "@/lib/tool-usage-client";
import { CopyButton, ResetButton, StatusMessage, ToolButton, ToolPanel, ToolTextarea } from "./ToolPrimitives";

const sample = '{\n  "id": 1,\n  "name": "Madabase",\n  "tags": ["tools", "ai"],\n  "owner": {\n    "email": "hello@madabase.com"\n  }\n}';

function toPascalCase(value: string) {
  return value
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("") || "Generated";
}

function propertyName(key: string) {
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : JSON.stringify(key);
}

function unionTypes(types: string[]) {
  const unique = Array.from(new Set(types));
  return unique.length === 1 ? unique[0] : unique.join(" | ");
}

function mergeObjectArray(items: Array<Record<string, unknown>>) {
  const keys = Array.from(new Set(items.flatMap((item) => Object.keys(item))));
  const merged: Record<string, unknown[]> = {};
  const optional = new Set<string>();
  for (const key of keys) {
    const values = items.map((item) => item[key]);
    merged[key] = values.filter((item) => item !== undefined);
    if (values.some((item) => item === undefined)) optional.add(key);
  }
  return { merged, optional };
}

function inferType(value: unknown, name: string, declarations: Map<string, string>): string {
  if (value === null) return "null";
  if (Array.isArray(value)) {
    if (value.length === 0) return "unknown[]";
    const objectItems = value.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object" && !Array.isArray(item));
    if (objectItems.length === value.length) {
      const interfaceName = `${toPascalCase(name)}Item`;
      buildInterfaceFromArray(objectItems, interfaceName, declarations);
      return `${interfaceName}[]`;
    }
    const types = value.map((item, index) => inferType(item, `${name}${index + 1}`, declarations));
    const itemType = unionTypes(types);
    return `${itemType.includes(" | ") ? `(${itemType})` : itemType}[]`;
  }
  if (typeof value === "object") {
    const interfaceName = toPascalCase(name);
    buildInterface(value as Record<string, unknown>, interfaceName, declarations);
    return interfaceName;
  }
  if (typeof value === "string") return "string";
  if (typeof value === "number") return "number";
  if (typeof value === "boolean") return "boolean";
  return "unknown";
}

function buildInterface(value: Record<string, unknown>, name: string, declarations: Map<string, string>) {
  if (declarations.has(name)) return name;
  const lines = Object.entries(value).map(([key, item]) => `  ${propertyName(key)}: ${inferType(item, `${name}${toPascalCase(key)}`, declarations)};`);
  declarations.set(name, `export interface ${name} {\n${lines.join("\n")}\n}`);
  return name;
}

function buildInterfaceFromArray(items: Array<Record<string, unknown>>, name: string, declarations: Map<string, string>) {
  if (declarations.has(name)) return name;
  const { merged, optional } = mergeObjectArray(items);
  const lines = Object.entries(merged).map(([key, values]) => {
    const type = unionTypes(values.map((item, index) => inferType(item, `${name}${toPascalCase(key)}${index + 1}`, declarations)));
    return `  ${propertyName(key)}${optional.has(key) ? "?" : ""}: ${type};`;
  });
  declarations.set(name, `export interface ${name} {\n${lines.join("\n")}\n}`);
  return name;
}

function generateTypes(input: string, rootName: string) {
  const parsed = JSON.parse(input) as unknown;
  const declarations = new Map<string, string>();
  const root = toPascalCase(rootName);
  if (Array.isArray(parsed)) {
    if (parsed.length === 0) {
      return `export type ${root} = unknown[];`;
    }
    const objectItems = parsed.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object" && !Array.isArray(item));
    if (objectItems.length === parsed.length) {
      const itemName = `${root}Item`;
      buildInterfaceFromArray(objectItems, itemName, declarations);
      return [`export type ${root} = ${itemName}[];`, ...Array.from(declarations.values()).reverse()].join("\n\n");
    }
    return `export type ${root} = ${inferType(parsed, root, declarations)};`;
  } else if (typeof parsed === "object" && parsed !== null) {
    buildInterface(parsed as Record<string, unknown>, root, declarations);
  } else {
    return `export type ${root} = ${inferType(parsed, root, declarations)};`;
  }
  return Array.from(declarations.values()).reverse().join("\n\n");
}

export function JsonToTypescript({ locale = "en" }: { locale?: Locale }) {
  const copy = toolCopy(locale);
  const [input, setInput] = useState(sample);
  const [rootName, setRootName] = useState("Root");
  const [submitted, setSubmitted] = useState(false);

  const result = useMemo(() => {
    try {
      return { output: generateTypes(input, rootName), error: "" };
    } catch (error) {
      return { output: "", error: error instanceof Error ? error.message : locale === "zh" ? "JSON 无效。" : "Invalid JSON." };
    }
  }, [input, locale, rootName]);

  return (
    <ToolPanel>
      <div className="space-y-4">
        <label className="block">
          <span className="code-font text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-soft)]">{locale === "zh" ? "根接口名称" : "Root interface name"}</span>
          <input
            value={rootName}
            onChange={(event) => setRootName(event.target.value)}
            className="code-font mt-2 h-10 w-full rounded-md border border-[var(--border)] bg-white px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[rgba(15,118,110,0.13)]"
          />
        </label>
        <ToolTextarea label={locale === "zh" ? "JSON 示例" : "JSON sample"} value={input} onChange={(value) => { setInput(value); setSubmitted(false); }} rows={10} />
        <div className="flex flex-wrap gap-2">
          <ToolButton onClick={() => { setSubmitted(true); fireAndForgetToolExecution("json-to-typescript"); }}>{locale === "zh" ? "生成接口" : "Generate Interface"}</ToolButton>
          <CopyButton value={result.output} label={copy.copy} copiedLabel={copy.copied} />
          <ResetButton label={copy.reset} onClick={() => { setInput(sample); setRootName("Root"); setSubmitted(false); }} />
        </div>
        <StatusMessage message={submitted && result.error ? result.error : ""} tone="error" />
        <ToolTextarea label={locale === "zh" ? "TypeScript 输出" : "TypeScript output"} value={result.output} readOnly rows={12} />
      </div>
    </ToolPanel>
  );
}

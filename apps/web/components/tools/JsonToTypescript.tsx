"use client";
import { useMemo, useState } from "react";
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

function inferType(value: unknown, name: string, declarations: string[]): string {
  if (value === null) return "null";
  if (Array.isArray(value)) {
    if (value.length === 0) return "unknown[]";
    const types = Array.from(new Set(value.map((item, index) => inferType(item, `${name}${index + 1}`, declarations))));
    return `${types.length === 1 ? types[0] : `(${types.join(" | ")})`}[]`;
  }
  if (typeof value === "object") {
    const interfaceName = toPascalCase(name);
    declarations.push(buildInterface(value as Record<string, unknown>, interfaceName, declarations));
    return interfaceName;
  }
  if (typeof value === "string") return "string";
  if (typeof value === "number") return "number";
  if (typeof value === "boolean") return "boolean";
  return "unknown";
}

function buildInterface(value: Record<string, unknown>, name: string, declarations: string[]) {
  const lines = Object.entries(value).map(([key, item]) => `  ${propertyName(key)}: ${inferType(item, `${name}${toPascalCase(key)}`, declarations)};`);
  return `export interface ${name} {\n${lines.join("\n")}\n}`;
}

function generateTypes(input: string, rootName: string) {
  const parsed = JSON.parse(input) as unknown;
  const declarations: string[] = [];
  if (Array.isArray(parsed)) {
    const item = parsed[0] ?? {};
    if (typeof item !== "object" || item === null || Array.isArray(item)) {
      return `export type ${toPascalCase(rootName)} = ${inferType(item, rootName, declarations)};`;
    }
    declarations.push(buildInterface(item as Record<string, unknown>, toPascalCase(rootName), declarations));
  } else if (typeof parsed === "object" && parsed !== null) {
    declarations.push(buildInterface(parsed as Record<string, unknown>, toPascalCase(rootName), declarations));
  } else {
    return `export type ${toPascalCase(rootName)} = ${inferType(parsed, rootName, declarations)};`;
  }
  return declarations.reverse().join("\n\n");
}

export function JsonToTypescript() {
  const [input, setInput] = useState(sample);
  const [rootName, setRootName] = useState("Root");
  const [submitted, setSubmitted] = useState(false);

  const result = useMemo(() => {
    try {
      return { output: generateTypes(input, rootName), error: "" };
    } catch (error) {
      return { output: "", error: error instanceof Error ? error.message : "Invalid JSON." };
    }
  }, [input, rootName]);

  return (
    <ToolPanel>
      <div className="space-y-4">
        <label className="block">
          <span className="code-font text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-soft)]">Root interface name</span>
          <input
            value={rootName}
            onChange={(event) => setRootName(event.target.value)}
            className="code-font mt-2 h-10 w-full rounded-md border border-[var(--border)] bg-white px-3 text-sm text-[var(--text)] outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[rgba(15,118,110,0.13)]"
          />
        </label>
        <ToolTextarea label="JSON sample" value={input} onChange={(value) => { setInput(value); setSubmitted(false); }} rows={10} />
        <div className="flex flex-wrap gap-2">
          <ToolButton onClick={() => { setSubmitted(true); fireAndForgetToolExecution("json-to-typescript"); }}>Generate Interface</ToolButton>
          <CopyButton value={result.output} />
          <ResetButton onClick={() => { setInput(sample); setRootName("Root"); setSubmitted(false); }} />
        </div>
        <StatusMessage message={submitted && result.error ? result.error : ""} tone="error" />
        <ToolTextarea label="TypeScript output" value={result.output} readOnly rows={12} />
      </div>
    </ToolPanel>
  );
}

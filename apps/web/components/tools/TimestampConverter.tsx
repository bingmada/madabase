"use client";
import { useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { fireAndForgetToolExecution } from "@/lib/tool-usage-client";
import { CopyButton, ResetButton, ToolButton, ToolInput, ToolPanel } from "./ToolPrimitives";

function normalizeTimestamp(value: string) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;
  return numeric < 10_000_000_000 ? numeric * 1000 : numeric;
}

function toDateTimeLocal(value: Date) {
  const offset = value.getTimezoneOffset() * 60_000;
  return new Date(value.getTime() - offset).toISOString().slice(0, 16);
}

export function TimestampConverter({ locale = "en" }: { locale?: Locale }) {
  const [timestamp, setTimestamp] = useState(() => Math.floor(Date.now() / 1000).toString());
  const [dateInput, setDateInput] = useState(() => toDateTimeLocal(new Date()));

  const result = useMemo(() => {
    const normalized = normalizeTimestamp(timestamp);
    if (normalized === null) return null;
    const date = new Date(normalized);
    if (Number.isNaN(date.getTime())) return null;
    return {
      local: date.toLocaleString(),
      utc: date.toUTCString(),
      seconds: Math.floor(date.getTime() / 1000).toString(),
      milliseconds: date.getTime().toString(),
      iso: date.toISOString(),
    };
  }, [timestamp]);
  const summary = result ? Object.entries(result).map(([key, value]) => `${key}: ${value}`).join("\n") : "";

  function applyCurrentTime(unit: "seconds" | "milliseconds") {
    const now = new Date();
    setDateInput(toDateTimeLocal(now));
    setTimestamp(unit === "seconds" ? Math.floor(now.getTime() / 1000).toString() : now.getTime().toString());
    fireAndForgetToolExecution("timestamp-converter");
  }

  function convertDateToTimestamp() {
    const date = new Date(dateInput);
    if (Number.isNaN(date.getTime())) return;
    setTimestamp(Math.floor(date.getTime() / 1000).toString());
    fireAndForgetToolExecution("timestamp-converter");
  }

  return (
    <ToolPanel>
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <ToolInput label={locale === "zh" ? "Unix 时间戳" : "Unix timestamp"} value={timestamp} onChange={setTimestamp} />
          <ToolInput label={locale === "zh" ? "日期时间" : "Date and time"} value={dateInput} onChange={setDateInput} type="datetime-local" />
        </div>
        <div className="flex flex-wrap gap-2">
          <ToolButton onClick={() => applyCurrentTime("seconds")}>{locale === "zh" ? "当前秒级" : "Current seconds"}</ToolButton>
          <ToolButton onClick={() => applyCurrentTime("milliseconds")} variant="secondary">{locale === "zh" ? "当前毫秒级" : "Current milliseconds"}</ToolButton>
          <ToolButton onClick={convertDateToTimestamp} variant="secondary">{locale === "zh" ? "日期转时间戳" : "Date to timestamp"}</ToolButton>
          <CopyButton value={summary} />
          <ResetButton onClick={() => { const now = new Date(); setTimestamp(Math.floor(now.getTime() / 1000).toString()); setDateInput(toDateTimeLocal(now)); }} />
        </div>
        {result ? (
          <dl className="grid gap-3 rounded-md border border-[var(--border)] bg-white p-4 text-sm sm:grid-cols-2">
            {Object.entries(result).map(([key, value]) => (
              <div key={key}>
                <dt className="font-semibold capitalize text-[var(--text-soft)]">{locale === "zh" ? ({ local: "本地时间", utc: "UTC 时间", seconds: "秒级时间戳", milliseconds: "毫秒时间戳", iso: "ISO 时间" }[key] ?? key) : key}</dt>
                <dd className="code-font mt-1 break-all text-[var(--text)]">{value}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{locale === "zh" ? "请输入有效的秒级或毫秒级时间戳。" : "Enter a valid seconds or milliseconds timestamp."}</div>
        )}
      </div>
    </ToolPanel>
  );
}

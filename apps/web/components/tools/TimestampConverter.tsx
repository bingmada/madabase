"use client";

import { useMemo, useState } from "react";
import { ToolButton, ToolPanel } from "./ToolPrimitives";

function normalizeTimestamp(value: string) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;
  return numeric < 10_000_000_000 ? numeric * 1000 : numeric;
}

export function TimestampConverter() {
  const [timestamp, setTimestamp] = useState(() => Math.floor(Date.now() / 1000).toString());

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

  return (
    <ToolPanel>
      <div className="space-y-4">
        <label className="block">
          <span className="code-font text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-soft)]">Unix timestamp</span>
          <input
            value={timestamp}
            onChange={(event) => setTimestamp(event.target.value)}
            className="code-font mt-2 h-11 w-full rounded-md border border-[var(--border)] bg-white px-3 text-sm outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[rgba(15,118,110,0.13)]"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <ToolButton onClick={() => setTimestamp(Math.floor(Date.now() / 1000).toString())}>Use current seconds</ToolButton>
          <ToolButton onClick={() => setTimestamp(Date.now().toString())} variant="secondary">Use current milliseconds</ToolButton>
        </div>
        {result ? (
          <dl className="grid gap-3 rounded-md border border-[var(--border)] bg-white p-4 text-sm sm:grid-cols-2">
            {Object.entries(result).map(([key, value]) => (
              <div key={key}>
                <dt className="font-semibold capitalize text-[var(--text-soft)]">{key}</dt>
                <dd className="code-font mt-1 break-all text-[var(--text)]">{value}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">Enter a valid seconds or milliseconds timestamp.</div>
        )}
      </div>
    </ToolPanel>
  );
}

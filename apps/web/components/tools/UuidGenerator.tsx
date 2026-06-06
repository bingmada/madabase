"use client";

import { useState } from "react";
import { CopyButton, ToolButton, ToolPanel } from "./ToolPrimitives";

function createUuid() {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (char) =>
    (Number(char) ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(char) / 4)))).toString(16),
  );
}

export function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState(() => Array.from({ length: 5 }, createUuid));

  function generate() {
    setUuids(Array.from({ length: count }, createUuid));
  }

  return (
    <ToolPanel>
      <div className="space-y-4">
        <label className="block">
          <span className="code-font text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-soft)]">How many UUIDs?</span>
          <input
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(event) => setCount(Math.min(50, Math.max(1, Number(event.target.value) || 1)))}
            className="code-font mt-2 h-10 w-32 rounded-md border border-[var(--border)] bg-white px-3 text-sm outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[rgba(15,118,110,0.13)]"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <ToolButton onClick={generate}>Generate UUIDs</ToolButton>
          <CopyButton value={uuids.join("\n")} label="Copy all" />
        </div>
        <div className="rounded-md border border-[var(--border)] bg-white">
          {uuids.map((uuid) => (
            <div key={uuid} className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-3 py-2 last:border-b-0">
              <code className="code-font break-all text-sm text-[var(--text)]">{uuid}</code>
              <CopyButton value={uuid} label="Copy" />
            </div>
          ))}
        </div>
      </div>
    </ToolPanel>
  );
}

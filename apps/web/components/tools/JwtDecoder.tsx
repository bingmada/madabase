"use client";

import { useMemo, useState } from "react";
import { CopyButton, ResetButton, StatusMessage, ToolPanel, ToolTextarea } from "./ToolPrimitives";

const sample = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik1hZGFiYXNlIiwiaWF0IjoxNTE2MjM5MDIyfQ.signature";

function decodePart(part: string) {
  const normalized = part.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
  const decoded = atob(padded);
  const bytes = Uint8Array.from(decoded, (char) => char.charCodeAt(0));
  return JSON.stringify(JSON.parse(new TextDecoder().decode(bytes)), null, 2);
}

export function JwtDecoder() {
  const [token, setToken] = useState(sample);

  const decoded = useMemo(() => {
    const parts = token.split(".");
    if (parts.length < 2) return { header: "", payload: "", error: "JWT must contain at least header and payload parts." };
    try {
      return { header: decodePart(parts[0]), payload: decodePart(parts[1]), error: "" };
    } catch (error) {
      return { header: "", payload: "", error: error instanceof Error ? error.message : "Unable to decode JWT." };
    }
  }, [token]);

  return (
    <ToolPanel>
      <div className="space-y-4">
        <ToolTextarea label="JWT token" value={token} onChange={setToken} rows={5} />
        <div className="flex flex-wrap gap-2">
          <CopyButton value={`${decoded.header}\n\n${decoded.payload}`} label="Copy decoded" />
          <ResetButton onClick={() => setToken(sample)} />
        </div>
        <StatusMessage message={decoded.error || "Header and payload decoded. Signature is not verified."} tone={decoded.error ? "error" : "success"} />
        <div className="grid gap-4 lg:grid-cols-2">
          <ToolTextarea label="Header" value={decoded.header} readOnly rows={10} />
          <ToolTextarea label="Payload" value={decoded.payload} readOnly rows={10} />
        </div>
      </div>
    </ToolPanel>
  );
}

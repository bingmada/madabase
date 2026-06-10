"use client";

import { useState } from "react";
import { fireAndForgetToolExecution } from "@/lib/tool-usage-client";
import { CopyButton, ResetButton, StatusMessage, ToolButton, ToolPanel, ToolTextarea } from "./ToolPrimitives";

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
  const [header, setHeader] = useState("");
  const [payload, setPayload] = useState("");
  const [message, setMessage] = useState("Paste a token and decode it.");
  const [tone, setTone] = useState<"neutral" | "success" | "error">("neutral");

  function decode() {
    const parts = token.split(".");
    if (parts.length < 2) {
      setHeader("");
      setPayload("");
      setMessage("JWT must contain at least header and payload parts.");
      setTone("error");
      return;
    }

    try {
      setHeader(decodePart(parts[0]));
      setPayload(decodePart(parts[1]));
      setMessage("Header and payload decoded. Signature is not verified.");
      setTone("success");
      fireAndForgetToolExecution("jwt-decoder");
    } catch (error) {
      setHeader("");
      setPayload("");
      setMessage(error instanceof Error ? error.message : "Unable to decode JWT.");
      setTone("error");
    }
  }

  return (
    <ToolPanel>
      <div className="space-y-4">
        <ToolTextarea label="JWT token" value={token} onChange={setToken} rows={5} />
        <div className="flex flex-wrap gap-2">
          <ToolButton onClick={decode}>Decode JWT</ToolButton>
          <CopyButton value={`${header}\n\n${payload}`.trim()} label="Copy decoded" />
          <ResetButton onClick={() => {
            setToken(sample);
            setHeader("");
            setPayload("");
            setMessage("Paste a token and decode it.");
            setTone("neutral");
          }} />
        </div>
        <StatusMessage message={message} tone={tone} />
        <div className="grid gap-4 lg:grid-cols-2">
          <ToolTextarea label="Header" value={header} readOnly rows={10} />
          <ToolTextarea label="Payload" value={payload} readOnly rows={10} />
        </div>
      </div>
    </ToolPanel>
  );
}

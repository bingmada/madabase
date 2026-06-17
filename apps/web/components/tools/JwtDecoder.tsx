"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
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

export function JwtDecoder({ locale = "en" }: { locale?: Locale }) {
  const [token, setToken] = useState(sample);
  const [header, setHeader] = useState("");
  const [payload, setPayload] = useState("");
  const [message, setMessage] = useState(locale === "zh" ? "粘贴 token 后点击解码。" : "Paste a token and decode it.");
  const [tone, setTone] = useState<"neutral" | "success" | "error">("neutral");
  const copy = {
    token: locale === "zh" ? "JWT Token" : "JWT token",
    decode: locale === "zh" ? "解码 JWT" : "Decode JWT",
    copy: locale === "zh" ? "复制解码结果" : "Copy decoded",
    copied: locale === "zh" ? "已复制" : "Copied",
    reset: locale === "zh" ? "重置" : "Reset",
    idle: locale === "zh" ? "粘贴 token 后点击解码。" : "Paste a token and decode it.",
    invalidParts: locale === "zh" ? "JWT 至少需要包含 header 和 payload 两部分。" : "JWT must contain at least header and payload parts.",
    decoded: locale === "zh" ? "Header 和 payload 已解码。签名未验证。" : "Header and payload decoded. Signature is not verified.",
    error: locale === "zh" ? "无法解码 JWT。" : "Unable to decode JWT.",
  };

  function decode() {
    const parts = token.split(".");
    if (parts.length < 2) {
      setHeader("");
      setPayload("");
      setMessage(copy.invalidParts);
      setTone("error");
      return;
    }

    try {
      setHeader(decodePart(parts[0]));
      setPayload(decodePart(parts[1]));
      setMessage(copy.decoded);
      setTone("success");
      fireAndForgetToolExecution("jwt-decoder");
    } catch (error) {
      setHeader("");
      setPayload("");
      setMessage(error instanceof Error ? error.message : copy.error);
      setTone("error");
    }
  }

  return (
    <ToolPanel>
      <div className="space-y-4">
        <ToolTextarea label={copy.token} value={token} onChange={setToken} rows={5} />
        <div className="flex flex-wrap gap-2">
          <ToolButton onClick={decode}>{copy.decode}</ToolButton>
          <CopyButton value={`${header}\n\n${payload}`.trim()} label={copy.copy} copiedLabel={copy.copied} />
          <ResetButton onClick={() => {
            setToken(sample);
            setHeader("");
            setPayload("");
            setMessage(copy.idle);
            setTone("neutral");
          }} label={copy.reset} />
        </div>
        <StatusMessage message={message} tone={tone} />
        <div className="grid gap-4 lg:grid-cols-2">
          <ToolTextarea label={locale === "zh" ? "Header 头部" : "Header"} value={header} readOnly rows={10} />
          <ToolTextarea label={locale === "zh" ? "Payload 载荷" : "Payload"} value={payload} readOnly rows={10} />
        </div>
      </div>
    </ToolPanel>
  );
}

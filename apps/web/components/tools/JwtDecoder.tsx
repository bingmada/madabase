"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { fireAndForgetToolExecution } from "@/lib/tool-usage-client";
import { CopyButton, ResetButton, StatusMessage, ToolButton, ToolPanel, ToolTextarea } from "./ToolPrimitives";

const sample = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik1hZGFiYXNlIiwiaWF0IjoxNTE2MjM5MDIyfQ.signature";

function decodePartJson(part: string) {
  const normalized = part.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
  const decoded = atob(padded);
  const bytes = Uint8Array.from(decoded, (char) => char.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes)) as Record<string, unknown>;
}

function formatDateClaim(value: unknown) {
  if (typeof value !== "number") return null;
  const date = new Date(value * 1000);
  if (Number.isNaN(date.getTime())) return null;
  return `${date.toISOString()} (${date.toLocaleString()})`;
}

function buildClaimSummary(headerJson: Record<string, unknown>, payloadJson: Record<string, unknown>, locale: Locale) {
  const nowSeconds = Math.floor(Date.now() / 1000);
  const exp = typeof payloadJson.exp === "number" ? payloadJson.exp : null;
  const nbf = typeof payloadJson.nbf === "number" ? payloadJson.nbf : null;
  const lines = [
    `${locale === "zh" ? "算法" : "Algorithm"}: ${String(headerJson.alg ?? "-")}`,
    `${locale === "zh" ? "类型" : "Type"}: ${String(headerJson.typ ?? "-")}`,
    headerJson.kid ? `${locale === "zh" ? "Key ID" : "Key ID"}: ${String(headerJson.kid)}` : null,
    payloadJson.iss ? `${locale === "zh" ? "签发方" : "Issuer"}: ${String(payloadJson.iss)}` : null,
    payloadJson.sub ? `${locale === "zh" ? "主体" : "Subject"}: ${String(payloadJson.sub)}` : null,
    payloadJson.aud ? `${locale === "zh" ? "受众" : "Audience"}: ${Array.isArray(payloadJson.aud) ? payloadJson.aud.join(", ") : String(payloadJson.aud)}` : null,
    payloadJson.iat ? `${locale === "zh" ? "签发时间" : "Issued at"}: ${formatDateClaim(payloadJson.iat) ?? String(payloadJson.iat)}` : null,
    nbf ? `${locale === "zh" ? "生效时间" : "Not before"}: ${formatDateClaim(nbf) ?? nbf}` : null,
    exp ? `${locale === "zh" ? "过期时间" : "Expires"}: ${formatDateClaim(exp) ?? exp}` : null,
    exp ? `${locale === "zh" ? "状态" : "Status"}: ${exp < nowSeconds ? (locale === "zh" ? "已过期" : "Expired") : (locale === "zh" ? "未过期" : "Not expired")}` : null,
    nbf && nbf > nowSeconds ? (locale === "zh" ? "提示：Token 当前尚未生效。" : "Note: token is not active yet.") : null,
    headerJson.alg === "none" ? (locale === "zh" ? "风险：alg 为 none，不能用于受信任认证。" : "Risk: alg is none and must not be trusted for authentication.") : null,
    locale === "zh" ? "签名状态：未验证。" : "Signature status: not verified.",
  ].filter(Boolean);
  return lines.join("\n");
}

export function JwtDecoder({ locale = "en" }: { locale?: Locale }) {
  const [token, setToken] = useState(sample);
  const [header, setHeader] = useState("");
  const [payload, setPayload] = useState("");
  const [summary, setSummary] = useState("");
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
      const headerJson = decodePartJson(parts[0]);
      const payloadJson = decodePartJson(parts[1]);
      setHeader(JSON.stringify(headerJson, null, 2));
      setPayload(JSON.stringify(payloadJson, null, 2));
      setSummary(buildClaimSummary(headerJson, payloadJson, locale));
      setMessage(copy.decoded);
      setTone("success");
      fireAndForgetToolExecution("jwt-decoder");
    } catch (error) {
      setHeader("");
      setPayload("");
      setSummary("");
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
          <CopyButton value={`${summary}\n\n${header}\n\n${payload}`.trim()} label={copy.copy} copiedLabel={copy.copied} />
          <ResetButton onClick={() => {
            setToken(sample);
            setHeader("");
            setPayload("");
            setSummary("");
            setMessage(copy.idle);
            setTone("neutral");
          }} label={copy.reset} />
        </div>
        <StatusMessage message={message} tone={tone} />
        {summary ? (
          <div className="rounded-md border border-[var(--border)] bg-white p-4">
            <p className="code-font text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-soft)]">{locale === "zh" ? "Claims 摘要" : "Claims summary"}</p>
            <pre className="code-font mt-2 whitespace-pre-wrap text-sm leading-6 text-[var(--text)]">{summary}</pre>
          </div>
        ) : null}
        <div className="grid gap-4 lg:grid-cols-2">
          <ToolTextarea label={locale === "zh" ? "Header 头部" : "Header"} value={header} readOnly rows={10} />
          <ToolTextarea label={locale === "zh" ? "Payload 载荷" : "Payload"} value={payload} readOnly rows={10} />
        </div>
      </div>
    </ToolPanel>
  );
}

"use client";
import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { decodeBase64, encodeBase64 } from "@/lib/tool-transforms";
import { fireAndForgetToolExecution } from "@/lib/tool-usage-client";
import { CopyButton, ResetButton, StatusMessage, ToolButton, ToolPanel, ToolTextarea } from "./ToolPrimitives";

const sample = "Hello Madabase";

export function Base64Tool({ locale = "en" }: { locale?: Locale }) {
  const [input, setInput] = useState(sample);
  const [output, setOutput] = useState(encodeBase64(sample));
  const [urlSafe, setUrlSafe] = useState(false);
  const [message, setMessage] = useState("");
  const copy = {
    input: locale === "zh" ? "输入内容" : "Input",
    output: locale === "zh" ? "输出结果" : "Output",
    encode: locale === "zh" ? "编码" : "Encode",
    decode: locale === "zh" ? "解码" : "Decode",
    copy: locale === "zh" ? "复制" : "Copy",
    copied: locale === "zh" ? "已复制" : "Copied",
    reset: locale === "zh" ? "重置" : "Reset",
    error: locale === "zh" ? "无法处理 Base64 输入。" : "Unable to process Base64 input.",
    urlSafe: locale === "zh" ? "URL-safe Base64" : "URL-safe Base64",
  };

  function run(mode: "encode" | "decode") {
    try {
      if (mode === "encode") {
        const encoded = encodeBase64(input);
        setOutput(urlSafe ? encoded.replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/g, "") : encoded);
      } else {
        const normalized = urlSafe ? input.replaceAll("-", "+").replaceAll("_", "/").padEnd(input.length + ((4 - (input.length % 4)) % 4), "=") : input;
        setOutput(decodeBase64(normalized));
      }
      setMessage("");
      fireAndForgetToolExecution("base64");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : copy.error);
    }
  }

  return (
    <ToolPanel>
      <div className="space-y-4">
        <ToolTextarea label={copy.input} value={input} onChange={setInput} rows={8} />
        <label className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-white px-3 py-2 text-sm font-semibold text-[var(--text)]">
          <input type="checkbox" checked={urlSafe} onChange={(event) => setUrlSafe(event.target.checked)} />
          {copy.urlSafe}
        </label>
        <div className="flex flex-wrap gap-2">
          <ToolButton onClick={() => run("encode")}>{copy.encode}</ToolButton>
          <ToolButton onClick={() => run("decode")} variant="secondary">{copy.decode}</ToolButton>
          <CopyButton value={output} label={copy.copy} copiedLabel={copy.copied} />
          <ResetButton label={copy.reset} onClick={() => { setInput(sample); setOutput(encodeBase64(sample)); setUrlSafe(false); setMessage(""); }} />
        </div>
        <StatusMessage message={message} tone="error" />
        <ToolTextarea label={copy.output} value={output} readOnly rows={8} />
      </div>
    </ToolPanel>
  );
}

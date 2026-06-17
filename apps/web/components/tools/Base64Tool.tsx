"use client";
import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { fireAndForgetToolExecution } from "@/lib/tool-usage-client";
import { CopyButton, ResetButton, StatusMessage, ToolButton, ToolPanel, ToolTextarea } from "./ToolPrimitives";

const sample = "Hello Madabase";

function encodeBase64(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function decodeBase64(value: string) {
  const binary = atob(value.trim());
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function Base64Tool({ locale = "en" }: { locale?: Locale }) {
  const [input, setInput] = useState(sample);
  const [output, setOutput] = useState(encodeBase64(sample));
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
  };

  function run(mode: "encode" | "decode") {
    try {
      setOutput(mode === "encode" ? encodeBase64(input) : decodeBase64(input));
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
        <div className="flex flex-wrap gap-2">
          <ToolButton onClick={() => run("encode")}>{copy.encode}</ToolButton>
          <ToolButton onClick={() => run("decode")} variant="secondary">{copy.decode}</ToolButton>
          <CopyButton value={output} label={copy.copy} copiedLabel={copy.copied} />
          <ResetButton label={copy.reset} onClick={() => { setInput(sample); setOutput(encodeBase64(sample)); setMessage(""); }} />
        </div>
        <StatusMessage message={message} tone="error" />
        <ToolTextarea label={copy.output} value={output} readOnly rows={8} />
      </div>
    </ToolPanel>
  );
}

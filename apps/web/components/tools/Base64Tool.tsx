"use client";
import { useState } from "react";
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

export function Base64Tool() {
  const [input, setInput] = useState(sample);
  const [output, setOutput] = useState(encodeBase64(sample));
  const [message, setMessage] = useState("");

  function run(mode: "encode" | "decode") {
    try {
      setOutput(mode === "encode" ? encodeBase64(input) : decodeBase64(input));
      setMessage("");
      fireAndForgetToolExecution("base64-tool");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to process Base64 input.");
    }
  }

  return (
    <ToolPanel>
      <div className="space-y-4">
        <ToolTextarea label="Input" value={input} onChange={setInput} rows={8} />
        <div className="flex flex-wrap gap-2">
          <ToolButton onClick={() => run("encode")}>Encode</ToolButton>
          <ToolButton onClick={() => run("decode")} variant="secondary">Decode</ToolButton>
          <CopyButton value={output} />
          <ResetButton onClick={() => { setInput(sample); setOutput(encodeBase64(sample)); setMessage(""); }} />
        </div>
        <StatusMessage message={message} tone="error" />
        <ToolTextarea label="Output" value={output} readOnly rows={8} />
      </div>
    </ToolPanel>
  );
}

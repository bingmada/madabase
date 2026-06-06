"use client";

import { useState } from "react";
import { CopyButton, ResetButton, StatusMessage, ToolButton, ToolPanel, ToolTextarea } from "./ToolPrimitives";

const sample = "https://madabase.com/tools/json-formatter?query=hello world";

export function UrlEncoder() {
  const [input, setInput] = useState(sample);
  const [output, setOutput] = useState(encodeURIComponent(sample));
  const [message, setMessage] = useState("");

  function run(mode: "encode" | "decode") {
    try {
      setOutput(mode === "encode" ? encodeURIComponent(input) : decodeURIComponent(input));
      setMessage("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to process URL input.");
    }
  }

  return (
    <ToolPanel>
      <div className="space-y-4">
        <ToolTextarea label="Input" value={input} onChange={setInput} rows={6} />
        <div className="flex flex-wrap gap-2">
          <ToolButton onClick={() => run("encode")}>Encode</ToolButton>
          <ToolButton onClick={() => run("decode")} variant="secondary">Decode</ToolButton>
          <CopyButton value={output} />
          <ResetButton onClick={() => { setInput(sample); setOutput(encodeURIComponent(sample)); setMessage(""); }} />
        </div>
        <StatusMessage message={message} tone="error" />
        <ToolTextarea label="Output" value={output} readOnly rows={6} />
      </div>
    </ToolPanel>
  );
}

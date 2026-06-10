"use client";

import { useState } from "react";
import { recordToolExecution } from "@/lib/limits";
import { trackEvent } from "@/lib/analytics";
import { CopyButton, ResetButton, StatusMessage, ToolButton, ToolPanel, ToolTextarea } from "./ToolPrimitives";

const sample = '{"name":"Madabase","tools":["JSON Formatter","JWT Decoder"],"online":true}';

export function JsonFormatter({ toolSlug = "json-formatter" }: { toolSlug?: string }) {
  const [input, setInput] = useState(sample);
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState<"success" | "error">("success");

  function parseJson() {
    return JSON.parse(input);
  }

  function markExecution() {
    const result = recordToolExecution(toolSlug);
    if (!result.allowed) {
      setMessage(result.reason ?? "Daily free limit reached.");
      setTone("error");
      return false;
    }
    trackEvent({ event: "tool_execute", tool: toolSlug });
    return true;
  }

  function format() {
    try {
      setInput(JSON.stringify(parseJson(), null, 2));
      if (!markExecution()) return;
      setMessage("JSON formatted successfully.");
      setTone("success");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Invalid JSON.");
      setTone("error");
    }
  }

  function minify() {
    try {
      setInput(JSON.stringify(parseJson()));
      if (!markExecution()) return;
      setMessage("JSON minified successfully.");
      setTone("success");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Invalid JSON.");
      setTone("error");
    }
  }

  function validate() {
    try {
      parseJson();
      if (!markExecution()) return;
      setMessage("Valid JSON.");
      setTone("success");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Invalid JSON.");
      setTone("error");
    }
  }

  return (
    <ToolPanel>
      <div className="space-y-4">
        <ToolTextarea label="JSON input" value={input} onChange={setInput} rows={12} />
        <div className="flex flex-wrap gap-2">
          <ToolButton onClick={format}>Format</ToolButton>
          <ToolButton onClick={minify} variant="secondary">Minify</ToolButton>
          <ToolButton onClick={validate} variant="secondary">Validate</ToolButton>
          <CopyButton value={input} />
          <ResetButton onClick={() => setInput(sample)} />
        </div>
        <StatusMessage message={message} tone={tone} />
      </div>
    </ToolPanel>
  );
}

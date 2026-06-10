"use client";
import { useState } from "react";
import { fireAndForgetToolExecution } from "@/lib/tool-usage-client";
import { CopyButton, ResetButton, StatusMessage, ToolButton, ToolPanel, ToolTextarea } from "./ToolPrimitives";

const sample = '<main><h1>Madabase</h1><p>Free developer tools.</p><ul><li>JSON</li><li>JWT</li></ul></main>';
const inlineTags = new Set(["a", "abbr", "b", "br", "code", "em", "i", "img", "span", "strong"]);
const voidTags = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);

function formatHtml(html: string) {
  const tokens = html.replace(/>\s+</g, "><").split(/(<[^>]+>)/).filter((token) => token.trim());
  let indent = 0;
  const lines: string[] = [];

  tokens.forEach((rawToken) => {
    const token = rawToken.trim();
    const tagMatch = token.match(/^<\/?([a-zA-Z0-9-]+)/);
    const tag = tagMatch?.[1]?.toLowerCase();
    const isClosing = token.startsWith("</");
    const isOpening = token.startsWith("<") && !isClosing && !token.endsWith("/>") && tag && !voidTags.has(tag);
    const isInline = tag ? inlineTags.has(tag) : false;

    if (isClosing && !isInline) indent = Math.max(0, indent - 1);
    lines.push(`${"  ".repeat(indent)}${token}`);
    if (isOpening && !isInline) indent += 1;
  });

  return lines.join("\n");
}

export function HtmlFormatter() {
  const [input, setInput] = useState(sample);
  const [output, setOutput] = useState(formatHtml(sample));
  const [message, setMessage] = useState("");

  function format() {
    try {
      setOutput(formatHtml(input));
      setMessage("");
      fireAndForgetToolExecution("html-formatter");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to format HTML.");
    }
  }

  return (
    <ToolPanel>
      <div className="space-y-4">
        <ToolTextarea label="HTML input" value={input} onChange={setInput} rows={8} />
        <div className="flex flex-wrap gap-2">
          <ToolButton onClick={format}>Format HTML</ToolButton>
          <CopyButton value={output} />
          <ResetButton onClick={() => { setInput(sample); setOutput(formatHtml(sample)); setMessage(""); }} />
        </div>
        <StatusMessage message={message} tone="error" />
        <ToolTextarea label="Formatted HTML" value={output} readOnly rows={10} />
      </div>
    </ToolPanel>
  );
}

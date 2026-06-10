"use client";
import { useMemo, useState } from "react";
import { fireAndForgetToolExecution } from "@/lib/tool-usage-client";
import { ResetButton, StatusMessage, ToolButton, ToolPanel, ToolTextarea } from "./ToolPrimitives";

const sample = '{\n  "status": "ok",\n  "count": 3\n}';

export function JsonValidator() {
  const [input, setInput] = useState(sample);
  const [validated, setValidated] = useState(false);

  const result = useMemo(() => {
    try {
      JSON.parse(input);
      return { message: "Valid JSON.", tone: "success" as const };
    } catch (error) {
      return { message: error instanceof Error ? error.message : "Invalid JSON.", tone: "error" as const };
    }
  }, [input]);

  return (
    <ToolPanel>
      <div className="space-y-4">
        <ToolTextarea label="JSON input" value={input} onChange={(value) => { setInput(value); setValidated(false); }} rows={12} />
        <div className="flex flex-wrap gap-2">
          <ToolButton onClick={() => { setValidated(true); fireAndForgetToolExecution("json-validator"); }}>Validate JSON</ToolButton>
          <ResetButton onClick={() => { setInput(sample); setValidated(false); }} />
        </div>
        <StatusMessage message={validated ? result.message : "Paste JSON and run validation."} tone={validated ? result.tone : "neutral"} />
      </div>
    </ToolPanel>
  );
}

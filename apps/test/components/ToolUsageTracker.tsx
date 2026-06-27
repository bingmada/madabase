"use client";

import { useEffect } from "react";

export function ToolUsageTracker({ toolSlug }: { toolSlug: string }) {
  useEffect(() => {
    void fetch("/api/tool-usage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toolSlug }),
    }).catch(() => {
      // best-effort persistence
    });
  }, [toolSlug]);

  return null;
}

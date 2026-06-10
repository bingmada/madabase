"use client";

import { trackEvent } from "@/lib/analytics";

export async function trackToolExecution(toolSlug: string, locale?: string) {
  trackEvent({ event: "tool_execute", tool: toolSlug, locale });

  try {
    await fetch("/api/tool-usage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toolSlug }),
    });
  } catch {
    // best-effort persistence
  }
}

export function fireAndForgetToolExecution(toolSlug: string, locale?: string) {
  void trackToolExecution(toolSlug, locale);
}

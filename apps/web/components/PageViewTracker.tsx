"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export function PageViewTracker({ locale, tool }: { locale: string; tool?: string }) {
  useEffect(() => {
    trackEvent({ event: "page_view", locale, tool });
    if (tool) {
      trackEvent({ event: "tool_view", locale, tool });
    }
  }, [locale, tool]);

  return null;
}

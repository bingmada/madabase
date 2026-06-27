export type AnalyticsEventName = "page_view" | "tool_view" | "tool_execute";

export type AnalyticsPayload = {
  event: AnalyticsEventName;
  tool?: string;
  locale?: string;
  timestamp: number;
  path: string;
};

const STORAGE_KEY = "madabase.analytics.events";
const MAX_STORED_EVENTS = 500;

function readStoredEvents() {
  if (typeof window === "undefined") return [] as AnalyticsPayload[];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AnalyticsPayload[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistEvent(payload: AnalyticsPayload) {
  if (typeof window === "undefined") return;

  const events = readStoredEvents();
  const nextEvents = [...events, payload].slice(-MAX_STORED_EVENTS);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextEvents));
}

export function getStoredAnalyticsEvents() {
  return readStoredEvents();
}

export function getPopularToolsFromEvents(limit = 6) {
  const toolCounts = new Map<string, number>();

  for (const event of readStoredEvents()) {
    if ((event.event === "tool_view" || event.event === "tool_execute") && event.tool) {
      toolCounts.set(event.tool, (toolCounts.get(event.tool) ?? 0) + 1);
    }
  }

  return [...toolCounts.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, limit)
    .map(([slug, count]) => ({ slug, count }));
}

export function trackEvent({
  event,
  tool,
  locale,
}: {
  event: AnalyticsEventName;
  tool?: string;
  locale?: string;
}) {
  if (typeof window === "undefined") return;

  const payload: AnalyticsPayload = {
    event,
    tool,
    locale,
    timestamp: Date.now(),
    path: window.location.pathname,
  };

  persistEvent(payload);
  window.dispatchEvent(new CustomEvent("madabase:analytics", { detail: payload }));

  if ((window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag) {
    (window as typeof window & { gtag: (...args: unknown[]) => void }).gtag("event", event, payload);
  }

  if (process.env.NODE_ENV !== "production") {
    console.debug("[madabase analytics]", payload);
  }
}

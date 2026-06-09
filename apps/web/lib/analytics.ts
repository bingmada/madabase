export function trackEvent({
  event,
  tool,
  locale,
}: {
  event: "page_view" | "tool_open" | "tool_use";
  tool?: string;
  locale?: string;
}) {
  if (typeof window === "undefined") return;

  const payload = {
    event,
    tool,
    locale,
    timestamp: Date.now(),
    path: window.location.pathname,
  };

  window.dispatchEvent(new CustomEvent("madabase:analytics", { detail: payload }));

  if ((window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag) {
    (window as typeof window & { gtag: (...args: unknown[]) => void }).gtag("event", event, payload);
  }

  if (process.env.NODE_ENV !== "production") {
    console.debug("[madabase analytics]", payload);
  }
}

import { hasQaParameters } from "../../../shared/analytics-traffic";
import { knownAutomation } from "./commerce-events";

export function shouldRecordCjClick(request: Request) {
  try {
    const url = new URL(request.url);
    const host = new URL(`https://${request.headers.get("host") || url.host}`).hostname;
    if (host === "localhost" || host === "127.0.0.1" || host === "[::1]" || host.endsWith(".localhost")) return false;
    if (hasQaParameters(url.search) || knownAutomation(request.headers.get("user-agent") || "")) return false;
    const referer = request.headers.get("referer");
    return !referer || !hasQaParameters(new URL(referer).search);
  } catch {
    return false;
  }
}

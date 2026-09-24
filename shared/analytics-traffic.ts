// QA state lasts only for this tab, so following an internal link cannot turn a
// verification visit into an apparently organic visit.
export function hasQaParameters(search: string) {
  const query = new URLSearchParams(search);
  return query.has("viewport-baseline")
    || query.has("madabase-qa")
    || query.get("utm_source")?.toLowerCase() === "qa"
    || query.get("utm_medium")?.toLowerCase() === "verification";
}

export function isQaVisit() {
  if (typeof window === "undefined") return false;
  const current = hasQaParameters(window.location.search);
  try {
    if (current) window.sessionStorage.setItem("madabase:qa-session", "1");
    return current || window.sessionStorage.getItem("madabase:qa-session") === "1";
  } catch {
    return current;
  }
}

// Kept self-contained for the inline loader, which runs before hydration.
export const qaAnalyticsGuard = `
  var q=new URLSearchParams(window.location.search);
  var qa=q.has("viewport-baseline")||q.has("madabase-qa")||q.get("utm_source")?.toLowerCase()==="qa"||q.get("utm_medium")?.toLowerCase()==="verification";
  try {
    if(qa)window.sessionStorage.setItem("madabase:qa-session","1");
    qa=qa||window.sessionStorage.getItem("madabase:qa-session")==="1";
  } catch(e) {}
  if(qa)return;
`;

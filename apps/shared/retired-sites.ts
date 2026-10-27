const retiredHosts = new Set([
  "tools.madabase.com",
  "style.madabase.com",
  "test.madabase.com",
  "wellness.madabase.com",
  "costumes.madabase.com",
  "costume.madabase.com",
  "tools.localhost",
  "style.localhost",
  "test.localhost",
  "wellness.localhost",
  "costumes.localhost",
  "costume.localhost",
]);

function hostname(value: string | null) {
  try {
    return new URL(`http://${value?.split(",")[0]?.trim()}`).hostname.toLowerCase().replace(/\.$/, "");
  } catch {
    return "";
  }
}

export function isRetiredSite(headers: Headers) {
  return [headers.get("host"), headers.get("x-forwarded-host")]
    .some((value) => retiredHosts.has(hostname(value)));
}

export function retiredSiteResponse(pathname: string, method: string) {
  const robots = pathname === "/robots.txt";
  return new Response(method === "HEAD" ? null : robots
    ? "User-agent: *\nAllow: /\n"
    : "This site has been permanently removed.\n", {
    status: robots ? 200 : 410,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Robots-Tag": "noindex",
      "Cache-Control": "public, max-age=300, s-maxage=300",
      "CDN-Cache-Control": "public, max-age=300",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

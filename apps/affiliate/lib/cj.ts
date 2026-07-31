const cjTrackingDomains = [
  "anrdoezrs.net",
  "dpbolvw.net",
  "jdoqocy.com",
  "kqzyfj.com",
  "qksrv.net",
  "tkqlhce.com",
  "tqlkg.com",
];

function matchesDomain(hostname: string, domain: string) {
  return hostname === domain || hostname.endsWith(`.${domain}`);
}

export function parseCjTrackingUrl(value: string) {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }

  if (url.protocol !== "https:" || !cjTrackingDomains.some((domain) => matchesDomain(url.hostname, domain))) {
    return null;
  }

  const match = url.pathname.match(/\/click-(\d+)-(\d+)(?:-\d+)?(?:\/|$)/);
  if (!match) return null;

  return { url, pid: match[1], aid: match[2] };
}

export function isAllowedCjDestination(value: string, allowedHosts: readonly string[]) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && allowedHosts.includes(url.hostname.toLowerCase());
  } catch {
    return false;
  }
}

export function verifiedCjRedirectUrl(input: {
  trackingUrl: string;
  destinationUrl: string;
  pid: string;
  aid: string;
  sid: string;
  allowedDestinationHosts: readonly string[];
}) {
  const parsed = parseCjTrackingUrl(input.trackingUrl);
  if (
    !parsed ||
    parsed.pid !== input.pid ||
    parsed.aid !== input.aid ||
    !isAllowedCjDestination(input.destinationUrl, input.allowedDestinationHosts)
  ) {
    return null;
  }

  const embeddedDestination = parsed.url.searchParams.get("url");
  if (
    embeddedDestination &&
    !isAllowedCjDestination(embeddedDestination, input.allowedDestinationHosts)
  ) {
    return null;
  }

  parsed.url.searchParams.set("sid", input.sid);
  return parsed.url;
}

export function newCjSid() {
  return `ct_${crypto.randomUUID().replaceAll("-", "")}`;
}

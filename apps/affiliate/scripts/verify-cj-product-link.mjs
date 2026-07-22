import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;
const trackingUrl = process.env.CJ_VERIFY_LINK_URL;
const destinationUrl = process.env.CJ_VERIFY_DESTINATION_URL;
const expectedPid = process.env.CJ_COSTUME_PID;
const validateOnly = process.env.CJ_VERIFY_VALIDATE_ONLY === "1";

const missing = [
  ...(validateOnly ? [] : [["DATABASE_URL", databaseUrl]]),
  ["CJ_VERIFY_LINK_URL", trackingUrl],
  ["CJ_VERIFY_DESTINATION_URL", destinationUrl],
  ["CJ_COSTUME_PID", expectedPid],
].filter(([, value]) => !value);
if (missing.length) {
  console.error(`Missing required env vars: ${missing.map(([key]) => key).join(", ")}`);
  process.exit(1);
}

const parsed = new URL(trackingUrl);
const identity = parsed.pathname.match(/\/click-(\d+)-(\d+)(?:\/|$)/);
const destination = new URL(destinationUrl);
const embeddedDestination = parsed.searchParams.get("url");
const allowedTrackingHosts = ["anrdoezrs.net", "dpbolvw.net", "jdoqocy.com", "kqzyfj.com", "qksrv.net", "tkqlhce.com"];
const validTrackingHost = allowedTrackingHosts.some((host) => parsed.hostname === host || parsed.hostname.endsWith(`.${host}`));
const validDestination = [destination, ...(embeddedDestination ? [new URL(embeddedDestination)] : [])]
  .every((url) => url.protocol === "https:" && ["abracadabranyc.com", "www.abracadabranyc.com"].includes(url.hostname));

if (parsed.protocol !== "https:" || !validTrackingHost || !identity || identity[1] !== expectedPid || !validDestination) {
  throw new Error("CJ link failed PID, AID, tracking-host, or Abracadabra-destination validation");
}

let networkResult = null;
if (process.env.CJ_VERIFY_NETWORK === "1") {
  const probe = new URL(parsed);
  probe.searchParams.set("sid", `verify_${Date.now()}`);
  const response = await fetch(probe, { redirect: "follow" });
  const finalUrl = new URL(response.url);
  const expectedVariant = destination.searchParams.get("variant");
  const finalVariant = finalUrl.searchParams.get("variant");
  if (
    !response.redirected
    || !response.ok
    || !["abracadabranyc.com", "www.abracadabranyc.com"].includes(finalUrl.hostname)
    || finalUrl.pathname !== destination.pathname
    || (expectedVariant && finalVariant !== expectedVariant)
  ) {
    throw new Error(`CJ network verification did not reach the exact Abracadabra product: ${response.status} ${response.url}`);
  }
  networkResult = { status: response.status, finalDestination: `${finalUrl.origin}${finalUrl.pathname}${expectedVariant ? `?variant=${finalVariant}` : ""}` };
}

if (validateOnly) {
  console.log(JSON.stringify({ ok: true, validateOnly: true, pid: expectedPid, aid: identity[2], destination: destination.toString(), network: networkResult }));
  process.exit(0);
}

const pool = new Pool({ connectionString: databaseUrl, max: 2 });
try {
  const result = await pool.query(
    `UPDATE "AffiliateLink" SET "trackingUrl" = $1, "destinationUrl" = $2, "aid" = $3,
       "active" = true, "verifiedAt" = NOW(), "lastCheckedAt" = NOW(), "updatedAt" = NOW()
     WHERE "network" = 'cj' AND "site" = 'costume' AND "pid" = $4
       AND "destinationUrl" = $2 RETURNING "id", "clickToken"`,
    [parsed.toString(), destination.toString(), identity[2], expectedPid],
  );
  if (result.rowCount !== 1) throw new Error(`Expected one matching dormant AffiliateLink row, found ${result.rowCount}`);
  console.log(JSON.stringify({ ok: true, pid: expectedPid, aid: identity[2], clickToken: result.rows[0].clickToken, network: networkResult }));
} finally {
  await pool.end();
}

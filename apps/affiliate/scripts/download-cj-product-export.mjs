import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import ssh2 from "ssh2";

const { Client } = ssh2;

const host = process.env.CJ_SFTP_HOST;
const port = Number(process.env.CJ_SFTP_PORT || 22);
const username = process.env.CJ_SFTP_USERNAME;
const password = process.env.CJ_SFTP_PASSWORD;
const subscriptionId = process.env.CJ_PRODUCT_EXPORT_SUBSCRIPTION_ID;
const filename = process.env.CJ_PRODUCT_EXPORT_FILENAME;
const localPath = process.env.CJ_PRODUCT_EXPORT_PATH;
const configuredFingerprint = process.env.CJ_SFTP_HOST_KEY_SHA256;
const allowLegacyDsa = process.env.CJ_SFTP_ALLOW_LEGACY_DSA === "1";

const missing = [
  ["CJ_SFTP_HOST", host],
  ["CJ_SFTP_USERNAME", username],
  ["CJ_SFTP_PASSWORD", password],
  ["CJ_PRODUCT_EXPORT_SUBSCRIPTION_ID", subscriptionId],
  ["CJ_PRODUCT_EXPORT_PATH", localPath],
  ["CJ_SFTP_HOST_KEY_SHA256", configuredFingerprint],
].filter(([, value]) => !value);

if (missing.length) {
  console.error(`Missing required env vars: ${missing.map(([key]) => key).join(", ")}`);
  process.exit(1);
}
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("CJ_SFTP_PORT must be a valid TCP port");
if (!/^[0-9]+$/.test(subscriptionId)) throw new Error("CJ_PRODUCT_EXPORT_SUBSCRIPTION_ID must be numeric");
if (filename && filename !== "auto" && path.posix.basename(filename) !== filename) {
  throw new Error("CJ_PRODUCT_EXPORT_FILENAME must be a filename, 'auto', or omitted");
}

function fingerprintHex(value) {
  const clean = value.trim();
  if (/^[a-f0-9]{64}$/i.test(clean)) return clean.toLowerCase();
  if (clean.startsWith("SHA256:")) {
    const decoded = Buffer.from(clean.slice("SHA256:".length), "base64");
    if (decoded.length === 32) return decoded.toString("hex");
  }
  throw new Error("CJ_SFTP_HOST_KEY_SHA256 must be a 64-character hex digest or an OpenSSH SHA256: fingerprint");
}

const expectedFingerprint = Buffer.from(fingerprintHex(configuredFingerprint), "hex");
const partialPath = `${localPath}.part`;
const connection = new Client();
let downloadCompleted = false;

// Some CJ sessions reset the TCP socket immediately after a clean SFTP close.
// Operation callbacks still surface transfer-time failures; this listener keeps
// a post-success reset from turning an integrity-checked download into a crash.
connection.on("error", (error) => {
  if (!downloadCompleted) return;
  if (error?.code !== "ECONNRESET") process.exitCode = 1;
});

function verifyHostKey(actualHex) {
  const actual = Buffer.from(actualHex, "hex");
  return actual.length === expectedFingerprint.length && crypto.timingSafeEqual(actual, expectedFingerprint);
}

function connect() {
  return new Promise((resolve, reject) => {
    const onError = (error) => reject(error);
    connection.once("error", onError);
    connection.once("ready", () => {
      connection.off("error", onError);
      resolve();
    });
    connection.connect({
      host,
      port,
      username,
      password,
      readyTimeout: 30_000,
      keepaliveInterval: 10_000,
      keepaliveCountMax: 3,
      hostHash: "sha256",
      hostVerifier: verifyHostKey,
      algorithms: allowLegacyDsa ? { serverHostKey: { append: ["ssh-dss"] } } : undefined,
    });
  });
}

function openSftp() {
  return new Promise((resolve, reject) => {
    connection.sftp((error, sftp) => error ? reject(error) : resolve(sftp));
  });
}

function remoteDirectory(sftp) {
  const directory = `/outgoing/productcatalog/${subscriptionId}`;
  return new Promise((resolve, reject) => {
    sftp.readdir(directory, (error, entries) => {
      if (error) reject(error);
      else resolve({ directory, entries });
    });
  });
}

async function resolveRemotePath(sftp) {
  if (filename && filename !== "auto") {
    return { filename, remotePath: `/outgoing/productcatalog/${subscriptionId}/${filename}` };
  }

  const { directory, entries } = await remoteDirectory(sftp);
  const candidates = entries
    .filter((entry) => entry?.filename && !entry.filename.startsWith(".") && entry.attrs?.isFile?.())
    .sort((left, right) => (right.attrs?.mtime ?? 0) - (left.attrs?.mtime ?? 0)
      || right.filename.localeCompare(left.filename));
  if (candidates.length === 0) throw new Error(`No CJ product export found in ${directory}`);
  const selected = candidates[0].filename;
  return { filename: selected, remotePath: `${directory}/${selected}` };
}

function remoteStat(sftp, remotePath) {
  return new Promise((resolve, reject) => {
    sftp.stat(remotePath, (error, stats) => error ? reject(error) : resolve(stats));
  });
}

function fastGet(sftp, remotePath) {
  return new Promise((resolve, reject) => {
    sftp.fastGet(remotePath, partialPath, { concurrency: 16, chunkSize: 64 * 1024 }, (error) => error ? reject(error) : resolve());
  });
}

try {
  fs.mkdirSync(path.dirname(localPath), { recursive: true, mode: 0o700 });
  fs.rmSync(partialPath, { force: true });
  await connect();
  const sftp = await openSftp();
  const selected = await resolveRemotePath(sftp);
  const stats = await remoteStat(sftp, selected.remotePath);
  if (!stats.isFile()) throw new Error(`CJ export is not a regular file: ${selected.remotePath}`);
  await fastGet(sftp, selected.remotePath);
  const localStats = fs.statSync(partialPath);
  if (localStats.size !== stats.size) {
    throw new Error(`CJ export size mismatch: expected ${stats.size}, received ${localStats.size}`);
  }
  fs.chmodSync(partialPath, 0o600);
  fs.renameSync(partialPath, localPath);
  downloadCompleted = true;
  console.log(JSON.stringify({ ok: true, subscriptionId, bytes: localStats.size, filename: selected.filename }));
} catch (error) {
  fs.rmSync(partialPath, { force: true });
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  connection.end();
}

import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const appName = process.argv[2];
const distDir = process.env.NEXT_RELEASE_DIST_DIR ?? ".next-release";
const pm2Defaults = {
  main: { name: "madabase-main", port: 3008 },
  web: { name: "madabase-tools", port: 3018 },
  test: { name: "madabase-test", port: 3000 },
  affiliate: { name: "madabase-affiliate", port: 3020 },
  wellness: { name: "madabase-wellness", port: 3030 },
};

if (!appName || !/^[a-z0-9-]+$/.test(appName)) {
  throw new Error("Usage: node scripts/package-next-standalone.mjs <workspace-name>");
}

const appRoot = join(repoRoot, "apps", appName);
const packagePath = join(appRoot, "package.json");
const buildRoot = join(appRoot, distDir);
const standaloneRoot = join(buildRoot, "standalone");
const releaseRoot = join(appRoot, ".release");
const runtimeRoot = join(releaseRoot, "runtime");
const archivePath = join(releaseRoot, `${appName}-runtime.tgz`);
const workspaceRuntime = join(runtimeRoot, "apps", appName);
const appRuntime = existsSync(join(standaloneRoot, "apps", appName, "server.js"))
  ? workspaceRuntime
  : runtimeRoot;
const nodeMajor = Number(process.versions.node.split(".")[0]);

if (nodeMajor !== 20) {
  throw new Error(`Standalone releases require Node 20.x; received ${process.version}.`);
}
if (!existsSync(packagePath)) {
  throw new Error(`Unknown workspace: apps/${appName}`);
}
if (!existsSync(standaloneRoot)) {
  throw new Error(`Missing ${relative(repoRoot, standaloneRoot)}. Run the workspace release build first.`);
}
if (!(appName in pm2Defaults)) {
  throw new Error(`No PM2 release defaults are defined for apps/${appName}.`);
}

rmSync(releaseRoot, { recursive: true, force: true });
mkdirSync(runtimeRoot, { recursive: true });
cpSync(standaloneRoot, runtimeRoot, { recursive: true });
cpSync(join(buildRoot, "static"), join(appRuntime, ".next", "static"), { recursive: true });

const copiedRuntimeDirectories = [];
for (const directory of ["public", "content"]) {
  const source = join(appRoot, directory);
  if (!existsSync(source)) continue;
  cpSync(source, join(appRuntime, directory), { recursive: true });
  copiedRuntimeDirectories.push(directory);
}

const packageJson = JSON.parse(readFileSync(packagePath, "utf8"));
const serverPath = relative(runtimeRoot, join(appRuntime, "server.js"));
const serverImport = `./${serverPath.replaceAll("\\", "/")}`;
writeFileSync(
  join(runtimeRoot, "start.mjs"),
  `const major = Number(process.versions.node.split(".")[0]);\n` +
    `if (major !== 20) {\n` +
    `  console.error(\`Standalone runtime requires Node 20.x; received \${process.version}.\`);\n` +
    `  process.exit(1);\n` +
    `}\n` +
    `await import(${JSON.stringify(serverImport)});\n`,
);

const pm2 = pm2Defaults[appName];
writeFileSync(
  join(runtimeRoot, "ecosystem.config.cjs"),
  `module.exports = {\n` +
    `  apps: [\n` +
    `    {\n` +
    `      name: ${JSON.stringify(pm2.name)},\n` +
    `      cwd: __dirname,\n` +
    `      script: "./start.mjs",\n` +
    `      interpreter: "node",\n` +
    `      instances: 1,\n` +
    `      exec_mode: "fork",\n` +
    `      autorestart: true,\n` +
    `      max_memory_restart: "350M",\n` +
    `      env: {\n` +
    `        NODE_ENV: "production",\n` +
    `        HOSTNAME: "127.0.0.1",\n` +
    `        PORT: ${JSON.stringify(String(pm2.port))},\n` +
    `      },\n` +
    `    },\n` +
    `  ],\n` +
    `};\n`,
);

const manifest = {
  app: packageJson.name,
  version: packageJson.version,
  createdAt: new Date().toISOString(),
  node: process.version,
  runtimeDirectories: copiedRuntimeDirectories,
  start: "HOSTNAME=127.0.0.1 PORT=3000 node start.mjs",
  pm2: {
    processName: pm2.name,
    defaultPort: pm2.port,
    firstStart: `pm2 start ecosystem.config.cjs --only ${pm2.name}`,
    restart: `pm2 restart ${pm2.name}`,
  },
  notes: [
    "Build this archive off-server and upload only its contents.",
    "Use Node 20.x on both the build machine and production server.",
    "Do not upload build caches, source files, or development dependencies.",
  ],
};
writeFileSync(join(runtimeRoot, "release-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);

const tar = spawnSync("tar", ["-czf", archivePath, "-C", runtimeRoot, "."], { encoding: "utf8" });
if (tar.status !== 0) {
  throw new Error(tar.stderr || "Unable to create standalone release archive.");
}

const bytes = statSync(archivePath).size;
console.log(`Created ${archivePath}`);
console.log(`Archive size: ${(bytes / 1024 / 1024).toFixed(1)} MB`);
console.log(`Start after extraction: ${manifest.start}`);

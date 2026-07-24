import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
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

const targetNativeDependencies = [];
const sharpTarget = process.env.NEXT_STANDALONE_SHARP_TARGET;
if (sharpTarget) {
  if (!/^(linux|linuxmusl)-(x64|arm64)$/.test(sharpTarget)) {
    throw new Error(`Unsupported NEXT_STANDALONE_SHARP_TARGET: ${sharpTarget}`);
  }

  const sharpRoot = join(runtimeRoot, "node_modules", "sharp");
  const sharpPackagePath = join(sharpRoot, "package.json");
  if (!existsSync(sharpPackagePath)) {
    throw new Error("NEXT_STANDALONE_SHARP_TARGET was set, but the traced runtime does not contain sharp.");
  }

  const sharpPackage = JSON.parse(readFileSync(sharpPackagePath, "utf8"));
  const nativePackageNames = [
    `@img/sharp-${sharpTarget}`,
    `@img/sharp-libvips-${sharpTarget}`,
  ];
  const nativeStagingRoot = mkdtempSync(join(tmpdir(), "madabase-sharp-"));

  try {
    for (const nativePackageName of nativePackageNames) {
      const nativeVersion = sharpPackage.optionalDependencies?.[nativePackageName];
      if (!nativeVersion) {
        throw new Error(`${nativePackageName} is not declared by sharp ${sharpPackage.version}.`);
      }

      const packed = spawnSync(
        "npm",
        ["pack", `${nativePackageName}@${nativeVersion}`, "--json"],
        { cwd: nativeStagingRoot, encoding: "utf8" },
      );
      if (packed.status !== 0) {
        throw new Error(packed.stderr || `Unable to download ${nativePackageName}@${nativeVersion}.`);
      }

      let packedMetadata;
      try {
        packedMetadata = JSON.parse(packed.stdout);
      } catch {
        throw new Error(`Unable to parse npm pack output for ${nativePackageName}: ${packed.stdout}`);
      }
      const packedFilename = packedMetadata?.[0]?.filename;
      if (!packedFilename) {
        throw new Error(`npm pack did not report a filename for ${nativePackageName}.`);
      }

      const destination = join(runtimeRoot, "node_modules", ...nativePackageName.split("/"));
      mkdirSync(destination, { recursive: true });
      const extracted = spawnSync(
        "tar",
        ["-xzf", join(nativeStagingRoot, packedFilename), "-C", destination, "--strip-components=1"],
        { encoding: "utf8" },
      );
      if (extracted.status !== 0) {
        throw new Error(extracted.stderr || `Unable to extract ${nativePackageName}.`);
      }

      targetNativeDependencies.push(`${nativePackageName}@${nativeVersion}`);
    }
  } finally {
    rmSync(nativeStagingRoot, { recursive: true, force: true });
  }

  const sharpBinary = join(
    runtimeRoot,
    "node_modules",
    "@img",
    `sharp-${sharpTarget}`,
    "lib",
    `sharp-${sharpTarget}.node`,
  );
  const libvipsRoot = join(
    runtimeRoot,
    "node_modules",
    "@img",
    `sharp-libvips-${sharpTarget}`,
    "lib",
  );
  const hasLibvipsBinary = existsSync(libvipsRoot)
    && readdirSync(libvipsRoot).some((filename) => filename.startsWith("libvips-cpp."));
  if (!existsSync(sharpBinary) || !hasLibvipsBinary) {
    throw new Error(`Unable to package the complete sharp runtime for ${sharpTarget}.`);
  }
}

// The generated standalone server keeps the configured distDir in its embedded
// Next config. Browser assets must therefore live under that same directory;
// copying them to a hard-coded `.next/static` makes every JS/CSS request 404
// when an isolated release build uses `.next-release`.
const runtimeStaticRoot = join(appRuntime, distDir, "static");
cpSync(join(buildRoot, "static"), runtimeStaticRoot, { recursive: true });
if (!existsSync(runtimeStaticRoot)) {
  throw new Error(`Unable to package browser assets at ${relative(repoRoot, runtimeStaticRoot)}.`);
}

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
  targetNativeDependencies,
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
    "When a native runtime target is configured, keep the recorded target packages in the archive.",
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

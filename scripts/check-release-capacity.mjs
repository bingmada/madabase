import assert from "node:assert/strict";
import fs from "node:fs";

// Run on the Linux production host immediately before a system.slice candidate.
// This is a necessary preflight, not a guarantee of application health.
export function assessCapacity({ availableMiB, sliceHeadroomMiB = Infinity, pressureAvg10, candidateMiB = 512, reserveMiB = 192 }) {
  const requiredMiB = candidateMiB + reserveMiB;
  const reasons = [];
  if (!Number.isFinite(availableMiB) || availableMiB < requiredMiB) reasons.push("Insufficient MemAvailable; swap does not count as candidate capacity.");
  if ((sliceHeadroomMiB !== Infinity && !Number.isFinite(sliceHeadroomMiB)) || sliceHeadroomMiB < requiredMiB) reasons.push("Invalid or insufficient system.slice cgroup headroom.");
  if (!Number.isFinite(pressureAvg10) || pressureAvg10 >= 1) reasons.push("Memory pressure is unavailable or at least 1% over the last 10 seconds.");
  if (!Number.isFinite(candidateMiB) || candidateMiB < 512 || !Number.isFinite(reserveMiB) || reserveMiB < 192) reasons.push("Invalid candidate budget, candidate below 512 MiB, or reserve below 192 MiB.");
  return { passed: reasons.length === 0, availableMiB, sliceHeadroomMiB: Number.isFinite(sliceHeadroomMiB) ? sliceHeadroomMiB : "unlimited", requiredMiB, candidateMiB, reserveMiB, pressureAvg10, reasons };
}

if (process.argv.includes("--self-test")) {
  assert.equal(assessCapacity({ availableMiB: 169, pressureAvg10: 0 }).passed, false);
  assert.equal(assessCapacity({ availableMiB: 800, pressureAvg10: 0 }).passed, true);
  assert.equal(assessCapacity({ availableMiB: 800, sliceHeadroomMiB: 200, pressureAvg10: 0 }).passed, false);
  assert.equal(assessCapacity({ availableMiB: 800, pressureAvg10: 1 }).passed, false);
  assert.equal(assessCapacity({ availableMiB: NaN, pressureAvg10: 0 }).passed, false);
  assert.equal(assessCapacity({ availableMiB: 800, pressureAvg10: NaN }).passed, false);
  assert.equal(assessCapacity({ availableMiB: 800, pressureAvg10: 0, reserveMiB: 0 }).passed, false);
  assert.equal(assessCapacity({ availableMiB: 800, sliceHeadroomMiB: NaN, pressureAvg10: 0 }).passed, false);
  assert.equal(assessCapacity({ availableMiB: 800, candidateMiB: 350, pressureAvg10: 0 }).passed, false);
  console.log("9 capacity failure/success scenarios passed; no host mutation performed.");
} else {
  try {
    const options = process.argv.slice(2);
    if (options.some(arg => !/^--candidate-mib=\d+$/.test(arg))) throw new Error("Usage: node scripts/check-release-capacity.mjs [--candidate-mib=512]");
    const candidateMiB = Number(options[0]?.split("=")[1] ?? 512);
    const meminfo = fs.readFileSync("/proc/meminfo", "utf8");
    const availableMiB = Number(meminfo.match(/^MemAvailable:\s+(\d+) kB$/m)?.[1]) / 1024;
    const pressure = fs.readFileSync("/proc/pressure/memory", "utf8");
    const pressureAvg10 = Number(pressure.match(/^some avg10=([\d.]+)/m)?.[1]);
    const slice = "/sys/fs/cgroup/system.slice";
    const limit = fs.readFileSync(`${slice}/memory.max`, "utf8").trim();
    const usage = Number(fs.readFileSync(`${slice}/memory.current`, "utf8").trim());
    const sliceHeadroomMiB = limit === "max" ? Infinity : (Number(limit) - usage) / 1048576;
    if (!Number.isFinite(usage) || (limit !== "max" && !Number.isFinite(sliceHeadroomMiB))) throw new Error("Invalid cgroup memory accounting.");
    const result = assessCapacity({ availableMiB, sliceHeadroomMiB, pressureAvg10, candidateMiB });
    console.log(JSON.stringify(result, null, 2));
    if (!result.passed) process.exitCode = 1;
  } catch (error) {
    console.error(JSON.stringify({ passed: false, reason: error.message, action: "Do not start a parallel candidate until host capacity can be verified." }));
    process.exitCode = 1;
  }
}

import { readFileSync } from "node:fs";
import { join } from "node:path";

let cached: string | undefined;
export function commerceReleaseId() {
  if (cached) return cached;
  const configured = process.env.MADABASE_RELEASE_ID;
  if (configured && /^[a-z0-9._-]{1,80}$/i.test(configured)) return cached = configured;
  // Literal paths keep Next's file tracer from expanding the directory to a
  // wildcard that also pulls previous packaged runtimes into the next build.
  try {
    const id = readFileSync(join(process.cwd(),".next-release","BUILD_ID"),"utf8").trim();
    if (/^[a-z0-9._-]{1,80}$/i.test(id)) return cached = id;
  } catch { /* Development or build-time render. */ }
  try {
    const id = readFileSync(join(process.cwd(),".next","BUILD_ID"),"utf8").trim();
    if (/^[a-z0-9._-]{1,80}$/i.test(id)) return cached = id;
  } catch { /* Development or build-time render. */ }
  return "development";
}

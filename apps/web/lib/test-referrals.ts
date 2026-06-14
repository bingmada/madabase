import { randomBytes } from "node:crypto";
import { getPrisma, hasDatabaseUrl } from "@/lib/db/client";

export const testReferralCookieName = "madabase_test_ref";
export const referralRewardAmount = 5;

function createShareCode() {
  return randomBytes(9).toString("base64url");
}

export async function getOrCreateTestShareLink(userId: string, testSlug: string) {
  if (!hasDatabaseUrl()) return null;

  const prisma = getPrisma();
  const existing = await prisma.testShareLink.findUnique({
    where: {
      userId_testSlug: {
        userId,
        testSlug,
      },
    },
  });

  if (existing) return existing;

  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      return await prisma.testShareLink.create({
        data: {
          userId,
          testSlug,
          code: createShareCode(),
        },
      });
    } catch {
      // Retry rare code collisions.
    }
  }

  return prisma.testShareLink.create({
    data: {
      userId,
      testSlug,
      code: `${createShareCode()}${Date.now().toString(36)}`,
    },
  });
}

export function encodeReferralCookieValue(code: string, testSlug: string) {
  return JSON.stringify({ code, testSlug });
}

export function parseReferralCookieValue(value: string | undefined) {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as { code?: unknown; testSlug?: unknown };
    if (typeof parsed.code !== "string" || typeof parsed.testSlug !== "string") return null;
    return { code: parsed.code, testSlug: parsed.testSlug };
  } catch {
    return null;
  }
}


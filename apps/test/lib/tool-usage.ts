import { prisma } from "@/lib/db/client";

export async function recordToolUsage(userId: string, toolSlug: string) {
  return prisma.toolUsage.upsert({
    where: {
      userId_toolSlug: {
        userId,
        toolSlug,
      },
    },
    update: {
      count: { increment: 1 },
      lastUsedAt: new Date(),
    },
    create: {
      userId,
      toolSlug,
      count: 1,
      lastUsedAt: new Date(),
    },
  });
}

export async function getRecentToolUsage(userId: string, limit = 10) {
  return prisma.toolUsage.findMany({
    where: { userId },
    orderBy: { lastUsedAt: "desc" },
    take: limit,
  });
}

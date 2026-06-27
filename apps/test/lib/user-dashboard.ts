import { getPrisma, hasDatabaseUrl } from "@/lib/db/client";

export async function getExistingCreditBalance(userId: string) {
  if (!hasDatabaseUrl()) return 0;
  const prisma = getPrisma();
  const credit = await prisma.credit.findUnique({
    where: { userId },
    select: { balance: true },
  });
  return credit?.balance ?? 0;
}

export async function getTestUnlockHistory(userId: string, limit = 12) {
  if (!hasDatabaseUrl()) return [];
  const prisma = getPrisma();
  const attempts = await prisma.testAttempt.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  if (attempts.length === 0) return [];

  const unlocks = await prisma.userUnlock.findMany({
    where: {
      userId,
      attemptId: { in: attempts.map((attempt) => attempt.attemptId) },
    },
    select: { attemptId: true, createdAt: true },
  });
  const unlockMap = new Map(unlocks.map((unlock) => [unlock.attemptId, unlock.createdAt]));

  return attempts.map((attempt) => ({
    ...attempt,
    unlocked: unlockMap.has(attempt.attemptId),
    unlockedAt: unlockMap.get(attempt.attemptId) ?? null,
  }));
}

export async function getProfileDashboard(userId: string) {
  const empty = {
    favoriteCount: 0,
    totalToolRuns: 0,
    testAttemptCount: 0,
    unlockedReportCount: 0,
    favoriteToolSlugs: [] as string[],
    recentCreditTransactions: [] as Array<{ id: string; amount: number; type: string; description: string | null; createdAt: Date }>,
  };

  if (!hasDatabaseUrl()) return empty;
  const prisma = getPrisma();

  const [favoriteCount, toolUsage, testAttemptCount, unlockedReportCount, favoriteTools, recentCreditTransactions] = await Promise.all([
    prisma.favorite.count({ where: { userId } }),
    prisma.toolUsage.findMany({ where: { userId }, select: { count: true } }),
    prisma.testAttempt.count({ where: { userId } }),
    prisma.userUnlock.count({ where: { userId } }),
    prisma.favorite.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 6, select: { toolSlug: true } }),
    prisma.creditTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, amount: true, type: true, description: true, createdAt: true },
    }),
  ]);

  return {
    favoriteCount,
    totalToolRuns: toolUsage.reduce((sum, item) => sum + item.count, 0),
    testAttemptCount,
    unlockedReportCount,
    favoriteToolSlugs: favoriteTools.map((item) => item.toolSlug),
    recentCreditTransactions,
  };
}

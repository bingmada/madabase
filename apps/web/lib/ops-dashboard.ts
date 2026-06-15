import { getPrisma, hasDatabaseUrl } from "@/lib/db/client";

export type OpsDashboardStats = {
  totals: {
    users: number;
    toolUsages: number;
    toolExecutions: number;
    testAttempts: number;
    unlockedReports: number;
    referralRewards: number;
  };
  topTools: Array<{ toolSlug: string; users: number; executions: number; lastUsedAt: Date }>;
  topTests: Array<{ testSlug: string; attempts: number }>;
  topUnlocks: Array<{ testSlug: string; resultType: string; unlocks: number }>;
  recentAttempts: Array<{ id: string; testSlug: string; resultType: string; createdAt: Date }>;
};

export async function getOpsDashboardStats(): Promise<OpsDashboardStats> {
  if (!hasDatabaseUrl()) {
    return {
      totals: {
        users: 0,
        toolUsages: 0,
        toolExecutions: 0,
        testAttempts: 0,
        unlockedReports: 0,
        referralRewards: 0,
      },
      topTools: [],
      topTests: [],
      topUnlocks: [],
      recentAttempts: [],
    };
  }

  const prisma = getPrisma();
  const [users, toolUsages, toolExecutions, testAttempts, unlockedReports, referralRewards, topToolsRaw, topTestsRaw, topUnlocksRaw, recentAttempts] =
    await Promise.all([
      prisma.user.count(),
      prisma.toolUsage.count(),
      prisma.toolUsage.aggregate({ _sum: { count: true } }),
      prisma.testAttempt.count(),
      prisma.userUnlock.count(),
      prisma.referralReward.count(),
      prisma.toolUsage.groupBy({
        by: ["toolSlug"],
        _count: { userId: true },
        _sum: { count: true },
        _max: { lastUsedAt: true },
        orderBy: { _sum: { count: "desc" } },
        take: 12,
      }),
      prisma.testAttempt.groupBy({
        by: ["testSlug"],
        _count: { testSlug: true },
        orderBy: { _count: { testSlug: "desc" } },
        take: 12,
      }),
      prisma.userUnlock.groupBy({
        by: ["testSlug", "resultType"],
        _count: { resultType: true },
        orderBy: { _count: { resultType: "desc" } },
        take: 12,
      }),
      prisma.testAttempt.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { id: true, testSlug: true, resultType: true, createdAt: true },
      }),
    ]);

  return {
    totals: {
      users,
      toolUsages,
      toolExecutions: toolExecutions._sum.count ?? 0,
      testAttempts,
      unlockedReports,
      referralRewards,
    },
    topTools: topToolsRaw.map((item) => ({
      toolSlug: item.toolSlug,
      users: item._count.userId,
      executions: item._sum.count ?? 0,
      lastUsedAt: item._max.lastUsedAt ?? new Date(0),
    })),
    topTests: topTestsRaw.map((item) => ({
      testSlug: item.testSlug,
      attempts: item._count.testSlug,
    })),
    topUnlocks: topUnlocksRaw.map((item) => ({
      testSlug: item.testSlug,
      resultType: item.resultType,
      unlocks: item._count.resultType,
    })),
    recentAttempts,
  };
}

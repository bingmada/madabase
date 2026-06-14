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
    select: { attemptId: true },
  });
  const unlockedAttemptIds = new Set(unlocks.map((unlock) => unlock.attemptId));

  return attempts.map((attempt) => ({
    ...attempt,
    unlocked: unlockedAttemptIds.has(attempt.attemptId),
  }));
}

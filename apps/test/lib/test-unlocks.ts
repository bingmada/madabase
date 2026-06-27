import { getPrisma, hasDatabaseUrl } from "@/lib/db/client";
import { referralRewardAmount } from "@/lib/test-referrals";

export async function getUserCreditBalance(userId: string) {
  if (!hasDatabaseUrl()) return 0;
  const prisma = getPrisma();
  const credit = await prisma.credit.upsert({
    where: { userId },
    update: {},
    create: { userId, balance: 10 },
  });
  return credit.balance;
}

export async function hasUnlockedTestResult(userId: string, testSlug: string, resultType: string, attemptId?: string | null) {
  if (!hasDatabaseUrl()) return false;
  if (!attemptId) return false;
  const prisma = getPrisma();
  const unlock = await prisma.userUnlock.findFirst({
    where: {
      userId,
      testSlug,
      resultType: resultType.toUpperCase(),
      attemptId,
    },
  });
  return Boolean(unlock);
}

export async function recordTestAttempt(userId: string, testSlug: string, resultType: string, attemptId?: string | null) {
  if (!hasDatabaseUrl() || !attemptId) return;
  const prisma = getPrisma();
  await prisma.testAttempt.upsert({
    where: {
      userId_attemptId: {
        userId,
        attemptId,
      },
    },
    update: {
      testSlug,
      resultType: resultType.toUpperCase(),
    },
    create: {
      userId,
      testSlug,
      resultType: resultType.toUpperCase(),
      attemptId,
    },
  });
}

export async function unlockTestResult({
  userId,
  testSlug,
  resultType,
  attemptId,
  cost,
  referralCode,
}: {
  userId: string;
  testSlug: string;
  resultType: string;
  attemptId?: string | null;
  cost: number;
  referralCode?: string | null;
}) {
  if (!hasDatabaseUrl()) {
    return { ok: false as const, error: "Database is not configured." };
  }
  if (!attemptId) {
    return { ok: false as const, error: "Missing test attempt." };
  }

  const prisma = getPrisma();
  const normalizedResultType = resultType.toUpperCase();

  return prisma.$transaction(async (tx) => {
    const existing = await tx.userUnlock.findFirst({
      where: {
        userId,
        testSlug,
        resultType: normalizedResultType,
        attemptId,
      },
    });

    if (existing) {
      const credit = await tx.credit.upsert({
        where: { userId },
        update: {},
        create: { userId, balance: 10 },
      });
      return { ok: true as const, balance: credit.balance, alreadyUnlocked: true };
    }

    const credit = await tx.credit.upsert({
      where: { userId },
      update: {},
      create: { userId, balance: 10 },
    });

    if (credit.balance < cost) {
      return { ok: false as const, error: "Insufficient credits.", balance: credit.balance };
    }

    const updatedCredit = await tx.credit.update({
      where: { userId },
      data: { balance: { decrement: cost } },
    });

    await tx.creditTransaction.create({
      data: {
        userId,
        amount: -cost,
        type: "consume",
        description: `Unlock ${testSlug} ${normalizedResultType} report`,
      },
    });

    await tx.userUnlock.create({
      data: {
        userId,
        testSlug,
        resultType: normalizedResultType,
        attemptId,
      },
    });

    await tx.testAttempt.upsert({
      where: {
        userId_attemptId: {
          userId,
          attemptId,
        },
      },
      update: {
        testSlug,
        resultType: normalizedResultType,
      },
      create: {
        userId,
        testSlug,
        resultType: normalizedResultType,
        attemptId,
      },
    });

    if (referralCode) {
      const shareLink = await tx.testShareLink.findUnique({
        where: { code: referralCode },
      });

      if (shareLink && shareLink.testSlug === testSlug && shareLink.userId !== userId) {
        const existingReward = await tx.referralReward.findUnique({
          where: {
            shareLinkId_referredUserId: {
              shareLinkId: shareLink.id,
              referredUserId: userId,
            },
          },
        });

        if (!existingReward) {
          await tx.credit.upsert({
            where: { userId: shareLink.userId },
            update: { balance: { increment: referralRewardAmount } },
            create: { userId: shareLink.userId, balance: 10 + referralRewardAmount },
          });

          await tx.creditTransaction.create({
            data: {
              userId: shareLink.userId,
              amount: referralRewardAmount,
              type: "grant",
              description: `Referral reward for ${testSlug} ${normalizedResultType} unlock`,
            },
          });

          await tx.referralReward.create({
            data: {
              shareLinkId: shareLink.id,
              referrerUserId: shareLink.userId,
              referredUserId: userId,
              testSlug,
              resultType: normalizedResultType,
              amount: referralRewardAmount,
            },
          });
        }
      }
    }

    return { ok: true as const, balance: updatedCredit.balance, alreadyUnlocked: false };
  });
}

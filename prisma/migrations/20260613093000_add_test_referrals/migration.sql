-- CreateTable
CREATE TABLE "TestShareLink" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "testSlug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TestShareLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferralReward" (
    "id" TEXT NOT NULL,
    "shareLinkId" TEXT NOT NULL,
    "referrerUserId" TEXT NOT NULL,
    "referredUserId" TEXT NOT NULL,
    "testSlug" TEXT NOT NULL,
    "resultType" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReferralReward_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TestShareLink_code_key" ON "TestShareLink"("code");

-- CreateIndex
CREATE INDEX "TestShareLink_testSlug_idx" ON "TestShareLink"("testSlug");

-- CreateIndex
CREATE UNIQUE INDEX "TestShareLink_userId_testSlug_key" ON "TestShareLink"("userId", "testSlug");

-- CreateIndex
CREATE UNIQUE INDEX "ReferralReward_shareLinkId_referredUserId_key" ON "ReferralReward"("shareLinkId", "referredUserId");

-- CreateIndex
CREATE INDEX "ReferralReward_referrerUserId_createdAt_idx" ON "ReferralReward"("referrerUserId", "createdAt");

-- CreateIndex
CREATE INDEX "ReferralReward_referredUserId_createdAt_idx" ON "ReferralReward"("referredUserId", "createdAt");

-- AddForeignKey
ALTER TABLE "TestShareLink" ADD CONSTRAINT "TestShareLink_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralReward" ADD CONSTRAINT "ReferralReward_shareLinkId_fkey" FOREIGN KEY ("shareLinkId") REFERENCES "TestShareLink"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralReward" ADD CONSTRAINT "ReferralReward_referrerUserId_fkey" FOREIGN KEY ("referrerUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralReward" ADD CONSTRAINT "ReferralReward_referredUserId_fkey" FOREIGN KEY ("referredUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

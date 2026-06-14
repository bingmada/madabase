-- AlterTable
ALTER TABLE "CreditTransaction" ADD COLUMN "description" TEXT;

-- CreateTable
CREATE TABLE "UserUnlock" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "testSlug" TEXT NOT NULL,
    "resultType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserUnlock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserUnlock_testSlug_resultType_idx" ON "UserUnlock"("testSlug", "resultType");

-- CreateIndex
CREATE UNIQUE INDEX "UserUnlock_userId_testSlug_resultType_key" ON "UserUnlock"("userId", "testSlug", "resultType");

-- AddForeignKey
ALTER TABLE "UserUnlock" ADD CONSTRAINT "UserUnlock_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

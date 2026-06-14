ALTER TABLE "UserUnlock" ADD COLUMN "attemptId" TEXT;

DROP INDEX IF EXISTS "UserUnlock_userId_testSlug_resultType_key";

CREATE UNIQUE INDEX "UserUnlock_userId_testSlug_resultType_attemptId_key"
  ON "UserUnlock"("userId", "testSlug", "resultType", "attemptId");

CREATE INDEX "UserUnlock_userId_attemptId_idx" ON "UserUnlock"("userId", "attemptId");

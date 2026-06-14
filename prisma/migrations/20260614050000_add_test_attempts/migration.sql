CREATE TABLE "TestAttempt" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "testSlug" TEXT NOT NULL,
  "resultType" TEXT NOT NULL,
  "attemptId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "TestAttempt_pkey" PRIMARY KEY ("id")
);

INSERT INTO "TestAttempt" ("id", "userId", "testSlug", "resultType", "attemptId", "createdAt")
SELECT 'attempt_' || "id", "userId", "testSlug", "resultType", "attemptId", "createdAt"
FROM "UserUnlock"
ON CONFLICT DO NOTHING;

CREATE UNIQUE INDEX "TestAttempt_userId_attemptId_key" ON "TestAttempt"("userId", "attemptId");
CREATE INDEX "TestAttempt_userId_createdAt_idx" ON "TestAttempt"("userId", "createdAt");
CREATE INDEX "TestAttempt_testSlug_resultType_idx" ON "TestAttempt"("testSlug", "resultType");

ALTER TABLE "TestAttempt" ADD CONSTRAINT "TestAttempt_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

UPDATE "UserUnlock"
SET "attemptId" = "id"
WHERE "attemptId" IS NULL;

ALTER TABLE "UserUnlock" ALTER COLUMN "attemptId" SET NOT NULL;

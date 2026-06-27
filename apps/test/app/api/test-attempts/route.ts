import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/services/sessionService";
import { getPrisma, hasDatabaseUrl } from "@/lib/db/client";
import { testMap } from "@/lib/test-registry";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!hasDatabaseUrl()) {
    return NextResponse.json({ error: "Database is not configured" }, { status: 503 });
  }

  const body = (await request.json().catch(() => null)) as {
    attemptId?: unknown;
    testSlug?: unknown;
    resultType?: unknown;
  } | null;
  const attemptId = typeof body?.attemptId === "string" ? body.attemptId.trim() : "";
  const testSlug = typeof body?.testSlug === "string" ? body.testSlug.trim() : "";
  const resultType = typeof body?.resultType === "string" ? body.resultType.trim().toUpperCase() : "";
  const test = testMap.get(testSlug);

  if (!attemptId || !test || !test.resultTypes.includes(resultType)) {
    return NextResponse.json({ error: "Invalid test attempt" }, { status: 400 });
  }

  const prisma = getPrisma();
  const attempt = await prisma.testAttempt.upsert({
    where: {
      userId_attemptId: {
        userId: user.id,
        attemptId,
      },
    },
    update: {
      testSlug,
      resultType,
    },
    create: {
      userId: user.id,
      testSlug,
      resultType,
      attemptId,
    },
  });

  return NextResponse.json({ ok: true, attemptId: attempt.attemptId });
}

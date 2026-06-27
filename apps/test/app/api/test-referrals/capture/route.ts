import { NextResponse } from "next/server";
import { getPrisma, hasDatabaseUrl } from "@/lib/db/client";
import { encodeReferralCookieValue, testReferralCookieName } from "@/lib/test-referrals";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { code?: unknown; testSlug?: unknown } | null;
  const code = typeof body?.code === "string" ? body.code.trim() : "";
  const testSlug = typeof body?.testSlug === "string" ? body.testSlug.trim() : "";

  if (!code || !testSlug || !hasDatabaseUrl()) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const prisma = getPrisma();
  const shareLink = await prisma.testShareLink.findUnique({
    where: { code },
  });

  if (!shareLink || shareLink.testSlug !== testSlug) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(testReferralCookieName, encodeReferralCookieValue(code, testSlug), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}


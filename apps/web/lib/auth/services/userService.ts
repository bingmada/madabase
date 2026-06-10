import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/client";
import { authConfig, getSessionMaxAgeSeconds, getVerificationCodeTtlMs } from "../config";
import { sendEmailVerificationCode } from "../providers/email";
import { generateSessionToken, generateVerificationCode, hashToken, normalizeEmail } from "../utils";

export async function requestEmailCode(email: string) {
  const normalizedEmail = normalizeEmail(email);
  const code = generateVerificationCode();
  const expiresAt = new Date(Date.now() + getVerificationCodeTtlMs());

  const user = await prisma.user.upsert({
    where: { email: normalizedEmail },
    update: {},
    create: { email: normalizedEmail },
  });

  await prisma.emailVerificationCode.create({
    data: {
      userId: user.id,
      email: normalizedEmail,
      code,
      expiresAt,
    },
  });

  await sendEmailVerificationCode({ email: normalizedEmail, code });
  return { ok: true as const };
}

export async function verifyEmailCode(email: string, code: string) {
  const normalizedEmail = normalizeEmail(email);
  const record = await prisma.emailVerificationCode.findFirst({
    where: {
      email: normalizedEmail,
      code,
      consumedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });

  if (!record || !record.user) {
    return { ok: false as const, error: "Invalid or expired verification code." };
  }

  await prisma.emailVerificationCode.update({
    where: { id: record.id },
    data: { consumedAt: new Date() },
  });

  const user = await prisma.user.update({
    where: { id: record.user.id },
    data: { emailVerified: true },
  });

  const sessionToken = generateSessionToken();
  await prisma.session.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(sessionToken),
      expiresAt: new Date(Date.now() + getSessionMaxAgeSeconds() * 1000),
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(authConfig.sessionCookieName, sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: getSessionMaxAgeSeconds(),
  });

  return { ok: true as const, user };
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(authConfig.sessionCookieName)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  });

  if (!session || session.expiresAt <= new Date()) {
    return null;
  }

  return session.user;
}

export async function signOut() {
  const cookieStore = await cookies();
  const token = cookieStore.get(authConfig.sessionCookieName)?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { tokenHash: hashToken(token) } });
  }
  cookieStore.delete(authConfig.sessionCookieName);
}

export async function requireUser(locale: string) {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/${locale}/login`);
  }
  return user;
}

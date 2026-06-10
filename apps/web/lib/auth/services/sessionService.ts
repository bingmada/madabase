import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getPrisma, hasDatabaseUrl } from "@/lib/db/client";
import { authConfig } from "../config";
import { hashToken } from "../utils";

export async function getCurrentUser() {
  if (!hasDatabaseUrl()) {
    return null;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(authConfig.sessionCookieName)?.value;
  if (!token) return null;

  const prisma = getPrisma();
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
  if (token && hasDatabaseUrl()) {
    const prisma = getPrisma();
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

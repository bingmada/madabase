"use server";

import { redirect } from "next/navigation";
import { signOut } from "@/lib/auth/services/sessionService";
import type { Locale } from "@/lib/i18n";

export async function signOutAction(locale: Locale) {
  await signOut();
  redirect(`/${locale}`);
}

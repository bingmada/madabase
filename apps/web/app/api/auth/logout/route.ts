import { NextResponse } from "next/server";
import { signOut } from "@/lib/auth/services/sessionService";

export async function POST() {
  await signOut();
  return NextResponse.json({ ok: true });
}

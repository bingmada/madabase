import { NextResponse } from "next/server";
import { verifyCodeSchema } from "@/lib/auth/schema";
import { verifyEmailCode } from "@/lib/auth/services/userService";

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = verifyCodeSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email or code." }, { status: 400 });
  }

  const result = await verifyEmailCode(parsed.data.email, parsed.data.code);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true, user: result.user });
}

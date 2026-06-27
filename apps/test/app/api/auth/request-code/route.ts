import { NextResponse } from "next/server";
import { emailSchema } from "@/lib/auth/schema";
import { requestEmailCode } from "@/lib/auth/services/userService";

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = emailSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  }

  await requestEmailCode(parsed.data.email);
  return NextResponse.json({ ok: true });
}

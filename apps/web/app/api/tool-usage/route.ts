import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/services/sessionService";
import { recordToolUsage } from "@/lib/tool-usage";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ ok: true, persisted: false });
  }

  const { toolSlug } = (await request.json()) as { toolSlug?: string };
  if (!toolSlug) {
    return NextResponse.json({ error: "Missing toolSlug" }, { status: 400 });
  }

  await recordToolUsage(user.id, toolSlug);
  return NextResponse.json({ ok: true, persisted: true });
}

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/services/sessionService";
import { toggleFavorite } from "@/lib/favorites";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { toolSlug } = (await request.json()) as { toolSlug?: string };
  if (!toolSlug) {
    return NextResponse.json({ error: "Missing toolSlug" }, { status: 400 });
  }

  const result = await toggleFavorite(user.id, toolSlug);
  return NextResponse.json(result);
}

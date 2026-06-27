import { prisma } from "@/lib/db/client";

export async function getFavoriteState(userId: string, toolSlug: string) {
  const favorite = await prisma.favorite.findUnique({
    where: {
      userId_toolSlug: {
        userId,
        toolSlug,
      },
    },
  });

  return Boolean(favorite);
}

export async function toggleFavorite(userId: string, toolSlug: string) {
  const existing = await prisma.favorite.findUnique({
    where: {
      userId_toolSlug: {
        userId,
        toolSlug,
      },
    },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return { favorited: false as const };
  }

  await prisma.favorite.create({
    data: {
      userId,
      toolSlug,
    },
  });

  return { favorited: true as const };
}

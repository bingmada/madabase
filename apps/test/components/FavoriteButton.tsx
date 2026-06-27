"use client";

import { useState } from "react";

export function FavoriteButton({
  locale,
  toolSlug,
  initialFavorited,
  requireLoginHref,
}: {
  locale: "en" | "zh";
  toolSlug: string;
  initialFavorited: boolean;
  requireLoginHref: string;
}) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const copy = {
    en: {
      favorite: "☆ Favorite",
      favorited: "★ Favorited",
      login: "Please log in to save favorites.",
      error: "Unable to update favorite.",
    },
    zh: {
      favorite: "☆ 收藏",
      favorited: "★ 已收藏",
      login: "请先登录后再收藏。",
      error: "收藏状态更新失败。",
    },
  }[locale];

  async function toggle() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/favorites/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolSlug }),
      });

      if (response.status === 401) {
        window.location.href = requireLoginHref;
        return;
      }

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? copy.error);
      }

      setFavorited(payload.favorited);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : copy.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={toggle}
        disabled={loading}
        className="inline-flex h-10 items-center rounded-md border border-[var(--border)] bg-white px-4 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--brand)] hover:bg-[var(--brand-soft)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {favorited ? copy.favorited : copy.favorite}
      </button>
      {message ? <p className="mt-2 text-sm text-rose-700">{message}</p> : null}
    </div>
  );
}

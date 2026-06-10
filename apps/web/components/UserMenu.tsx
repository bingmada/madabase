"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { SignOutButton } from "./SignOutButton";

function getInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "M";
}

function itemClassName(active: boolean) {
  return `block rounded-md px-3 py-2 text-sm font-medium transition ${active ? "bg-[var(--surface-muted)] text-[var(--text)]" : "text-[var(--text)] hover:bg-[var(--surface-muted)]"}`;
}

export function UserMenu({
  locale,
  email,
  nickname,
  pathname,
}: {
  locale: Locale;
  email: string;
  nickname?: string | null;
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const displayName = nickname?.trim() || email.split("@")[0] || (locale === "en" ? "Profile" : "个人中心");

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const copy = {
    profile: locale === "en" ? "Profile" : "个人中心",
    favorites: locale === "en" ? "Favorites" : "我的收藏",
    signOut: locale === "en" ? "Sign out" : "退出登录",
  };

  return (
    <div ref={containerRef} className="relative hidden shrink-0 md:block">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-white py-1 pl-1 pr-3 text-sm font-medium text-[var(--text)] shadow-sm transition hover:border-[var(--brand)] hover:bg-[var(--brand-soft)]"
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--surface-code)] text-xs font-bold text-white">
          {getInitial(displayName)}
        </span>
        <span className="hidden max-w-28 truncate lg:block">{displayName}</span>
      </button>

      {open ? (
        <div className="absolute right-0 top-[calc(100%+0.5rem)] z-50 min-w-56 rounded-xl border border-[var(--border)] bg-white p-2 shadow-[var(--shadow-panel)]">
          <div className="border-b border-[var(--border)] px-3 py-2">
            <p className="text-sm font-semibold text-[var(--text)]">{displayName}</p>
            <p className="mt-1 text-xs text-[var(--text-soft)]">{email}</p>
          </div>
          <div className="pt-2">
            <Link href={`/${locale}/profile`} onClick={() => setOpen(false)} className={itemClassName(pathname === "/profile")}>
              {copy.profile}
            </Link>
            <Link href={`/${locale}/favorites`} onClick={() => setOpen(false)} className={itemClassName(pathname === "/favorites")}>
              {copy.favorites}
            </Link>
            <div className="mt-1 border-t border-[var(--border)] pt-1">
              <SignOutButton locale={locale} label={copy.signOut} className="w-full rounded-md px-3 py-2 text-left text-sm font-medium text-[var(--text)] transition hover:bg-[var(--surface-muted)]" />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

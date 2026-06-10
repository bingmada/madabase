"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { SignOutButton } from "./SignOutButton";

type NavItem = {
  href: string;
  label: string;
  active: boolean;
};

export function MobileNav({
  locale,
  pathname,
  items,
  user,
}: {
  locale: Locale;
  pathname: string;
  items: NavItem[];
  user: { email: string; nickname?: string | null } | null;
}) {
  const [open, setOpen] = useState(false);
  const displayName = user ? user.nickname?.trim() || user.email.split("@")[0] : null;

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-label={locale === "en" ? "Toggle navigation menu" : "切换导航菜单"}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[var(--border)] bg-white text-[var(--text)] shadow-sm transition hover:border-[var(--brand)] hover:bg-[var(--brand-soft)]"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open ? (
        <div className="absolute inset-x-0 top-full border-b border-[var(--border)] bg-[rgba(246,247,244,0.98)] px-4 py-4 shadow-[var(--shadow-panel)] backdrop-blur-xl sm:px-6">
          <div className="mx-auto flex max-w-6xl flex-col gap-2">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-2 text-sm font-medium transition ${item.active ? "bg-white text-[var(--text)] shadow-sm" : "text-[var(--text-muted)] hover:bg-white hover:text-[var(--text)]"}`}
              >
                {item.label}
              </Link>
            ))}

            {user ? (
              <>
                <div className="mt-2 rounded-xl border border-[var(--border)] bg-white p-3">
                  <p className="text-sm font-semibold text-[var(--text)]">{displayName}</p>
                  <p className="mt-1 text-xs text-[var(--text-soft)]">{user.email}</p>
                </div>
                <Link
                  href={`/${locale}/profile`}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition ${pathname === "/profile" ? "bg-white text-[var(--text)] shadow-sm" : "text-[var(--text-muted)] hover:bg-white hover:text-[var(--text)]"}`}
                >
                  {locale === "en" ? "Profile" : "个人中心"}
                </Link>
                <Link
                  href={`/${locale}/favorites`}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition ${pathname === "/favorites" ? "bg-white text-[var(--text)] shadow-sm" : "text-[var(--text-muted)] hover:bg-white hover:text-[var(--text)]"}`}
                >
                  {locale === "en" ? "Favorites" : "我的收藏"}
                </Link>
                <SignOutButton locale={locale} className="w-full rounded-md px-3 py-2 text-left text-sm font-medium text-[var(--text-muted)] transition hover:bg-white hover:text-[var(--text)]" />
              </>
            ) : (
              <Link href={`/${locale}/login`} className="mt-2 inline-flex h-11 items-center justify-center rounded-full bg-[var(--surface-code)] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--brand-strong)]">
                {locale === "en" ? "Log in to save tools" : "登录以保存工具"}
              </Link>
            )}

            <div className="mt-2">
              <LanguageSwitcher locale={locale} pathname={pathname} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

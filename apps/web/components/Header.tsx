import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/services/sessionService";
import type { Locale } from "@/lib/i18n";
import { getExistingCreditBalance } from "@/lib/user-dashboard";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileNav } from "./MobileNav";
import { UserMenu } from "./UserMenu";

function navLinkClassName(active: boolean) {
  return `rounded-md px-2.5 py-1.5 font-medium transition ${active ? "bg-white text-[var(--text)] shadow-sm" : "hover:bg-white hover:text-[var(--text)]"}`;
}

export async function Header({ locale, pathname = "/" }: { locale: Locale; pathname?: string }) {
  const user = await getCurrentUser();
  const creditBalance = user ? await getExistingCreditBalance(user.id) : 0;
  const copy = {
    tools: locale === "en" ? "Tools" : "工具",
    tests: locale === "en" ? "Tests" : "测试",
    blog: locale === "en" ? "Blog" : "博客",
    ai: locale === "en" ? "AI" : "AI",
    login: locale === "en" ? "Log in" : "登录",
  };

  const navItems = [
    { href: `/${locale}/tools`, label: copy.tools, active: pathname === "/tools" || pathname.startsWith("/tools/") },
    { href: `/${locale}/tests`, label: copy.tests, active: pathname === "/tests" || pathname.startsWith("/tests/") },
    { href: `/${locale}/blog`, label: copy.blog, active: pathname === "/blog" || pathname.startsWith("/blog/") },
    { href: `/${locale}/ai`, label: copy.ai, active: pathname === "/ai" || pathname.startsWith("/ai/") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[rgba(246,247,244,0.82)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href={`/${locale}`} className="group inline-flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-md border border-[var(--border-strong)] bg-[var(--surface-code)] text-sm font-black text-white shadow-sm">
            M
          </span>
          <span className="text-base font-semibold text-[var(--text)]">Madabase</span>
        </Link>

        <div className="flex items-center gap-2 md:hidden">
          <MobileNav locale={locale} pathname={pathname} items={navItems} user={user ? { email: user.email, nickname: user.nickname } : null} />
        </div>

        <nav className="hidden min-w-0 items-center gap-1 text-sm text-[var(--text-muted)] md:flex md:gap-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={navLinkClassName(item.active)}>
              {item.label}
            </Link>
          ))}
          {user ? (
            <UserMenu locale={locale} email={user.email} nickname={user.nickname} pathname={pathname} creditBalance={creditBalance} />
          ) : (
            <Link href={`/${locale}/login`} className="inline-flex h-10 items-center rounded-full bg-[var(--surface-code)] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--brand-strong)]">
              {copy.login}
            </Link>
          )}
          <LanguageSwitcher locale={locale} pathname={pathname} />
        </nav>
      </div>
    </header>
  );
}

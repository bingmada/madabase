import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header({ locale, pathname = "/" }: { locale: Locale; pathname?: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[rgba(246,247,244,0.82)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href={`/${locale}`} className="group inline-flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-md border border-[var(--border-strong)] bg-[var(--surface-code)] text-sm font-black text-white shadow-sm">
            M
          </span>
          <span className="text-base font-semibold text-[var(--text)]">Madabase</span>
        </Link>
        <nav className="flex min-w-0 items-center gap-2 text-sm text-[var(--text-muted)] sm:gap-3">
          <Link href={`/${locale}/tools`} className="rounded-md px-2.5 py-1.5 font-medium transition hover:bg-white hover:text-[var(--text)]">Tools</Link>
          <Link href={`/${locale}/ai`} className="rounded-md px-2.5 py-1.5 font-medium transition hover:bg-white hover:text-[var(--text)]">AI</Link>
          <LanguageSwitcher locale={locale} pathname={pathname} />
        </nav>
      </div>
    </header>
  );
}

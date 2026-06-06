import Link from "next/link";
import { localeLabels, locales, type Locale } from "@/lib/i18n";

export function LanguageSwitcher({ locale, pathname }: { locale: Locale; pathname: string }) {
  return (
    <div className="flex shrink-0 items-center rounded-md border border-[var(--border)] bg-[var(--surface-muted)] p-1">
      {locales.map((item) => {
        const localizedPath = `/${item}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
        const active = item === locale;
        return (
          <Link
            key={item}
            href={localizedPath}
            className={`rounded-[5px] px-2 py-1 text-xs font-semibold transition sm:px-2.5 ${active ? "bg-white text-[var(--text)] shadow-sm" : "text-[var(--text-muted)] hover:text-[var(--text)]"}`}
          >
            {localeLabels[item]}
          </Link>
        );
      })}
    </div>
  );
}

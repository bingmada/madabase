import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-white/60">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 text-sm text-[var(--text-muted)] sm:px-6 lg:px-8 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <p className="font-semibold text-[var(--text)]">Madabase</p>
          <p className="mt-2 leading-6">Free online tools, practical SEO content, and future AI products for developers and creators.</p>
        </div>
        <div>
          <p className="font-semibold text-[var(--text)]">Platform</p>
          <div className="mt-2 flex flex-col gap-2">
            <Link href="/en/tools">Tools</Link>
            <Link href="/en/blog">Blog</Link>
            <Link href="/en/ai">AI</Link>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-2">
          <span>© 2026 Madabase</span>
          <span className="code-font text-xs uppercase tracking-[0.18em] text-[var(--text-soft)]">SSR / i18n / seo / ads / analytics</span>
        </div>
      </div>
    </footer>
  );
}

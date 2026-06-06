export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-white/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <span>© 2026 Madabase</span>
        <span className="code-font text-xs uppercase tracking-[0.18em] text-[var(--text-soft)]">SSR / i18n / tools-first</span>
      </div>
    </footer>
  );
}

import type { Locale } from "@/lib/i18n";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { AdSlot } from "./AdSlot";

export function ToolLayout({ locale, pathname = "/tools", children }: { locale: Locale; pathname?: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-transparent">
      <Header locale={locale} pathname={pathname} />
      <main className="content-shell">
        <AdSlot locale={locale} position="header" />
        {children}
        <AdSlot locale={locale} position="footer" />
      </main>
      <Footer />
    </div>
  );
}

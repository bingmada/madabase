import type { Locale } from "@/lib/i18n";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { AdSlot } from "./AdSlot";
import { PageViewTracker } from "./PageViewTracker";

export function ToolLayout({ locale, pathname = "/tools", children, tool }: { locale: Locale; pathname?: string; children: React.ReactNode; tool?: string }) {
  return (
    <div className="min-h-screen bg-transparent">
      <Header locale={locale} pathname={pathname} />
      <main className="content-shell">
        <PageViewTracker locale={locale} tool={tool} />
        <AdSlot locale={locale} position="header" size="banner" />
        {children}
        <AdSlot locale={locale} position="footer" size="native" />
      </main>
      <Footer />
    </div>
  );
}

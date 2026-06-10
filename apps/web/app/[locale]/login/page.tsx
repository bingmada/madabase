import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AuthCard } from "@/components/AuthCard";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { isLocale, locales } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return buildPageMetadata({
    title: locale === "en" ? "Login" : "登录",
    description: locale === "en" ? "Log in to Madabase with email and a verification code." : "使用邮箱与验证码登录 Madabase。",
    locale,
    path: "/login",
    keywords: ["madabase login", "email login"],
  });
}

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <div className="min-h-screen bg-transparent">
      <Header locale={locale} pathname="/login" />
      <main className="content-shell py-12">
        <AuthCard locale={locale} mode="login" />
        <p className="mt-5 text-center text-sm text-[var(--text-muted)]">
          {locale === "en" ? "No account yet?" : "还没有账号？"}{" "}
          <Link href={`/${locale}/register`} className="font-semibold text-[var(--brand-strong)]">
            {locale === "en" ? "Create one" : "立即注册"}
          </Link>
        </p>
      </main>
      <Footer />
    </div>
  );
}

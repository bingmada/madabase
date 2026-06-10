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
    title: locale === "en" ? "Register" : "注册",
    description: locale === "en" ? "Create your Madabase account with email and a verification code." : "使用邮箱与验证码创建 Madabase 账户。",
    locale,
    path: "/register",
    keywords: ["madabase register", "email signup"],
  });
}

export default async function RegisterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <div className="min-h-screen bg-transparent">
      <Header locale={locale} pathname="/register" />
      <main className="content-shell py-12">
        <AuthCard locale={locale} mode="register" />
        <p className="mt-5 text-center text-sm text-[var(--text-muted)]">
          {locale === "en" ? "Already have an account?" : "已经有账号？"}{" "}
          <Link href={`/${locale}/login`} className="font-semibold text-[var(--brand-strong)]">
            {locale === "en" ? "Log in" : "去登录"}
          </Link>
        </p>
      </main>
      <Footer />
    </div>
  );
}

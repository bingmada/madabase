"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  const locale = pathname.startsWith("/zh") ? "zh" : "en";
  const copy = {
    en: {
      description: "Online tools, practical developer guides, and useful workflows for developers and creators.",
      platform: "Platform",
      tools: "Tools",
      blog: "Blog",
      contact: "Contact",
      about: "About",
      editorial: "Editorial policy",
      privacy: "Privacy",
      terms: "Terms",
      buyingGuides: "Buying Guides",
      petPicks: "Pet gear",
      officePicks: "Home office",
      babyPicks: "Baby gear",
      networkPicks: "Home network",
      smartHomePicks: "Smart home",
      stylePicks: "Style accessories",
    },
    zh: {
      description: "在线工具、实用开发指南，以及面向开发者和创作者的高效工作流。",
      platform: "平台",
      tools: "工具",
      blog: "博客",
      contact: "联系我们",
      about: "关于我们",
      editorial: "编辑政策",
      privacy: "隐私政策",
      terms: "使用条款",
      buyingGuides: "选购指南",
      petPicks: "宠物用品",
      officePicks: "居家办公",
      babyPicks: "母婴用品",
      networkPicks: "家庭网络",
      smartHomePicks: "智能家居",
      stylePicks: "穿搭配饰",
    },
  }[locale];

  return (
    <footer className="border-t border-[var(--border)] bg-white/60">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 text-sm text-[var(--text-muted)] sm:px-6 lg:px-8 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
        <div>
          <p className="font-semibold text-[var(--text)]">Madabase</p>
          <p className="mt-2 leading-6">{copy.description}</p>
        </div>
        <div>
          <p className="font-semibold text-[var(--text)]">{copy.platform}</p>
          <div className="mt-2 flex flex-col gap-2">
            <Link href={`/${locale}/tools`}>{copy.tools}</Link>
            <Link href={`/${locale}/blog`}>{copy.blog}</Link>
            <Link href={`/${locale}/contact`}>{copy.contact}</Link>
            <Link href={`/${locale}/about`}>{copy.about}</Link>
            <Link href={`/${locale}/editorial-policy`}>{copy.editorial}</Link>
            <Link href={`/${locale}/privacy`}>{copy.privacy}</Link>
            <Link href={`/${locale}/terms`}>{copy.terms}</Link>
          </div>
        </div>
        <div>
          <p className="font-semibold text-[var(--text)]">{copy.buyingGuides}</p>
          <div className="mt-2 flex flex-col gap-2">
            <a href="https://pets.madabase.com">{copy.petPicks}</a>
            <a href="https://homeoffice.madabase.com">{copy.officePicks}</a>
            <a href="https://baby.madabase.com">{copy.babyPicks}</a>
            <a href="https://network.madabase.com">{copy.networkPicks}</a>
            <a href="https://smarthome.madabase.com">{copy.smartHomePicks}</a>
            <a href="https://style.madabase.com">{copy.stylePicks}</a>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-2">
          <span>© 2026 Madabase</span>
          <a className="text-sm font-semibold text-[var(--brand-strong)]" href="mailto:bingmada003@gmail.com">bingmada003@gmail.com</a>
        </div>
      </div>
    </footer>
  );
}

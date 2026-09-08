import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import "./globals.css";
import { site } from "./site-data";

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: {
    default: site.name,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* @ts-expect-error Impact verification requires its non-standard meta value attribute. */}
        <meta name="impact-site-verification" value="ba96bb1e-788f-4f05-80ec-38b7ceb8d31a" />
      </head>
      <body>
        <header className="site-header">
          <Link className="brand" href="/">
            <span className="brand-mark">
              <Sparkles size={18} aria-hidden="true" />
            </span>
            <span>{site.name}</span>
          </Link>
          <nav className="nav" aria-label="Primary">
            <Link href="/categories">Directory</Link>
            <Link href="/categories/lingerie">Lingerie</Link>
            <Link href="/categories/nightwear">Nightwear</Link>
            <Link href="/methodology">Method</Link>
            <Link href="/affiliate-disclosure">Disclosure</Link>
          </nav>
        </header>
        {children}
        <footer className="site-footer">
          <div>
            <strong>{site.name}</strong>
            <p>Practical lingerie, sleepwear, and homewear buying guidance.</p>
          </div>
          <nav aria-label="Footer">
            <Link href="/about">About</Link>
            <Link href="/editorial-policy">Editorial Policy</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </footer>
      </body>
    </html>
  );
}

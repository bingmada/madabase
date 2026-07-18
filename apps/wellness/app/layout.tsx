import type { Metadata } from "next";
import Link from "next/link";
import { Shield } from "lucide-react";
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
      <body>
        <header className="site-header">
          <Link className="brand" href="/">
            <span className="brand-mark">
              <Shield size={18} aria-hidden="true" />
            </span>
            <span>{site.name}</span>
          </Link>
          <nav className="nav" aria-label="Primary">
            <Link href="/categories">Categories</Link>
            <Link href="/guides/body-safe-materials">Materials</Link>
            <Link href="/guides/cleaning-and-storage">Care</Link>
            <Link href="/best/premium-wellness-catalog">Catalog</Link>
            <Link href="/methodology">Method</Link>
            <Link href="/affiliate-disclosure">Disclosure</Link>
          </nav>
        </header>
        {children}
        <footer className="site-footer">
          <div>
            <strong>{site.name}</strong>
            <p>Adult wellness buying guidance for readers 18+.</p>
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

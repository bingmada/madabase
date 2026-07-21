import Link from "next/link";
import { ArrowUpRight, Menu } from "lucide-react";
import { publications } from "@/lib/content";

const primaryLinks = [
  { href: "/research", label: "Latest research" },
  { href: "/guides", label: "Decision guides" },
  { href: "/methodology", label: "Methodology" },
  { href: "/about", label: "About" },
];

export function Logo() {
  return (
    <Link className="brand" href="/" aria-label="Madabase home">
      <span className="brand-mark" aria-hidden="true"><span>M</span></span>
      <span>Madabase</span>
    </Link>
  );
}

export function Header() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Logo />
        <nav className="desktop-nav" aria-label="Primary navigation">
          {primaryLinks.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
        </nav>
        <details className="mobile-menu">
          <summary aria-label="Open navigation"><Menu size={20} aria-hidden="true" /></summary>
          <nav aria-label="Mobile navigation">
            {primaryLinks.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
          </nav>
        </details>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-main">
        <div className="footer-intro">
          <Logo />
          <p>Independent buying research for the choices that shape a home and the people living in it.</p>
        </div>
        <div>
          <h2>Publications</h2>
          <ul>
            {publications.map((publication) => (
              <li key={publication.key}>
                <a href={publication.domain}>{publication.name}<ArrowUpRight size={13} aria-hidden="true" /></a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Editorial</h2>
          <ul>
            <li><Link href="/methodology">Methodology</Link></li>
            <li><Link href="/editorial-policy">Editorial policy</Link></li>
            <li><Link href="/affiliate-disclosure">Affiliate disclosure</Link></li>
            <li><Link href="/about">About Madabase</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="shell footer-bottom">
        <p>© 2026 Madabase. Research before the checkout page.</p>
        <div className="footer-legal">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
        <div className="footer-elsewhere" aria-label="Other Madabase projects">
          <span>Elsewhere</span>
          <a href="https://tools.madabase.com">Free tools</a>
          <a href="https://test.madabase.com">Self-assessments</a>
        </div>
      </div>
    </footer>
  );
}

"use client";

import Link from "next/link";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumb({
  locale,
  items,
}: {
  locale: string;
  items: BreadcrumbItem[];
}) {
  return (
    <nav className="mb-4 flex flex-wrap items-center gap-2 text-sm text-[var(--text-soft)]">
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-2">
          {index > 0 && <span className="text-[var(--text-soft)]">/</span>}
          {item.href ? (
            <Link
              href={item.href}
              className="transition hover:text-[var(--brand-strong)]"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-[var(--text)]">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

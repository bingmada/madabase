"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export function ProductSidebar({ children }: { children: ReactNode }) {
  const sidebar = useRef<HTMLElement>(null);
  const [fitsViewport, setFitsViewport] = useState(false);

  useEffect(() => {
    const element = sidebar.current;
    if (!element) return;
    const measure = () => setFitsViewport(
      window.innerWidth >= 1024 && element.getBoundingClientRect().height <= window.innerHeight - 112,
    );
    measure();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    observer?.observe(element);
    window.addEventListener("resize", measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <aside
      ref={sidebar}
      className={`min-w-0 space-y-5 lg:self-start${fitsViewport ? " lg:sticky lg:top-24" : ""}`}
      data-review-sidebar-mode={fitsViewport ? "sticky" : "flow"}
    >
      {children}
    </aside>
  );
}

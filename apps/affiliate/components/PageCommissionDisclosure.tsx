"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";

// One disclosure per page. It starts in the footer for server-rendered pages
// and moves below the first available purchase button after hydration.
// The same slot supports buttons revealed by the compatibility tools.
export function PageCommissionDisclosure({ children }: { children: string }) {
  const [slot, setSlot] = useState<Element | null>(null);
  const pathname = usePathname();
  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;
    const chooseSlot = () => {
      const next = Array.from(main.querySelectorAll("[data-commission-slot]"))
        .filter(candidate => candidate.previousElementSibling?.getClientRects().length)
        .sort((a, b) => a.previousElementSibling!.getBoundingClientRect().top - b.previousElementSibling!.getBoundingClientRect().top)[0] ?? null;
      setSlot(previous => previous === next ? previous : next);
    };
    chooseSlot();
    const observer = new MutationObserver(chooseSlot);
    observer.observe(main, { childList: true, subtree: true, attributes: true, attributeFilter: ["hidden", "open", "class", "style"] });
    window.addEventListener("resize", chooseSlot);
    return () => { observer.disconnect(); window.removeEventListener("resize", chooseSlot); };
  }, [pathname]);
  const disclosure = <p className="mt-2 max-w-xl text-[13px] leading-5 text-[var(--muted)]" lang="en" data-page-commission-disclosure="true">{children}</p>;
  return slot ? createPortal(disclosure, slot) : disclosure;
}

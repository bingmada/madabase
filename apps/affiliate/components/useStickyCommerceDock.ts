"use client";

import { useEffect, useState, type RefObject } from "react";

export function useStickyCommerceDock({
  enabled,
  buttonRef,
  startId,
  scopeKey,
}: {
  enabled: boolean;
  buttonRef: RefObject<HTMLAnchorElement | null>;
  startId?: string;
  scopeKey: string;
}) {
  const [state, setState] = useState({ key: "", visible: false });

  useEffect(() => {
    setState({ key: scopeKey, visible: false });
    const button = buttonRef.current;
    const start = startId ? document.getElementById(startId) : button;
    if (!enabled || !button || !start) return;

    const footer = document.querySelector("footer");
    const header = document.querySelector("header");
    const matchingPurchaseLinks = [...document.querySelectorAll("[data-sticky-commerce-suppress]")]
      .flatMap((element) => element.matches("a[data-commerce-product]")
        ? [element]
        : [...element.querySelectorAll("a[data-commerce-product]")])
      .filter((element) => element.getAttribute("data-commerce-product") === button.dataset.commerceProduct);
    const suppressors = [...new Set([
      ...matchingPurchaseLinks,
      ...document.querySelectorAll("#fit-worksheet, #compatibility-checker"),
    ])];
    let frame: number | undefined;
    let active = true;
    const inViewport = (element: Element, visibleTop: number) => {
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && rect.bottom > visibleTop && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth;
    };
    const update = () => {
      frame = undefined;
      if (!active) return;
      const visibleTop = Math.max(0, Math.min(window.innerHeight, header?.getBoundingClientRect().bottom ?? 0));
      const visible = start.isConnected && button.isConnected && start.getBoundingClientRect().bottom <= visibleTop
        && !inViewport(button, visibleTop) && !(footer && inViewport(footer, visibleTop))
        && !suppressors.some((element) => inViewport(element, visibleTop));
      setState((current) => current.key === scopeKey && current.visible === visible ? current : { key: scopeKey, visible });
    };
    const schedule = () => {
      if (frame === undefined && active) frame = window.requestAnimationFrame(update);
    };
    // An anchor jump can move a trigger from below to above the viewport while
    // it stays non-intersecting. Scroll sampling handles that missed transition.
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("hashchange", schedule);
    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(schedule);
    for (const element of new Set([start, button, ...(footer ? [footer] : []), ...suppressors])) observer?.observe(element);
    const resizeObserver = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
    resizeObserver?.observe(document.body);
    schedule();
    return () => {
      active = false;
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("hashchange", schedule);
      observer?.disconnect();
      resizeObserver?.disconnect();
      if (frame !== undefined) window.cancelAnimationFrame(frame);
    };
  }, [buttonRef, enabled, scopeKey, startId]);

  return enabled && state.key === scopeKey && state.visible;
}

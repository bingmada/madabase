"use client";

import Script from "next/script";
import type { SiteKey } from "@/lib/types";

declare global {
  interface Window {
    clarity?: (...args: Array<string | string[]>) => void;
  }
}

export function ClarityAnalytics({ projectId, site }: { projectId: string | undefined; site: SiteKey }) {
  if (!projectId) return null;

  return (
    <Script id="microsoft-clarity" strategy="afterInteractive">
      {`(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", ${JSON.stringify(projectId)});
      window.clarity("set", "site", ${JSON.stringify(site)});`}
    </Script>
  );
}

export function trackClarityAffiliateClick({
  site,
  productSlug,
  merchant,
  position,
}: {
  site: SiteKey;
  productSlug: string;
  merchant: string;
  position: string;
}) {
  window.clarity?.("set", "site", site);
  window.clarity?.("set", "affiliate_product", productSlug);
  window.clarity?.("set", "affiliate_merchant", merchant);
  window.clarity?.("set", "affiliate_position", position);
  window.clarity?.("event", "affiliate_click");
}

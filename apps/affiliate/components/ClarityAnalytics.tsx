"use client";

import Script from "next/script";
import type { MarketKey, SiteKey } from "@/lib/types";

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
        var h=c.location.hostname;
        if(h!=="madabase.com"&&!h.endsWith(".madabase.com"))return;
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", ${JSON.stringify(projectId)});
      window.clarity?.("set", "site", ${JSON.stringify(site)});
      (function(){
        var locale=window.location.pathname.split("/")[1];
        var market={"en-gb":"gb","en-ca":"ca","de-de":"de","nl-nl":"nl"}[locale]||"us";
        window.clarity?.("set", "market", market);
      })();`}
    </Script>
  );
}

export function trackClarityAffiliateClick({
  site,
  market,
  productSlug,
  merchant,
  position,
}: {
  site: SiteKey;
  market?: MarketKey;
  productSlug: string;
  merchant: string;
  position: string;
}) {
  window.clarity?.("set", "site", site);
  window.clarity?.("set", "market", market ?? "us");
  window.clarity?.("set", "affiliate_product", productSlug);
  window.clarity?.("set", "affiliate_merchant", merchant);
  window.clarity?.("set", "affiliate_position", position);
  window.clarity?.("event", "affiliate_click");
}

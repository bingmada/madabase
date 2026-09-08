"use client";

import Script from "next/script";

declare global {
  interface Window {
    clarity?: (...args: Array<string | string[]>) => void;
  }
}

export function ClarityAnalytics({ projectId }: { projectId?: string }) {
  if (!projectId) return null;

  return (
    <Script id="microsoft-clarity" strategy="afterInteractive">
      {`(function(c,l,a,r,i,t,y){
        var h=c.location.hostname;
        if(h!=="wellness.madabase.com")return;
        var q=new URLSearchParams(c.location.search);
        if(q.has("viewport-baseline")||q.has("madabase-qa"))return;
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", ${JSON.stringify(projectId)});
      window.clarity?.("set", "site", "wellness");
      window.clarity?.("set", "market", "us");`}
    </Script>
  );
}

export function trackAffiliateClick(input: {
  productSlug: string;
  merchant: string;
  position: string;
}) {
  window.clarity?.("set", "site", "wellness");
  window.clarity?.("set", "market", "us");
  window.clarity?.("set", "affiliate_product", input.productSlug);
  window.clarity?.("set", "affiliate_merchant", input.merchant);
  window.clarity?.("set", "affiliate_position", input.position);
  window.clarity?.("event", "affiliate_click");
}

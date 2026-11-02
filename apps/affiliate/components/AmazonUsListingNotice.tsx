import type { MarketKey } from "@/lib/types";

export function AmazonUsListingNotice({ market }: { market?: MarketKey }) {
  if (!market) return null;
  return <p className="mt-3 text-sm leading-6">Amazon.com · U.S. listing. Return observations refer to the selected U.S. offer. Check local delivery, compatibility, import costs and return eligibility separately.</p>;
}

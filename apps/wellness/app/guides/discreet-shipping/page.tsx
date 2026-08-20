import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuidePage } from "@/app/guide-page";
import { guides } from "@/app/site-data";

const guide = guides.find((item) => item.slug === "/guides/discreet-shipping");

export const metadata: Metadata = {
  title: "Discreet Shipping Checklist",
  description:
    "What to verify before checkout when plain packaging, billing labels, returns, and delivery timing matter.",
  alternates: {
    canonical: "/guides/discreet-shipping",
  },
  robots: { index: false, follow: false },
};

export default function Page() {
  if (!guide) notFound();
  return <GuidePage guide={guide} />;
}

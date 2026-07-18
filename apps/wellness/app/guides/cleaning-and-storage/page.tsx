import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuidePage } from "@/app/guide-page";
import { guides } from "@/app/site-data";

const guide = guides.find((item) => item.slug === "/guides/cleaning-and-storage");

export const metadata: Metadata = {
  title: "Cleaning And Storage Guide",
  description:
    "A practical routine for cleaning, drying, charging, and storing personal wellness products carefully.",
  alternates: {
    canonical: "/guides/cleaning-and-storage",
  },
};

export default function Page() {
  if (!guide) notFound();
  return <GuidePage guide={guide} />;
}

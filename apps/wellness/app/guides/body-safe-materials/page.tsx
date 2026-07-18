import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuidePage } from "@/app/guide-page";
import { guides } from "@/app/site-data";

const guide = guides.find((item) => item.slug === "/guides/body-safe-materials");

export const metadata: Metadata = {
  title: "Body-Safe Materials Guide",
  description:
    "How to evaluate silicone, ABS, glass, stainless steel, and porous material risks before buying intimacy products.",
  alternates: {
    canonical: "/guides/body-safe-materials",
  },
};

export default function Page() {
  if (!guide) notFound();
  return <GuidePage guide={guide} />;
}

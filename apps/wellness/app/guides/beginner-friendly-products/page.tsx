import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuidePage } from "@/app/guide-page";
import { guides } from "@/app/site-data";

const guide = guides.find(
  (item) => item.slug === "/guides/beginner-friendly-products",
);

export const metadata: Metadata = {
  title: "Beginner-Friendly Product Criteria",
  description:
    "A calm framework for choosing first intimacy products by controls, size, care, noise, and return policy.",
  alternates: {
    canonical: "/guides/beginner-friendly-products",
  },
  robots: { index: false, follow: false },
};

export default function Page() {
  if (!guide) notFound();
  return <GuidePage guide={guide} />;
}

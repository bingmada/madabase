import { EditorialPage } from "@/components/EditorialPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Editorial policy", "Madabase editorial standards for independence, evidence, corrections, updates, affiliate relationships, and product availability.", "/editorial-policy");

export default function EditorialPolicyPage() {
  return <EditorialPage eyebrow="Editorial policy" title="The recommendation belongs to the evidence." lede="Commercial relationships may fund the work, but they do not decide the verdict, hide an important limitation, or convert research synthesis into a hands-on claim." sections={[
    { heading: "Editorial control", paragraphs: ["Madabase chooses which topics, products, comparisons, and risks to cover. A merchant or manufacturer does not receive approval rights over the conclusion.", "Sponsored placement is not currently part of the main Madabase research format. If that changes, paid material will be clearly identified and separated from independent editorial recommendations."] },
    { heading: "Product selection", paragraphs: ["Products are selected when buyer demand, a meaningful long-tail decision, commercial intent, cluster potential, and a credible merchant path support the work. Popularity alone does not guarantee inclusion.", "A product may be held or removed when its exact model cannot be verified, its listing drifts to another item, official evidence conflicts, availability becomes unreliable, or the page would duplicate an existing decision."] },
    { heading: "Claims and language", paragraphs: ["Factual specifications are attributed to their sources. Editorial conclusions are written as judgments, not disguised facts. Safety and compatibility limits stay visible when they could change who should buy or skip the product.", "We avoid certainty where the evidence does not support it and clearly identify research-synthesis pages that were not based on first-hand use."] },
    { heading: "Updates and corrections", paragraphs: ["Material changes to model identity, price structure, compatibility, subscription terms, bundle, or recommendation receive an updated date. Small style edits do not reset freshness.", "Correction reports are checked against primary sources. When an error materially changes the decision, the page and its update note are revised."] },
    { heading: "Availability and price", paragraphs: ["Prices and availability change quickly. Price bands are context, not guaranteed quotes. Readers should confirm the exact seller, model, generation, region, pack count, included accessories, subscription commitment, shipping, return terms, and final price at checkout."] },
  ]} />;
}

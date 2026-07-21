import { EditorialPage } from "@/components/EditorialPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Affiliate disclosure", "How Madabase and its focused publications may earn commissions from qualifying purchases without changing the buyer's price.", "/affiliate-disclosure");

export default function AffiliateDisclosurePage() {
  return <EditorialPage eyebrow="Affiliate disclosure" title="Some links may earn a commission." lede="Madabase and its focused publications may receive compensation when a reader follows an eligible merchant link and completes a qualifying purchase." sections={[
    { heading: "Amazon Associates", paragraphs: ["Madabase publications participate in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn fees by linking to Amazon.com and affiliated sites.", "As an Amazon Associate, the applicable Madabase publication earns from qualifying purchases. The buyer's eligible purchase price is not increased because of the commission."] },
    { heading: "Other merchants", paragraphs: ["Some pages may link to other retailers or affiliate networks. Eligible purchases can produce a commission under those programs. A working affiliate relationship does not guarantee that a product will be recommended or ranked first."] },
    { heading: "How affiliate links are presented", paragraphs: ["Sponsored merchant links are identified near the action or in the page disclosure. Editorial links between Madabase publications are not direct merchant links.", "Prices, availability, sellers, model variants, and program terms can change after publication. Readers should verify the final checkout details directly with the merchant."] },
    { heading: "Editorial independence", paragraphs: ["Commissions help fund research, hosting, visual production, maintenance, and ongoing verification. They do not permit a merchant to approve the verdict or remove a supported criticism.", "Our methodology and editorial policy explain the evidence labels, selection gates, correction process, and reasons a product may be held or removed."] },
  ]} />;
}

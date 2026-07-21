import { EditorialPage } from "@/components/EditorialPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("About Madabase", "Madabase is an independent network of focused consumer-research publications covering connected homes, workspaces, family care, pet care, and personal style.", "/about");

export default function AboutPage() {
  return <EditorialPage eyebrow="About" title="One editorial standard, six focused publications." lede="Madabase connects buying decisions that cross categories while each publication stays close to the products, constraints, and language of its own subject." sections={[
    { heading: "Why the network is split by subject", paragraphs: ["Home networking, smart-home compatibility, ergonomic furniture, baby gear, pet routines, and personal accessories create different kinds of risk. A single generic product catalog would make those differences harder to see.", "Each publication therefore maintains its own product research, comparisons, guides, and update path. Madabase provides the parent identity, shared methodology, and cross-category decisions that do not belong to only one aisle."] },
    { heading: "The six publications", paragraphs: ["Signalwise Picks covers home networking. Dwellwise Picks covers smart-home systems. Deskwise Picks covers home-office setups. NestCheck Picks covers baby gear. PawSelect Picks covers pet care. Sideglance Style covers expressive accessories and practical styling.", "The publications are independently presented but operated under the same Madabase editorial and affiliate-disclosure standards."] },
    { heading: "What Madabase does not do", paragraphs: ["We do not claim hands-on experience when a page is based on documentation and research. We do not copy merchant reviews or disguise listing language as independent judgment. We do not recommend every product simply because it has an affiliate program.", "The site is not a substitute for medical, safety, electrical, structural, veterinary, or other professional advice. Product manuals and qualified professionals control where those limits apply."] },
    { heading: "How the business works", paragraphs: ["Some focused publication pages contain affiliate links. If a reader follows one and makes a qualifying purchase, Madabase may receive a commission without increasing the reader's price.", "The root Madabase site primarily routes readers to relevant editorial research. It does not place merchant buttons on the homepage or turn every navigation choice into a sales link."] },
  ]} />;
}

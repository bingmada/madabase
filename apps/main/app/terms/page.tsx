import { EditorialPage } from "@/components/EditorialPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Terms of use", "Terms for using Madabase editorial content, outbound links, product information, and site services.", "/terms");

export default function TermsPage() {
  return <EditorialPage eyebrow="Terms" title="Terms of use" lede="By using Madabase, you agree to use the site lawfully and to verify product, merchant, professional, and safety information before acting on it." sections={[
    { heading: "Editorial information", paragraphs: ["Madabase provides general educational and consumer-research information. It is not medical, veterinary, legal, financial, electrical, structural, safety, or other professional advice.", "Products, specifications, prices, availability, compatibility, subscriptions, warranties, and merchant terms can change. Verify the current manual, manufacturer guidance, seller, model, and checkout terms before purchase or installation."] },
    { heading: "No guaranteed outcome", paragraphs: ["Recommendations describe fit for stated situations and evidence available at the time of review. Madabase does not guarantee that a product will meet every user's needs, remain available, retain software support, or produce a particular result."] },
    { heading: "External services", paragraphs: ["Madabase links to focused publications, manufacturers, standards bodies, merchants, and other external services. Those services control their own content, availability, transactions, privacy practices, and terms."] },
    { heading: "Acceptable use", paragraphs: ["Do not interfere with site operation, attempt unauthorized access, distribute malicious code, scrape the site in a manner that degrades service, misrepresent Madabase content, or use the site unlawfully."] },
    { heading: "Content and changes", paragraphs: ["Madabase text, design, branding, and original visual assets are protected by applicable rights. Reasonable linking and quotation with attribution are welcome, but wholesale republication is not.", "These terms and site features may be updated as the publication changes. Continued use after an update means the revised terms apply from their stated effective date."] },
  ]} />;
}

import { EditorialPage } from "@/components/EditorialPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Privacy policy", "Madabase privacy policy covering analytics, server logs, outbound links, cookies, contact messages, and data choices.", "/privacy");

export default function PrivacyPage() {
  return <EditorialPage eyebrow="Privacy" title="Privacy policy" lede="This policy explains the limited information Madabase may process when someone visits the site, follows an editorial link, or contacts us." sections={[
    { heading: "Information processed automatically", paragraphs: ["Hosting, security, and content-delivery services may process standard request information such as IP address, browser type, device type, requested URL, timestamp, referrer, and response status. These records support delivery, abuse prevention, and reliability.", "Microsoft Clarity may be used to understand aggregate visits, navigation, scrolling, and interaction problems. Madabase also records non-sensitive events such as which publication link was selected and its page position."] },
    { heading: "Cookies and similar storage", paragraphs: ["Analytics, security, and affiliate services may use cookies or similar technologies according to their own policies. Browser controls can restrict or remove this storage, though some preferences or measurement may stop working."] },
    { heading: "Outbound and affiliate links", paragraphs: ["When a reader follows a link to another Madabase publication or merchant, the destination receives the normal request and referrer information allowed by the browser. Merchants and affiliate networks process information under their own privacy policies."] },
    { heading: "Messages", paragraphs: ["If a reader sends a correction, question, or other message, the submitted contact details and message content are used to respond, investigate the request, and maintain an appropriate record. Do not send passwords, payment data, health records, or other unnecessary sensitive information."] },
    { heading: "Retention and choices", paragraphs: ["Operational records are retained only as long as reasonably needed for security, analytics, support, legal, and business purposes. Readers may use browser privacy controls and may contact Madabase with a relevant privacy request."] },
  ]} />;
}

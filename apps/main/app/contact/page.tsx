import { Mail, MessageSquareWarning } from "lucide-react";
import { PageIntro } from "@/components/PageParts";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Contact Madabase", "Contact Madabase to report a factual correction, broken merchant destination, model mismatch, or editorial question.", "/contact");

export default function ContactPage() {
  return (
    <main>
      <PageIntro eyebrow="Contact" title="Corrections are part of the work." body="Send factual corrections, model or bundle mismatches, broken destinations, source updates, and editorial questions. Include the exact page URL and a primary source when one is available." />
      <section className="section">
        <div className="shell contact-grid">
          <article>
            <Mail size={23} aria-hidden="true" />
            <h2>Email Madabase</h2>
            <p>Use email for correction evidence, rights questions, privacy requests, or a problem that affects more than one publication.</p>
            <a className="button button-dark" href="mailto:hello@madabase.com">hello@madabase.com</a>
          </article>
          <article>
            <MessageSquareWarning size={23} aria-hidden="true" />
            <h2>What to include</h2>
            <ul>
              <li>The exact Madabase or publication URL</li>
              <li>The statement, model, link, or image at issue</li>
              <li>A current manufacturer, manual, standards, or regulatory source</li>
              <li>The region and product variant when relevant</li>
            </ul>
          </article>
        </div>
      </section>
    </main>
  );
}

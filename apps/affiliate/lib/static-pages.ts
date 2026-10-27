import type { SiteConfig } from "./sites";
import type { StaticPage } from "./types";

export const staticPageSlugs = ["about", "methodology", "editorial-policy", "affiliate-disclosure", "privacy", "contact"] as const;

function focusLine(site: SiteConfig) {
  if (site.key === "pet") return "pet-care routines, cleaning effort, replacement parts, home fit, and whether a product reduces daily friction.";
  if (site.key === "baby") return "baby-care routines, safe-use limits, cleaning effort, storage, caregiver comfort, and version-specific compatibility.";
  if (site.key === "network") return "home layout, port requirements, wired backhaul, client-device support, setup friction, and whether the network stays reliable under everyday load.";
  if (site.key === "smarthome") return "door and HVAC compatibility, hub requirements, local controls, subscriptions, privacy, installation effort, and what still works when the internet is unavailable.";
  return "desk fit, ergonomics, device compatibility, setup friction, cable paths, and whether a product solves a real home-office problem.";
}

function checkoutSource(site: SiteConfig) {
  if (site.key === "baby") return "the exact Amazon or Bc Babycare listing reached through its authorized affiliate path";
  return "the exact Amazon listing";
}

export function getStaticPages(site: SiteConfig): StaticPage[] {
  return [
    {
      slug: "about",
      title: `About ${site.name}`,
      dek: `${site.name} publishes practical buying notes for people who want fewer regret buys and clearer trade-offs.`,
      sections: [
        {
          heading: "Publisher and editorial responsibility",
          body: `${site.name} is a Madabase publication. The Madabase editorial desk is responsible for the research, comparisons, corrections and affiliate disclosures on this site. Send a correction to 15797688584@163.com with the page URL, exact model and supporting source. The editorial-desk byline identifies the publisher; it does not imply a laboratory, professional certification or a team of product testers.`,
        },
        {
          heading: "What this site is for",
          body: `${site.name} is built around practical buying decisions, not shopping hype. We organize products by the job they need to do, then explain who they fit, who should skip them, and what to verify before checkout.`,
        },
        {
          heading: "How we think about recommendations",
          body: `We focus on ${focusLine(site)} Product pages are written as buying notes, with strengths, trade-offs, compatibility checks, and alternatives kept visible.`,
        },
        {
          heading: "What we avoid",
          body: "We do not present marketplace star ratings as our own evaluation, publish fake hands-on testing, or hide affiliate relationships. When a product has version, accessory, subscription, or sizing risk, that risk belongs on the page.",
        },
        {
          heading: "What a research guide can establish",
          body: "Manufacturer documentation can establish a stated specification or supported configuration. A standards document explains a protocol or general requirement. An independent test applies to its named equipment and conditions. A retailer listing identifies an offer at the time it was checked. We keep those roles separate and describe unresolved model-specific details as questions to verify, rather than transferring a claim from a similar product.",
        },
        {
          heading: "Article updates and retailer checks have different dates",
          body: "An article revision records a change to the explanation, comparison or sources. A listing-identity date records when the named product and ASIN were checked. Neither is a promise of today's price, stock, seller, delivery or return terms. Where a current listing snapshot is available, it has its own timestamp; otherwise the historical record stays visibly dated.",
        },
      ],
    },
    {
      slug: "methodology",
      title: "How We Evaluate Products",
      dek: "The comparison process behind our roundups, buying notes, decision factors, and buying checklists.",
      sections: [
        {
          heading: "We start with the use case",
          body: "A product can be popular and still be wrong for a specific home. We start by defining the job: the room, routine, user, pet, baby, device, or storage constraint the product is supposed to handle.",
        },
        {
          heading: "We separate benefits from checks",
          body: "Every recommendation needs both sides: where it wins and what to verify. That is why our pages call out size, compatibility, accessories, subscriptions, replacement parts, return windows, and setup limits.",
        },
        {
          heading: "We label the evidence behind each page",
          body: "Hands-on review means we used the product ourselves and can describe that direct experience. Independent evidence synthesis compares attributed third-party tests while preserving each source's setup, result, and limitations. Official-spec research guide means the decision is based on manufacturer documentation and verified compatibility sources, without claiming hands-on testing.",
        },
        {
          heading: "Different test environments stay separate",
          body: "Router placement, walls, clients, firmware, pack size, backhaul, room conditions, and test methods can change results. We do not average incompatible benchmarks into a made-up score. Conflicting model, port, bundle, or hardware-version details are shown as a checkout risk to resolve.",
        },
        {
          heading: "Decision factors, not star ratings",
          body: `Our decision factors show what to compare for the stated use case without assigning unsupported numeric ratings. Before buying, readers should still confirm ${checkoutSource(site)}, exact version, price, availability, shipping, and current return terms.`,
        },
        {
          heading: "A repeatable research record",
          body: "Start with the exact question and model. Record the manufacturer source, hardware generation, region, included parts and the date of the evidence. Compare the alternatives under the same task and name any missing fact. A dimensional worksheet compares the measurements supplied by the reader; it cannot certify a load rating, safe installation, comfort or compatibility that the exact manufacturer has not documented.",
        },
      ],
    },
    {
      slug: "editorial-policy",
      title: "Editorial Policy",
      dek: "How we write, update, and correct buying guides across this site.",
      sections: [
        {
          heading: "Accuracy comes before volume",
          body: "We prefer fewer pages with clear buying logic over large batches of thin product summaries. Pages are updated when product links, model names, compatibility notes, or category assumptions change.",
        },
        {
          heading: "AI-assisted, human-directed",
          body: "Drafting and organization may use AI assistance, but pages are shaped around product facts, buyer questions, and editorial review. We avoid claims that imply lab testing or ownership unless that is explicitly true.",
        },
        {
          heading: "Corrections",
          body: "If a product name, link, version, image, or compatibility note looks wrong, we treat that as a correction priority because it can affect the buying decision.",
        },
        {
          heading: "What changes an update date",
          body: "A new source, corrected specification, revised comparison, changed compatibility finding or substantial new tool can justify an article update. Layout, navigation and distribution changes do not renew the underlying product evidence. A failed retailer check remains unconfirmed; it does not become a successful check through a page rebuild.",
        },
      ],
    },
    {
      slug: "affiliate-disclosure",
      title: "Affiliate Disclosure",
      dek: "How affiliate links work and how commissions affect the site.",
      sections: [
        {
          heading: "Commission disclosure",
          body: site.disclosure,
        },
        {
          heading: "How links are handled",
          body: site.key === "baby"
              ? "Commissioned purchase buttons may send readers to Amazon or, for an explicitly authorized and verified product, through the dedicated Baby promotional-property PID to Bc Babycare via CJ. CJ buttons first create an opaque local attribution record and are limited to an exact merchant, product, PID, AID, and destination allowlist. Prices, coupons, shipping, stock, seller details, variants, and return windows can change, so the final retailer listing remains the checkout source."
            : "Commissioned purchase buttons currently send readers only to Amazon. Prices, coupons, shipping, stock, seller details, and return windows can change after publication, so the Amazon listing is the final source before ordering.",
        },
        {
          heading: "Editorial independence",
          body: "A commission can support the site, but it does not remove the need to show trade-offs, alternatives, and skip-it cases. Pages should still help readers avoid buying the wrong product.",
        },
      ],
    },
    {
      slug: "privacy",
      title: "Privacy and Cookies",
      dek: `How ${site.name} handles contact messages, basic usage data, cookies, and retailer links.`,
      sections: [
        {
          heading: "Information you provide",
          body: "If you email us or submit a correction, we may receive the contact details and message you choose to provide. We use that information to respond, investigate the issue, protect the site, and maintain accurate buying notes. Please do not send passwords, payment details, private keys, or other sensitive information in a correction email.",
        },
        {
          heading: "Site usage and cookies",
          body: `The site may process basic technical and usage information needed for security, reliability, measurement, and performance. Microsoft Clarity may record interaction signals such as page visits, scrolling, clicks, device details, and session replays so we can identify usability problems. ${site.key === "baby" ? "Amazon, CJ, and Bc Babycare may use cookies or similar technologies for affiliate attribution when their respective links are followed." : "Amazon may also use cookies or similar technologies for affiliate attribution."} Third-party services apply their own privacy policies and cookie controls.`,
        },
        {
          heading: "Shopping-path measurement",
          body: "We use a random identifier in tab session storage to count content visits, visible shopping buttons and retailer clicks. A session expires after 30 minutes of inactivity. Records include the page path, exact product and merchant, button position, site version, broad device type and referral channel. We do not send calculator answers, form values, full referring URLs or search terms to this measurement system. You can clear tab storage through your browser controls.",
        },
        {
          heading: "Affiliate and external links",
          body: "When you follow a retailer link, the destination may set its own cookies or record the visit for attribution. Prices, inventory, seller information, checkout, and account handling belong to the retailer. Review the destination site's privacy policy before completing a purchase or submitting personal information.",
        },
        {
          heading: "Your choices and contact",
          body: "You can use browser settings to limit cookies and can contact 15797688584@163.com with a privacy question about a message you sent us. We may update this page when the site's analytics, affiliate relationships, or legal requirements change.",
        },
      ],
    },
    {
      slug: "contact",
      title: "Contact",
      dek: `Questions, corrections, and product-link issues for ${site.name}.`,
      sections: [
        {
          heading: "Corrections and feedback",
          body: "For product corrections, include the page URL, the product name, and what looks outdated or mismatched. Version changes, broken links, image mismatches, and incorrect compatibility notes are the most useful reports.",
        },
        {
          heading: "Affiliate and product inquiries",
          body: site.key === "baby"
              ? "We may review products that fit the site's categories, but coverage is not guaranteed. Useful pitches include the exact model, Amazon ASIN or authorized CJ link identity, retailer URL, age and weight guidance, key specs, care details, replacement-part information, and who the product is best for."
            : "We may review products that fit the site's categories, but coverage is not guaranteed. Useful pitches include the exact model, Amazon ASIN or retailer URL, key specs, replacement-part information, and who the product is best for.",
        },
        {
          heading: "Email",
          body: "Contact: 15797688584@163.com",
        },
      ],
    },
  ];
}

export function findStaticPage(site: SiteConfig, slug: string) {
  return getStaticPages(site).find((page) => page.slug === slug);
}

import type { Prisma } from "../generated/prisma/client";

type ProductIdentity = { title: string; productType?: string | null; slug?: string };

// Decorative contact lenses are medical devices, not costume pigments. This
// publication has no verified prescription/eye-fitting purchase pathway.
export function costumeProductRequiresEyeCare(product: ProductIdentity) {
  return [product.title, product.productType, product.slug].some((value) =>
    value && /\bcontact[\s-]*lens(?:es)?\b/i.test(value),
  );
}

// Apply before pagination so held records cannot displace ordinary products or
// inflate the browsable result count. The identity guard also runs after reads.
export function costumeGeneralCommerceWhere(): Prisma.MerchantProductWhereInput {
  const contains = (fields: string[]) => fields.flatMap((field) =>
    ["contact lens", "contact-lens", "contactlens"].map((term) => ({
      [field]: { contains: term, mode: "insensitive" as const },
    })),
  );
  return {
    AND: [
      { NOT: { OR: contains(["title", "slug"]) } },
      // A nullable product type must not turn NOT(contains(...)) into SQL NULL
      // and silently hide otherwise eligible wigs, garments or props.
      { OR: [{ productType: null }, { NOT: { OR: contains(["productType"]) } }] },
    ],
  };
}

export const costumeEyeCareSource = "https://www.fda.gov/medical-devices/contact-lenses/decorative-contact-lenses-halloween-and-more";
export const costumeEyeCareNote = "Decorative contact lenses need an eye-care professional’s prescription, fitting and instructions. We have not verified a suitable prescription purchase pathway for this listing, so its shopping link is paused. A costume photo or merchant care sheet does not establish individual fit.";

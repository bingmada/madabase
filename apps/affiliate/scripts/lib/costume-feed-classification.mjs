// Feed descriptions may describe several variants. Only explicit selected
// option fields establish the transaction for the imported record.
export function costumeFeedTransaction(row) {
  const values = ["rent_or_buy", "transaction", "purchase_type", "variant_title", "option1", "option2", "option3", "size"]
    .flatMap((key) => String(row[key] ?? "").split(/\s*[\/|]\s*/))
    .map((value) => value.trim().toLowerCase());
  const rent = values.some((value) => value === "rent" || value === "rental");
  const buy = values.some((value) => value === "buy" || value === "purchase");
  return rent && buy ? "conflict" : rent ? "rent" : buy ? "buy" : "unknown";
}

export function classifyCostumeFeedProduct(title, productType, description) {
  const primary = `${title} ${productType}`.toLowerCase();
  const declaredType = productType.toLowerCase();
  const secondary = description.toLowerCase();
  // A complete garment can include a mask. Accessory phrases such as
  // "costume mask" and "mask for an adult costume" do not imply a garment.
  const roleTitle = title.split(/\s+for\s+/i)[0]
    .replace(/\b(?:costume|dress[ -]?up)\s+(?=(?:masks?|wigs?)\b)/gi, "");
  const garmentType = /\bcostumes?\b/.test(declaredType)
    && !/\b(masks?|accessories|prosthetics?)\b/.test(declaredType);
  if (/\b(props?|animatronic|decoration)\b/.test(declaredType) || /^gore$/i.test(declaredType)) return "props-animatronics";
  if (garmentType) return "costumes";
  if (/\b(wigs?|makeup|make-up|cosmetic|facial hair)\b/.test(declaredType)) return "wigs-makeup";
  if (/\b(mask|prosthetic|appliance|fangs?|teeth)\b/.test(declaredType)) return "masks-prosthetics";
  if (/\b(costume|dress|jacket|coat|suit|robe|tights|corset|catsuit|mascot|uniform)\b/i.test(roleTitle)) return "costumes";
  if (/\b(prop|animatronic|animated|weapon|sword|axe|skeleton|statue|figure|decoration)\b/.test(primary)) return "props-animatronics";
  if (/\b(mask|prosthetic|appliance|fangs?|teeth|latex mask)\b/.test(primary)) return "masks-prosthetics";
  if (/\b(wig|facial hair|makeup|make-up|cosmetic|eyelash|beard|moustache|mustache|face paint)\b/.test(primary)) return "wigs-makeup";
  if (/\b(prosthetic|wig|makeup|facial hair)\b/.test(secondary)) return /\bprosthetic\b/.test(secondary) ? "masks-prosthetics" : "wigs-makeup";
  return "accessories-party-effects";
}

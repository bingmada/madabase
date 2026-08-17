const leadingMethodologyPatterns = [
  /^We (?:have not|haven't|did not|do not)[^.]*\.\s*/i,
  /^This (?:page|guide|review|assessment) (?:uses|compares|combines|draws on|is based on)[^.]*\.\s*/i,
  /^This is (?:an? )?(?:research-based|research synthesis|official-spec|specification-led|retailer-evidence|retailer-feedback)[^.]*\.\s*/i,
];

export function buyerFacingBody(value: string) {
  let result = value.trim();

  for (let pass = 0; pass < 3; pass += 1) {
    const previous = result;
    for (const pattern of leadingMethodologyPatterns) {
      result = result.replace(pattern, "").trimStart();
    }
    if (result === previous) break;
  }

  return result || value;
}

export function buyerFacingSummary(value: string) {
  return value
    .replace(/^A research-based buying guide to /i, "A practical guide to ")
    .replace(/^A research-based guide to /i, "A practical guide to ")
    .replace(/^A research-based look at /i, "A practical look at ")
    .replace(/^A research-based /i, "A practical ");
}

export function buyerFacingHeading(value: string) {
  if (/^What (?:live |real )?(?:customer|retailer|owner).*(?:feedback|reviews)/i.test(value)) {
    return "Daily-use strengths and trade-offs";
  }
  if (/^What owners are asking$/i.test(value)) return "Questions to answer before buying";
  return value;
}

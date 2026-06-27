export const premiumFeatures = {
  remove_ads: false,
  large_file: false,
  export: false,
} as const;

export type PremiumFeature = keyof typeof premiumFeatures;

export function isPremium(feature: PremiumFeature) {
  return premiumFeatures[feature];
}

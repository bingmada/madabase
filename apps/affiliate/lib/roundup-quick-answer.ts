import type { Product } from "./types";

type RoundupPick = Pick<Product, "name" | "bestFor" | "cons" | "offers">;

export function defaultRoundupQuickAnswer(intent: string, picks: Array<RoundupPick | undefined>) {
  const firstPick = picks.find((pick): pick is RoundupPick => Boolean(pick));
  if (!firstPick) return intent;
  if (!firstPick.offers.length) {
    return `No purchase link is offered here for ${firstPick.name}. Compare the model-specific conditions below; another model’s specifications do not establish its fit. Keep suitable existing equipment when it already meets the need.`;
  }
  return `Start with ${firstPick.name} if your main need is ${firstPick.bestFor.toLowerCase()}. Compare the trade-offs before buying, especially ${firstPick.cons[0].toLowerCase()}.`;
}

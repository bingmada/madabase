import data from "../config/reviewed-roundup-content.json";
import type { Roundup } from "./types";

const repairs = data as Record<string,Partial<Roundup>>;
export function applyReviewedRoundupContent(roundup: Roundup): Roundup {
  const repair = repairs[`${roundup.site}:${roundup.slug}`];
  return repair ? {...roundup,...repair,updatedAt:"October 22, 2026"} : roundup;
}

import { describe, expect, it } from "vitest";
import { getAllSlugs, getRelatedTools } from "../tool-registry";
import { isPhaseOneSunsetTool, phaseOneSunsetToolSlugs } from "../tool-sunset";

describe("phase-one tool sunset", () => {
  it("keeps the reviewed cohort explicit and out of discoverable slugs", () => {
    expect(phaseOneSunsetToolSlugs.size).toBe(20);
    expect(getAllSlugs().filter(isPhaseOneSunsetTool)).toEqual([]);
  });

  it("does not recommend sunset tools from active tool pages", () => {
    expect(getRelatedTools("regex-tester").some((tool) => isPhaseOneSunsetTool(tool.slug))).toBe(false);
    expect(getRelatedTools("markdown-preview").some((tool) => isPhaseOneSunsetTool(tool.slug))).toBe(false);
  });
});

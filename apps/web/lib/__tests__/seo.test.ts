import { describe, expect, it } from "vitest";
import { buildHreflangAlternates, buildLocaleCanonical, buildPageMetadata } from "../seo";

describe("SEO URL normalization", () => {
  it("uses the non-trailing-slash locale root served by production", () => {
    expect(buildLocaleCanonical("en", "/")).toBe("/en");
    expect(buildLocaleCanonical("zh", "/")).toBe("/zh");

    const alternates = buildHreflangAlternates("/", "en");
    expect(alternates.canonical).toBe("https://madabase.com/en");
    expect(alternates.languages.en).toBe("https://madabase.com/en");
    expect(alternates.languages.zh).toBe("https://madabase.com/zh");
  });

  it("preserves canonical paths below a locale root", () => {
    const metadata = buildPageMetadata({
      title: "JSON Formatter",
      description: "Format and validate JSON in the browser.",
      locale: "en",
      path: "/tools/json-formatter",
    });

    expect(metadata.alternates?.canonical).toBe("https://madabase.com/en/tools/json-formatter");
  });
});

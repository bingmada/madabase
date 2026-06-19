import { describe, expect, it } from "vitest";
import {
  addCenterImageToSvg,
  binaryToText,
  caseReport,
  cleanWhitespace,
  csvToJson,
  dedupeLines,
  decodeBase64,
  decodeUrlComponent,
  encodeBase64,
  encodeUrlComponent,
  extractEmails,
  extractNumbers,
  extractUrls,
  formatCss,
  formatHtml,
  formatJavascript,
  formatJson,
  formatSql,
  formatYaml,
  hexToText,
  jsonToCsv,
  jsonToYaml,
  loremIpsum,
  markdownToText,
  minifyJson,
  parseUrlParts,
  readingTime,
  removeEmptyLines,
  runRegexTest,
  sortLines,
  stripHtml,
  textStats,
  textStatsReport,
  textToBinary,
  textToHex,
  tomlToJson,
  unicodeEscape,
  unicodeUnescape,
  yamlToJson,
} from "../tool-transforms";

describe("tool transforms", () => {
  it("formats and minifies JSON", () => {
    const messy = '{"name":"Madabase","items":[1,true]}';
    expect(formatJson(messy)).toBe('{\n  "name": "Madabase",\n  "items": [\n    1,\n    true\n  ]\n}');
    expect(minifyJson(formatJson(messy))).toBe(messy);
    expect(() => formatJson("{bad")).toThrow();
  });

  it("encodes and decodes unicode-safe Base64", () => {
    const value = "Madabase 工具";
    expect(decodeBase64(encodeBase64(value))).toBe(value);
  });

  it("encodes and decodes URL components", () => {
    const value = "https://madabase.com/tools/json formatter?query=hello world";
    expect(decodeUrlComponent(encodeUrlComponent(value))).toBe(value);
  });

  it("parses URL parts", () => {
    const parsed = JSON.parse(parseUrlParts("https://madabase.com/en/tools/json-formatter?ref=seo#faq"));
    expect(parsed).toMatchObject({
      protocol: "https:",
      hostname: "madabase.com",
      pathname: "/en/tools/json-formatter",
      search: "?ref=seo",
      hash: "#faq",
    });
  });

  it("embeds a center image into QR SVG output", () => {
    const svg = '<svg width="196" height="196" viewBox="0 0 196 196"><path d="M0 0h196v196H0z"/></svg>';
    const output = addCenterImageToSvg(svg, "data:image/png;base64,abc");
    expect(output).toContain("<rect");
    expect(output).toContain('<image href="data:image/png;base64,abc"');
    expect(output).toContain('preserveAspectRatio="xMidYMid meet"');
  });

  it("converts quoted CSV to JSON and escapes JSON to CSV", async () => {
    const output = JSON.parse(await csvToJson('name,note\nAda,"Engineer, platform"\nLin,"Said ""hi"""'));
    expect(output).toEqual([
      { name: "Ada", note: "Engineer, platform" },
      { name: "Lin", note: 'Said "hi"' },
    ]);
    expect(await jsonToCsv(JSON.stringify(output))).toContain('"Engineer, platform"');
  });

  it("uses real YAML and TOML parsers", async () => {
    expect(JSON.parse(await yamlToJson("name: Madabase\ntools:\n  - JSON\n  - SQL"))).toEqual({
      name: "Madabase",
      tools: ["JSON", "SQL"],
    });
    expect(await jsonToYaml('{"name":"Madabase","tools":["JSON","SQL"]}')).toContain("- JSON");
    expect(JSON.parse(await tomlToJson('name = "Madabase"\n[limits]\ndaily = 10'))).toEqual({
      name: "Madabase",
      limits: { daily: 10 },
    });
    expect(await formatYaml("name: Madabase\ntools: [JSON, SQL]")).toContain("- JSON");
  });

  it("formats SQL with a mature formatter", async () => {
    const output = await formatSql("select id,name from users where status='active' order by created_at desc");
    expect(output).toContain("SELECT");
    expect(output).toContain("FROM");
    expect(output).toContain("users");
    expect(output).toContain("WHERE");
    expect(output).toContain("'active'");
  });

  it("formats HTML, CSS, and JavaScript with Prettier", async () => {
    await expect(formatHtml("<main><h1>Madabase</h1><p>Tools</p></main>")).resolves.toContain("<main>");
    await expect(formatCss("body{margin:0;color:#111827}.card{padding:16px}")).resolves.toContain("body {");
    await expect(formatJavascript("const tools=['json','jwt'];tools.forEach(tool=>console.log(tool));")).resolves.toContain(
      "const tools =",
    );
  });

  it("runs regex with capture groups and replacement preview", () => {
    const result = runRegexTest("(json)", "i", "JSON tools and json docs", "data");
    expect(result.matches).toHaveLength(2);
    expect(result.output).toContain("group 1: JSON");
    expect(result.output).toContain("Replacement preview:\ndata tools and data docs");
  });

  it("supports text toolbox statistics and cleanup", () => {
    const stats = textStats("one two\nthree");
    expect(stats.words).toBe(3);
    expect(stats.lines).toBe(2);
    expect(textStatsReport("one two")).toContain("Words: 2");
    expect(cleanWhitespace("  one   two\n\nthree ")).toBe("one two three");
    expect(caseReport("madabase tools")).toContain("Title Case: Madabase Tools");
    expect(stripHtml("<article><h1>Madabase</h1><p>Tools</p></article>")).toBe("Madabase Tools");
    expect(markdownToText("# Title\n\nUse **tools** with [links](https://example.com).")).toBe("Title Use tools with links.");
    expect(readingTime("one two three")).toBe("1 min read");
    expect(loremIpsum(2).split("\n\n")).toHaveLength(2);
  });

  it("localizes text toolbox reports for Chinese users", () => {
    const report = textStatsReport("这是中文内容。\nMadabase tools", "zh");
    expect(report).toContain("词数（英文按词、中文按字）");
    expect(report).toContain("中文/CJK 字符");
    expect(caseReport("madabase tools", "zh")).toContain("标题格式: Madabase Tools");
    expect(readingTime("这是中文内容", "zh")).toBe("预计阅读时间：1 分钟");
  });

  it("supports list and extractor toolbox operations", () => {
    expect(sortLines("banana\napple\ncarrot")).toBe("apple\nbanana\ncarrot");
    expect(dedupeLines("api\njson\napi")).toBe("api\njson");
    expect(removeEmptyLines("a\n\n b \n")).toBe("a\n b ");
    expect(extractEmails("a@b.com and team@example.dev")).toBe("a@b.com\nteam@example.dev");
    expect(extractUrls("Visit https://madabase.com and http://example.com.")).toBe("https://madabase.com\nhttp://example.com");
    expect(extractNumbers("A-10 B 2.5")).toBe("-10\n2.5");
    expect(extractEmails("没有邮箱", "zh")).toBe("未找到邮箱地址。");
  });

  it("supports encoding toolbox operations", () => {
    expect(unicodeUnescape(unicodeEscape("Mada"))).toBe("Mada");
    expect(hexToText(textToHex("Madabase 工具"))).toBe("Madabase 工具");
    expect(binaryToText(textToBinary("Mada"))).toBe("Mada");
    expect(() => hexToText("abc")).toThrow();
    expect(() => binaryToText("101")).toThrow();
  });
});

import type { Locale } from "@/lib/i18n";

export type LocalizedText = string | Record<Locale, string>;

export function localizeText(value: LocalizedText, locale: Locale) {
  if (typeof value !== "string") return value[locale];
  if (locale !== "zh") return value;
  return zhPhraseMap[value] ?? value;
}

const zhPhraseMap: Record<string, string> = {
  Input: "输入",
  Output: "输出",
  Text: "文本",
  Lines: "多行文本",
  CSV: "CSV",
  JSON: "JSON",
  "JSON array": "JSON 数组",
  "JSON object": "JSON 对象",
  "Simple YAML": "简单 YAML",
  "Simple TOML": "简单 TOML",
  "YAML-like output": "YAML 输出",
  ".env content": ".env 内容",
  "Query string": "查询字符串",
  "Parsed query": "查询解析结果",
  "HTTP headers": "HTTP 请求头",
  "JSON headers": "请求头 JSON",
  "User agent": "User Agent",
  "UA summary": "UA 摘要",
  "Unicode escaped text": "Unicode 转义文本",
  "Unicode escaped": "Unicode 转义结果",
  Hex: "Hex",
  Binary: "二进制",
  HTML: "HTML",
  Markdown: "Markdown",
  "Plain text": "纯文本",
  "Sorted lines": "排序结果",
  "Unique lines": "去重结果",
  "Cleaned text": "清理结果",
  "Normalized text": "规范化文本",
  "Line comparison": "行对比结果",
  Emails: "邮箱列表",
  URLs: "URL 列表",
  Numbers: "数字列表",
  "Reading time": "阅读时间",
  "Article text": "文章内容",
  "Paragraph count": "段落数量",
  "Generated text": "生成文本",
  "Randomized lines": "随机结果",
  "Paste text here": "在这里粘贴文本",
  "Left text, then --- then right text": "左侧文本，然后用 --- 分隔右侧文本",
};

export function toolCopy(locale: Locale) {
  return {
    input: locale === "zh" ? "输入" : "Input",
    output: locale === "zh" ? "输出" : "Output",
    run: locale === "zh" ? "运行" : "Run",
    generate: locale === "zh" ? "生成" : "Generate",
    reset: locale === "zh" ? "重置" : "Reset",
    copy: locale === "zh" ? "复制" : "Copy",
    copied: locale === "zh" ? "已复制" : "Copied",
    download: locale === "zh" ? "下载" : "Download",
    done: locale === "zh" ? "已完成。" : "Done.",
    unable: locale === "zh" ? "无法处理输入。" : "Unable to process input.",
  };
}

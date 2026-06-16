import type { Locale } from "./i18n";
import { expandedToolRegistry } from "./expanded-tool-registry";

export type ToolComponentName =
  | "JsonFormatter"
  | "JsonValidator"
  | "JsonToTypescript"
  | "JwtDecoder"
  | "UuidGenerator"
  | "Base64Tool"
  | "UrlEncoder"
  | "TimestampConverter"
  | "MarkdownPreview"
  | "HtmlFormatter"
  | "JsonDiff"
  | "JsonEscape"
  | "YamlFormatter"
  | "XmlFormatter"
  | "SqlFormatter"
  | "RegexTester"
  | "CronGenerator"
  | "HashGenerator"
  | "ColorConverter"
  | "PasswordGenerator"
  | "WordCounter"
  | "CharacterCounter"
  | "CaseConverter"
  | "TextCleaner"
  | "SlugGenerator"
  | "QrCodeGenerator"
  | "HtmlEncoder"
  | "CssFormatter"
  | "JsFormatter"
  | "UrlParser"
  | "GenericTextTool";

export type ToolCategory = "developer" | "ai" | "text" | "web" | "creator";

export type ToolRegistryEntry = {
  slug: string;
  component: ToolComponentName;
  category: ToolCategory;
  popular?: boolean;
  relatedTools: string[];
  keywords: string[];
  h1: Record<Locale, string>;
  description: Record<Locale, string>;
};

// Registry with display info for SSR
const baseToolRegistry: ToolRegistryEntry[] = [
  { slug: "json-formatter", component: "JsonFormatter", category: "developer", popular: true, relatedTools: ["json-validator", "json-to-typescript", "json-diff"], keywords: ["json formatter", "json beautifier", "format json online"], h1: { en: "Online JSON Formatter", zh: "在线JSON 格式化工具" }, description: { en: "Format, minify, and validate JSON instantly in your browser.", zh: "在浏览器中快速格式化、压缩并校验 JSON。" } },
  { slug: "json-validator", component: "JsonValidator", category: "developer", popular: true, relatedTools: ["json-formatter", "json-diff", "json-escape"], keywords: ["json validator", "json lint", "validate json"], h1: { en: "Online JSON Validator", zh: "在线JSON 校验器" }, description: { en: "Validate JSON and surface syntax errors with useful hints.", zh: "校验 JSON 并展示有用的语法错误提示。" } },
  { slug: "json-to-typescript", component: "JsonToTypescript", category: "developer", popular: true, relatedTools: ["json-formatter", "json-validator", "js-formatter"], keywords: ["json to typescript", "typescript interface generator"], h1: { en: "JSON to TypeScript Interface Generator", zh: "JSON 转 TypeScript Interface 工具" }, description: { en: "Generate TypeScript interfaces from JSON samples.", zh: "从 JSON 示例自动生成 TypeScript Interface。" } },
  { slug: "jwt-decoder", component: "JwtDecoder", category: "developer", popular: true, relatedTools: ["base64", "json-formatter", "json-validator"], keywords: ["jwt decoder", "decode jwt", "jwt parser"], h1: { en: "Online JWT Decoder", zh: "在线JWT 解码器" }, description: { en: "Decode JWT header and payload instantly.", zh: "快速解码 JWT 的 Header 与 Payload。" } },
  { slug: "uuid-generator", component: "UuidGenerator", category: "developer", relatedTools: ["password-generator", "hash-generator", "timestamp"], keywords: ["uuid generator", "uuid v4"], h1: { en: "Online UUID Generator", zh: "在线UUID 生成器" }, description: { en: "Generate secure UUIDs in one click.", zh: "一键生成安全的 UUID。" } },
  { slug: "base64", component: "Base64Tool", category: "developer", popular: true, relatedTools: ["jwt-decoder", "url-encoder", "html-encoder"], keywords: ["base64 encode", "base64 decode"], h1: { en: "Online Base64 Encoder and Decoder", zh: "在线 Base64 编码解码工具" }, description: { en: "Encode and decode Base64 text in the browser.", zh: "在浏览器中进行 Base64 编码和解码。" } },
  { slug: "url-encoder", component: "UrlEncoder", category: "web", relatedTools: ["url-parser", "base64", "slug-generator"], keywords: ["url encode", "url decode"], h1: { en: "Online URL Encoder and Decoder", zh: "在线 URL 编码解码工具" }, description: { en: "Encode and decode URL strings safely.", zh: "安全地对 URL 字符串进行编码与解码。" } },
  { slug: "timestamp", component: "TimestampConverter", category: "developer", popular: true, relatedTools: ["cron-generator", "uuid-generator", "json-formatter"], keywords: ["timestamp converter", "unix timestamp converter"], h1: { en: "Online Timestamp Converter", zh: "在线时间戳转换器" }, description: { en: "Convert Unix timestamps to human-readable dates.", zh: "将 Unix 时间戳转换为可读日期。" } },
  { slug: "markdown-preview", component: "MarkdownPreview", category: "creator", relatedTools: ["word-counter", "character-counter", "html-formatter"], keywords: ["markdown preview", "markdown editor online"], h1: { en: "Online Markdown Preview", zh: "在线Markdown 预览工具" }, description: { en: "Preview Markdown content in real time.", zh: "实时预览 Markdown 内容。" } },
  { slug: "html-formatter", component: "HtmlFormatter", category: "web", relatedTools: ["html-encoder", "css-formatter", "js-formatter"], keywords: ["html formatter", "html beautifier"], h1: { en: "Online HTML Formatter", zh: "在线HTML 格式化工具" }, description: { en: "Beautify and format HTML instantly.", zh: "即时美化与格式化 HTML。" } },
  { slug: "json-diff", component: "JsonDiff", category: "developer", relatedTools: ["json-formatter", "json-validator", "json-escape"], keywords: ["json diff", "compare json online"], h1: { en: "Online JSON Diff", zh: "在线JSON 差异对比工具" }, description: { en: "Compare two JSON documents and inspect differences.", zh: "比较两个 JSON 文档并查看差异。" } },
  { slug: "json-escape", component: "JsonEscape", category: "developer", relatedTools: ["json-formatter", "json-validator", "base64"], keywords: ["json escape", "escape json string"], h1: { en: "Online JSON Escape Tool", zh: "在线JSON 转义工具" }, description: { en: "Escape JSON strings for code, logs, and payloads.", zh: "转义 JSON 字符串，适用于代码、日志和请求体。" } },
  { slug: "yaml-formatter", component: "YamlFormatter", category: "developer", relatedTools: ["json-formatter", "xml-formatter", "sql-formatter"], keywords: ["yaml formatter", "format yaml online"], h1: { en: "Online YAML Formatter", zh: "在线YAML 格式化工具" }, description: { en: "Format YAML for cleaner configs and manifests.", zh: "整理 YAML 配置，让结构更清晰。" } },
  { slug: "xml-formatter", component: "XmlFormatter", category: "web", relatedTools: ["html-formatter", "yaml-formatter", "json-formatter"], keywords: ["xml formatter", "xml beautifier"], h1: { en: "Online XML Formatter", zh: "在线XML 格式化工具" }, description: { en: "Beautify XML for feeds, configs, and API payloads.", zh: "美化 XML，适合接口、订阅和配置内容。" } },
  { slug: "sql-formatter", component: "SqlFormatter", category: "developer", relatedTools: ["json-formatter", "yaml-formatter", "regex-tester"], keywords: ["sql formatter", "sql beautifier"], h1: { en: "Online SQL Formatter", zh: "在线SQL 格式化工具" }, description: { en: "Format SQL queries for readability and review.", zh: "格式化 SQL 查询，提高可读性。" } },
  { slug: "regex-tester", component: "RegexTester", category: "developer", popular: true, relatedTools: ["word-counter", "text-cleaner", "slug-generator"], keywords: ["regex tester", "regular expression tester"], h1: { en: "Online Regex Tester", zh: "在线正则测试工具" }, description: { en: "Test regular expressions against sample text.", zh: "对示例文本测试正则表达式。" } },
  { slug: "cron-generator", component: "CronGenerator", category: "developer", relatedTools: ["timestamp", "regex-tester", "uuid-generator"], keywords: ["cron generator", "cron expression generator"], h1: { en: "Online Cron Generator", zh: "在线Cron 表达式生成器" }, description: { en: "Generate cron expressions for scheduled jobs.", zh: "生成定时任务 cron 表达式。" } },
  { slug: "hash-generator", component: "HashGenerator", category: "developer", relatedTools: ["password-generator", "uuid-generator", "base64"], keywords: ["hash generator", "text hash generator"], h1: { en: "Online Hash Generator", zh: "在线哈希生成器" }, description: { en: "Generate a simple hash from plain text.", zh: "从文本生成简单哈希值。" } },
  { slug: "color-converter", component: "ColorConverter", category: "web", relatedTools: ["css-formatter", "html-formatter", "qr-code-generator"], keywords: ["color converter", "hex to rgb"], h1: { en: "Online Color Converter", zh: "在线颜色转换器" }, description: { en: "Convert color values like HEX to RGB.", zh: "转换颜色值，例如 HEX 转 RGB。" } },
  { slug: "password-generator", component: "PasswordGenerator", category: "developer", popular: true, relatedTools: ["uuid-generator", "hash-generator", "base64"], keywords: ["password generator", "random password generator"], h1: { en: "Online Password Generator", zh: "在线密码生成器" }, description: { en: "Generate strong passwords instantly.", zh: "立即生成强密码。" } },
  { slug: "word-counter", component: "WordCounter", category: "text", relatedTools: ["character-counter", "text-cleaner", "markdown-preview"], keywords: ["word counter", "count words online"], h1: { en: "Online Word Counter", zh: "在线字数统计工具" }, description: { en: "Count words in plain text instantly.", zh: "快速统计文本中的单词数量。" } },
  { slug: "character-counter", component: "CharacterCounter", category: "text", relatedTools: ["word-counter", "text-cleaner", "slug-generator"], keywords: ["character counter", "count characters online"], h1: { en: "Online Character Counter", zh: "在线字符统计工具" }, description: { en: "Count characters in text instantly.", zh: "快速统计文本字符数。" } },
  { slug: "case-converter", component: "CaseConverter", category: "text", relatedTools: ["text-cleaner", "slug-generator", "word-counter"], keywords: ["case converter", "uppercase lowercase converter"], h1: { en: "Online Case Converter", zh: "在线大小写转换工具" }, description: { en: "Convert text to upper, lower, and title case.", zh: "转换为大写、小写和标题格式。" } },
  { slug: "text-cleaner", component: "TextCleaner", category: "text", relatedTools: ["case-converter", "word-counter", "character-counter"], keywords: ["text cleaner", "remove extra spaces"], h1: { en: "Online Text Cleaner", zh: "在线文本清理工具" }, description: { en: "Clean text by removing extra spaces and line noise.", zh: "清理文本中的多余空格和杂乱换行。" } },
  { slug: "slug-generator", component: "SlugGenerator", category: "text", relatedTools: ["url-encoder", "case-converter", "word-counter"], keywords: ["slug generator", "url slug generator"], h1: { en: "Online Slug Generator", zh: "在线URL Slug 生成器" }, description: { en: "Generate clean URL slugs from titles.", zh: "从标题生成干净的 URL slug。" } },
  { slug: "qr-code-generator", component: "QrCodeGenerator", category: "web", popular: true, relatedTools: ["url-parser", "url-encoder", "slug-generator"], keywords: ["qr code generator", "generate qr code online"], h1: { en: "Online QR Code Generator", zh: "在线二维码生成器" }, description: { en: "Generate QR codes for links and text.", zh: "为链接和文本生成二维码。" } },
  { slug: "html-encoder", component: "HtmlEncoder", category: "web", relatedTools: ["html-formatter", "url-encoder", "base64"], keywords: ["html encoder", "escape html online"], h1: { en: "Online HTML Encoder", zh: "在线HTML 实体编码工具" }, description: { en: "Encode HTML entities safely.", zh: "安全编码 HTML 实体。" } },
  { slug: "css-formatter", component: "CssFormatter", category: "web", relatedTools: ["html-formatter", "js-formatter", "color-converter"], keywords: ["css formatter", "css beautifier"], h1: { en: "Online CSS Formatter", zh: "在线CSS 格式化工具" }, description: { en: "Beautify CSS for easier editing and debugging.", zh: "格式化 CSS，便于编辑和调试。" } },
  { slug: "js-formatter", component: "JsFormatter", category: "developer", relatedTools: ["json-formatter", "css-formatter", "html-formatter"], keywords: ["javascript formatter", "js beautifier"], h1: { en: "Online JavaScript Formatter", zh: "在线JavaScript 格式化工具" }, description: { en: "Format JavaScript snippets for readability.", zh: "格式化 JavaScript 片段，提高可读性。" } },
  { slug: "url-parser", component: "UrlParser", category: "web", relatedTools: ["url-encoder", "slug-generator", "qr-code-generator"], keywords: ["url parser", "parse url online"], h1: { en: "Online URL Parser", zh: "在线URL 解析器" }, description: { en: "Parse URLs into protocol, host, path, query, and hash.", zh: "解析 URL 的协议、域名、路径、查询参数和锚点。" } },
];

export const toolRegistry: ToolRegistryEntry[] = [...baseToolRegistry, ...expandedToolRegistry];

export const toolMap = new Map(toolRegistry.map((tool) => [tool.slug, tool]));

export function getRelatedTools(slug: string) {
  const tool = toolMap.get(slug);
  if (!tool) return [];
  return tool.relatedTools.map((relatedSlug) => toolMap.get(relatedSlug)).filter((item): item is ToolRegistryEntry => Boolean(item));
}

export function getPopularTools() {
  return toolRegistry.filter((tool) => tool.popular);
}

export function getToolsByCategory(category: ToolRegistryEntry["category"]) {
  return toolRegistry.filter((tool) => tool.category === category);
}

export function getAllSlugs() {
  return toolRegistry.map((tool) => tool.slug);
}

export function getCategories(): ToolRegistryEntry["category"][] {
  return ["developer", "ai", "text", "web", "creator"];
}

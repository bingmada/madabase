import type { Locale } from "./i18n";

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
  | "UrlParser";

type LocalizedStep = {
  title: string;
  content: string;
};

type LocalizedExample = {
  input: string;
  output: string;
};

export type ToolDefinition = {
  slug: string;
  title: Record<Locale, string>;
  h1: Record<Locale, string>;
  description: Record<Locale, string>;
  seoTitle: Record<Locale, string>;
  seoDescription: Record<Locale, string>;
  intro: Record<Locale, string>;
  howToUse: Record<Locale, LocalizedStep[]>;
  examples: Record<Locale, LocalizedExample[]>;
  faq: Record<Locale, { q: string; a: string }[]>;
  relatedTools: string[];
  category: "developer" | "ai" | "text" | "web" | "creator";
  keywords: string[];
  component: ToolComponentName;
  popular?: boolean;
};

const localFaq = {
  en: { q: "Does this tool upload my input?", a: "No. This tool runs in your browser for the first release, so your input stays local." },
  zh: { q: "这个工具会上传我的输入吗？", a: "不会。第一版工具在浏览器本地运行，你输入的内容会保留在本地。" },
};

function createTool({
  slug,
  component,
  category,
  popular = false,
  relatedTools,
  keywords,
  en,
  zh,
}: {
  slug: string;
  component: ToolComponentName;
  category: ToolDefinition["category"];
  popular?: boolean;
  relatedTools: string[];
  keywords: string[];
  en: {
    title: string;
    h1: string;
    description: string;
    seoTitle: string;
    seoDescription: string;
    intro: string;
    howToUse: LocalizedStep[];
    examples: LocalizedExample[];
    faq?: { q: string; a: string }[];
  };
  zh: {
    title: string;
    h1: string;
    description: string;
    seoTitle: string;
    seoDescription: string;
    intro: string;
    howToUse: LocalizedStep[];
    examples: LocalizedExample[];
    faq?: { q: string; a: string }[];
  };
}): ToolDefinition {
  return {
    slug,
    component,
    category,
    popular,
    relatedTools,
    keywords,
    title: { en: en.title, zh: zh.title },
    h1: { en: en.h1, zh: zh.h1 },
    description: { en: en.description, zh: zh.description },
    seoTitle: { en: en.seoTitle, zh: zh.seoTitle },
    seoDescription: { en: en.seoDescription, zh: zh.seoDescription },
    intro: { en: en.intro, zh: zh.intro },
    howToUse: { en: en.howToUse, zh: zh.howToUse },
    examples: { en: en.examples, zh: zh.examples },
    faq: {
      en: [...(en.faq ?? []), localFaq.en],
      zh: [...(zh.faq ?? []), localFaq.zh],
    },
  };
}

export const toolRegistry: ToolDefinition[] = [
  createTool({
    slug: "json-formatter",
    component: "JsonFormatter",
    category: "developer",
    popular: true,
    relatedTools: ["json-validator", "json-to-typescript", "json-diff"],
    keywords: ["json formatter", "json beautifier", "format json online"],
    en: {
      title: "Free Online JSON Formatter",
      h1: "Free JSON Formatter Online",
      description: "Format, minify, and validate JSON instantly in your browser.",
      seoTitle: "Free JSON Formatter Online",
      seoDescription: "Beautify and minify JSON instantly with a fast, browser-based JSON formatter.",
      intro: "A JSON formatter turns compact data into readable structure so you can debug payloads, APIs, and config files faster.",
      howToUse: [
        { title: "Paste your JSON", content: "Insert raw JSON from an API response, config file, or application log." },
        { title: "Choose format or minify", content: "Beautify JSON for readability or minify it for transport and storage." },
        { title: "Validate before copying", content: "Run validation to catch syntax errors before reusing the output." },
      ],
      examples: [{ input: '{"name":"Madabase","active":true}', output: '{\n  "name": "Madabase",\n  "active": true\n}' }],
      faq: [{ q: "What does JSON Formatter do?", a: "It formats JSON, minifies JSON, and validates syntax locally in the browser." }],
    },
    zh: {
      title: "免费在线 JSON 格式化工具",
      h1: "免费 JSON 格式化工具",
      description: "在浏览器中快速格式化、压缩并校验 JSON。",
      seoTitle: "免费 JSON 格式化工具",
      seoDescription: "快速美化、压缩并校验 JSON，适合调试接口与配置内容。",
      intro: "JSON 格式化工具可以把紧凑数据转成易读结构，方便调试接口返回、配置文件和日志。",
      howToUse: [
        { title: "粘贴 JSON", content: "将接口响应、配置文件或日志里的 JSON 粘贴进输入框。" },
        { title: "选择格式化或压缩", content: "阅读时用格式化，传输或复制时可选择压缩。" },
        { title: "复制前先校验", content: "先检查语法是否正确，再复制输出结果。" },
      ],
      examples: [{ input: '{"name":"Madabase","active":true}', output: '{\n  "name": "Madabase",\n  "active": true\n}' }],
      faq: [{ q: "JSON 格式化工具做什么？", a: "它可以在浏览器本地完成 JSON 格式化、压缩与校验。" }],
    },
  }),
  createTool({
    slug: "json-validator",
    component: "JsonValidator",
    category: "developer",
    popular: true,
    relatedTools: ["json-formatter", "json-diff", "json-escape"],
    keywords: ["json validator", "json lint", "validate json"],
    en: {
      title: "Free Online JSON Validator",
      h1: "Free JSON Validator Online",
      description: "Validate JSON and surface syntax errors with useful hints.",
      seoTitle: "Free JSON Validator Online",
      seoDescription: "Validate JSON instantly and catch syntax problems before your app breaks.",
      intro: "Use a JSON validator to catch missing commas, invalid quotes, or trailing characters before JSON enters your application.",
      howToUse: [
        { title: "Paste JSON input", content: "Add the JSON snippet you want to verify." },
        { title: "Run validation", content: "The tool checks JSON.parse compatibility in your browser." },
        { title: "Fix reported errors", content: "Correct the reported syntax issue and validate again." },
      ],
      examples: [{ input: '{"name":"Madabase",}', output: "Syntax error: trailing comma is not valid JSON" }],
      faq: [{ q: "What errors can it detect?", a: "It detects JSON.parse syntax errors and shows the browser-provided error message." }],
    },
    zh: {
      title: "免费在线 JSON 校验器",
      h1: "免费 JSON 校验器",
      description: "校验 JSON 并展示有用的语法错误提示。",
      seoTitle: "免费 JSON 校验器",
      seoDescription: "快速检查 JSON 语法错误，避免接口、配置或脚本解析失败。",
      intro: "JSON 校验器可以帮助你发现缺少逗号、引号错误或尾部多余字符等常见问题。",
      howToUse: [
        { title: "粘贴 JSON 输入", content: "把需要检查的 JSON 片段放入输入框。" },
        { title: "运行校验", content: "工具会在浏览器中检查 JSON.parse 是否能通过。" },
        { title: "根据提示修复", content: "按错误信息修复语法，再次校验即可。" },
      ],
      examples: [{ input: '{"name":"Madabase",}', output: "语法错误：JSON 不支持尾逗号" }],
      faq: [{ q: "它能发现哪些错误？", a: "它会检测 JSON.parse 能识别的语法错误，并显示浏览器返回的错误信息。" }],
    },
  }),
  createTool({
    slug: "json-to-typescript",
    component: "JsonToTypescript",
    category: "developer",
    popular: true,
    relatedTools: ["json-formatter", "json-validator", "js-formatter"],
    keywords: ["json to typescript", "typescript interface generator"],
    en: {
      title: "JSON to TypeScript Interface Generator",
      h1: "JSON to TypeScript Interface Generator",
      description: "Generate TypeScript interfaces from JSON samples.",
      seoTitle: "JSON to TypeScript Interface Generator",
      seoDescription: "Convert JSON objects into TypeScript interfaces for frontend and backend development.",
      intro: "Generate starter interfaces from sample JSON so you can speed up typing for APIs, DTOs, and UI state models.",
      howToUse: [
        { title: "Paste sample JSON", content: "Use a representative object or payload sample." },
        { title: "Generate the interface", content: "The tool infers primitive values, nested objects, and arrays." },
        { title: "Refine names and optionality", content: "Review the generated types and adjust domain-specific naming." },
      ],
      examples: [{ input: '{"id":1,"name":"Ada"}', output: "interface Root {\n  id: number;\n  name: string;\n}" }],
      faq: [{ q: "Can it infer nested objects?", a: "Yes. The MVP generator creates nested interfaces for object fields and arrays." }],
    },
    zh: {
      title: "JSON 转 TypeScript Interface 工具",
      h1: "JSON 转 TypeScript Interface 工具",
      description: "从 JSON 示例自动生成 TypeScript Interface。",
      seoTitle: "JSON 转 TypeScript Interface 工具",
      seoDescription: "把 JSON 数据结构转换为 TypeScript 接口，适合前后端开发。",
      intro: "通过示例 JSON 生成类型定义，可以更快完成 API 类型、DTO 和页面状态建模。",
      howToUse: [
        { title: "粘贴示例 JSON", content: "使用有代表性的对象或接口返回数据。" },
        { title: "生成接口", content: "工具会推断基础类型、嵌套对象和数组。" },
        { title: "按业务调整", content: "生成后可以继续修改命名和可选字段。" },
      ],
      examples: [{ input: '{"id":1,"name":"Ada"}', output: "interface Root {\n  id: number;\n  name: string;\n}" }],
      faq: [{ q: "可以识别嵌套对象吗？", a: "可以。MVP 版本会为对象字段和数组生成嵌套接口。" }],
    },
  }),
  createTool({
    slug: "jwt-decoder",
    component: "JwtDecoder",
    category: "developer",
    popular: true,
    relatedTools: ["base64", "json-formatter", "json-validator"],
    keywords: ["jwt decoder", "decode jwt", "jwt parser"],
    en: {
      title: "Free Online JWT Decoder",
      h1: "Free JWT Decoder Online",
      description: "Decode JWT header and payload instantly.",
      seoTitle: "Free JWT Decoder Online",
      seoDescription: "Decode JWT tokens safely in the browser and inspect headers, claims, and expiration times.",
      intro: "JWT decoding helps you inspect claims like exp, iss, sub, and custom fields without sending your token to a server.",
      howToUse: [
        { title: "Paste the token", content: "Insert the complete JWT string into the decoder." },
        { title: "Review header and payload", content: "Inspect algorithms, expiration time, issuer, and custom claims." },
        { title: "Verify separately", content: "Use this decoder for reading only; signature verification should happen in your auth stack." },
      ],
      examples: [{ input: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMifQ.signature", output: '{\n  "sub": "123"\n}' }],
      faq: [{ q: "Does this verify the signature?", a: "No. It decodes the token for inspection only and does not verify signatures." }],
    },
    zh: {
      title: "免费在线 JWT 解码器",
      h1: "免费 JWT 解码器",
      description: "快速解码 JWT 的 Header 与 Payload。",
      seoTitle: "免费 JWT 解码器",
      seoDescription: "在浏览器中安全解码 JWT，查看头信息、声明和过期时间。",
      intro: "JWT 解码适合查看 exp、iss、sub 和自定义字段，无需把 token 发到服务端。",
      howToUse: [
        { title: "粘贴 Token", content: "把完整 JWT 字符串放入解码器。" },
        { title: "查看 Header 和 Payload", content: "检查算法、过期时间、签发方和自定义声明。" },
        { title: "签名需单独校验", content: "这个工具只做查看用途，签名校验应在认证系统中完成。" },
      ],
      examples: [{ input: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMifQ.signature", output: '{\n  "sub": "123"\n}' }],
      faq: [{ q: "它会校验签名吗？", a: "不会。它只用于解码查看内容，不做签名校验。" }],
    },
  }),
  createTool({ slug: "uuid-generator", component: "UuidGenerator", category: "developer", relatedTools: ["password-generator", "hash-generator", "timestamp"], keywords: ["uuid generator", "uuid v4"], en: { title: "Free Online UUID Generator", h1: "Free UUID Generator Online", description: "Generate secure UUIDs in one click.", seoTitle: "Free UUID Generator Online", seoDescription: "Generate UUID v4 values instantly for apps, tests, and temporary identifiers.", intro: "UUID generators are useful when you need collision-resistant IDs for testing, records, links, and mock data.", howToUse: [{ title: "Generate a UUID", content: "Click generate to create a new browser-side UUID." }, { title: "Copy the result", content: "Use it in mock data, database records, or testing flows." }, { title: "Repeat as needed", content: "Generate fresh values whenever you need unique identifiers." }], examples: [{ input: "Generate", output: "550e8400-e29b-41d4-a716-446655440000" }] }, zh: { title: "免费在线 UUID 生成器", h1: "免费 UUID 生成器", description: "一键生成安全的 UUID。", seoTitle: "免费 UUID 生成器", seoDescription: "快速生成 UUID v4，适合测试数据、记录 ID 和临时标识符。", intro: "UUID 生成器适合需要低冲突唯一 ID 的场景，比如测试数据、数据库记录和链接标识。", howToUse: [{ title: "生成 UUID", content: "点击生成，在浏览器本地创建新的 UUID。" }, { title: "复制结果", content: "可用于 mock 数据、数据库记录或测试流程。" }, { title: "按需重复", content: "每次需要新标识符时都可以重新生成。" }], examples: [{ input: "生成", output: "550e8400-e29b-41d4-a716-446655440000" }] } }),
  createTool({ slug: "base64", component: "Base64Tool", category: "developer", popular: true, relatedTools: ["jwt-decoder", "url-encoder", "html-encoder"], keywords: ["base64 encode", "base64 decode"], en: { title: "Free Online Base64 Encoder and Decoder", h1: "Free Base64 Encoder and Decoder", description: "Encode and decode Base64 text in the browser.", seoTitle: "Free Base64 Encoder and Decoder", seoDescription: "Encode plain text to Base64 or decode Base64 strings instantly in the browser.", intro: "Base64 is commonly used in tokens, data URLs, email payloads, and transport-safe text conversions.", howToUse: [{ title: "Enter your text", content: "Paste plain text or a Base64 string depending on your goal." }, { title: "Choose encode or decode", content: "Convert to Base64 or back into readable text." }, { title: "Copy the result", content: "Reuse the transformed string in your app or document." }], examples: [{ input: "Madabase", output: "TWFkYWJhc2U=" }], faq: [{ q: "Can it handle Unicode text?", a: "Yes. The encoder uses UTF-8 handling so non-ASCII text can be encoded and decoded." }] }, zh: { title: "免费在线 Base64 编码解码工具", h1: "免费 Base64 编码解码工具", description: "在浏览器中进行 Base64 编码和解码。", seoTitle: "免费 Base64 编码解码工具", seoDescription: "快速把文本转成 Base64，或把 Base64 解码回可读内容。", intro: "Base64 常用于 token、data URL、邮件内容和传输安全文本转换。", howToUse: [{ title: "输入内容", content: "根据需求粘贴普通文本或 Base64 字符串。" }, { title: "选择编码或解码", content: "把文本转为 Base64，或恢复为可读字符串。" }, { title: "复制结果", content: "可继续用于应用、配置或文档。" }], examples: [{ input: "Madabase", output: "TWFkYWJhc2U=" }], faq: [{ q: "可以处理中文等 Unicode 文本吗？", a: "可以。编码器使用 UTF-8 处理非 ASCII 文本。" }] } }),
  createTool({ slug: "url-encoder", component: "UrlEncoder", category: "web", relatedTools: ["url-parser", "base64", "slug-generator"], keywords: ["url encode", "url decode"], en: { title: "Free Online URL Encoder and Decoder", h1: "Free URL Encoder and Decoder", description: "Encode and decode URL strings safely.", seoTitle: "Free URL Encoder and Decoder", seoDescription: "Encode query strings and URL components safely with a browser-based URL encoder.", intro: "URL encoding keeps special characters safe inside query strings, path segments, and redirect parameters.", howToUse: [{ title: "Paste the text", content: "Insert a query parameter, path value, or full string." }, { title: "Encode or decode", content: "Transform special characters into URL-safe values or restore them." }, { title: "Reuse the output", content: "Copy the result into your app, link, or redirect flow." }], examples: [{ input: "hello world?x=1", output: "hello%20world%3Fx%3D1" }] }, zh: { title: "免费在线 URL 编码解码工具", h1: "免费 URL 编码解码工具", description: "安全地对 URL 字符串进行编码与解码。", seoTitle: "免费 URL 编码解码工具", seoDescription: "快速编码查询参数和 URL 组件，避免特殊字符导致链接问题。", intro: "URL 编码可让特殊字符安全地出现在查询参数、路径片段和重定向链接中。", howToUse: [{ title: "粘贴文本", content: "输入查询参数、路径值或任意文本。" }, { title: "编码或解码", content: "把特殊字符转成 URL 安全格式，或恢复为可读文本。" }, { title: "复制输出", content: "可直接用于应用链接、跳转或参数拼接。" }], examples: [{ input: "hello world?x=1", output: "hello%20world%3Fx%3D1" }] } }),
  createTool({ slug: "timestamp", component: "TimestampConverter", category: "developer", popular: true, relatedTools: ["cron-generator", "uuid-generator", "json-formatter"], keywords: ["timestamp converter", "unix timestamp converter"], en: { title: "Free Online Timestamp Converter", h1: "Free Timestamp Converter Online", description: "Convert Unix timestamps to human-readable dates.", seoTitle: "Free Timestamp Converter Online", seoDescription: "Convert Unix timestamps to UTC and local dates instantly in your browser.", intro: "Unix timestamps appear in logs, APIs, databases, and analytics systems, and often need fast human-readable conversion.", howToUse: [{ title: "Enter a timestamp", content: "Paste seconds or milliseconds from logs or APIs." }, { title: "Read local and UTC time", content: "Review the converted time in the formats you need." }, { title: "Generate current time", content: "Use the current timestamp for testing or debugging workflows." }], examples: [{ input: "1717812000", output: "2024-06-08 12:00:00 UTC" }], faq: [{ q: "Does it support milliseconds?", a: "Yes. It can read seconds or milliseconds and shows both current formats." }] }, zh: { title: "免费在线时间戳转换器", h1: "免费时间戳转换器", description: "将 Unix 时间戳转换为可读日期。", seoTitle: "免费时间戳转换器", seoDescription: "快速把 Unix 时间戳转换为本地时间和 UTC 时间。", intro: "Unix 时间戳经常出现在日志、接口、数据库和分析系统中，适合用工具快速转换。", howToUse: [{ title: "输入时间戳", content: "粘贴日志或接口中的秒级或毫秒级时间戳。" }, { title: "查看本地和 UTC 时间", content: "同时查看常用时区格式，便于排查问题。" }, { title: "生成当前时间", content: "用于测试、埋点或调试流程。" }], examples: [{ input: "1717812000", output: "2024-06-08 12:00:00 UTC" }], faq: [{ q: "支持毫秒时间戳吗？", a: "支持。它可以读取秒或毫秒，并显示当前两种格式。" }] } }),
  createTool({ slug: "markdown-preview", component: "MarkdownPreview", category: "creator", relatedTools: ["word-counter", "character-counter", "html-formatter"], keywords: ["markdown preview", "markdown editor online"], en: { title: "Free Online Markdown Preview", h1: "Free Markdown Preview Online", description: "Preview Markdown content in real time.", seoTitle: "Free Markdown Preview Online", seoDescription: "Write Markdown and preview headings, lists, links, and code blocks instantly.", intro: "Markdown preview tools help writers and developers review structure before publishing docs, changelogs, or articles.", howToUse: [{ title: "Write or paste Markdown", content: "Use headings, lists, code blocks, and links in the editor." }, { title: "Preview in real time", content: "Check visual structure as you type." }, { title: "Refine before publishing", content: "Adjust formatting before sending content to GitHub, docs, or blogs." }], examples: [{ input: "# Title\n- item", output: "Rendered heading and list preview" }] }, zh: { title: "免费在线 Markdown 预览工具", h1: "免费 Markdown 预览工具", description: "实时预览 Markdown 内容。", seoTitle: "免费 Markdown 预览工具", seoDescription: "输入 Markdown 后立即查看标题、列表、链接和代码块效果。", intro: "Markdown 预览适合在发布文档、更新日志和文章前快速检查结构。", howToUse: [{ title: "输入或粘贴 Markdown", content: "在编辑器中使用标题、列表、代码块和链接。" }, { title: "实时查看预览", content: "输入时即可看到结构和排版效果。" }, { title: "发布前调整", content: "发到 GitHub、文档系统或博客前先优化格式。" }], examples: [{ input: "# Title\n- item", output: "渲染后的标题与列表预览" }] } }),
  createTool({ slug: "html-formatter", component: "HtmlFormatter", category: "web", relatedTools: ["html-encoder", "css-formatter", "js-formatter"], keywords: ["html formatter", "html beautifier"], en: { title: "Free Online HTML Formatter", h1: "Free HTML Formatter Online", description: "Beautify and format HTML instantly.", seoTitle: "Free HTML Formatter Online", seoDescription: "Beautify HTML markup and make templates easier to debug and review.", intro: "HTML formatting improves readability when you inspect snippets, email templates, embedded widgets, or generated markup.", howToUse: [{ title: "Paste HTML", content: "Insert a compact snippet or generated markup." }, { title: "Run formatter", content: "Beautify the structure into more readable lines." }, { title: "Review and copy", content: "Check nesting before reusing the formatted output." }], examples: [{ input: "<div><p>Hello</p></div>", output: "<div>\n<p>Hello</p>\n</div>" }], faq: [{ q: "Does it change the HTML structure?", a: "It only formats whitespace and indentation for simple markup. Always review complex templates after formatting." }] }, zh: { title: "免费在线 HTML 格式化工具", h1: "免费 HTML 格式化工具", description: "即时美化与格式化 HTML。", seoTitle: "免费 HTML 格式化工具", seoDescription: "快速整理 HTML 结构，方便调试模板、片段和嵌入代码。", intro: "HTML 格式化可以提升代码可读性，适合检查片段、邮件模板和生成后的标记。", howToUse: [{ title: "粘贴 HTML", content: "输入紧凑片段或自动生成的 HTML。" }, { title: "运行格式化", content: "将内容整理成更易阅读的结构。" }, { title: "检查并复制", content: "确认嵌套正确后再复制使用。" }], examples: [{ input: "<div><p>Hello</p></div>", output: "<div>\n<p>Hello</p>\n</div>" }], faq: [{ q: "它会改变 HTML 结构吗？", a: "它主要处理简单标记的空白和缩进。复杂模板格式化后建议人工检查。" }] } }),
  createTool({ slug: "json-diff", component: "JsonDiff", category: "developer", relatedTools: ["json-formatter", "json-validator", "json-escape"], keywords: ["json diff", "compare json online"], en: { title: "Free Online JSON Diff", h1: "Free JSON Diff Online", description: "Compare two JSON documents and inspect differences.", seoTitle: "Free JSON Diff Online", seoDescription: "Compare JSON objects quickly and review structural differences in the browser.", intro: "JSON diff tools are useful for comparing API responses, config snapshots, and test fixtures during debugging.", howToUse: [{ title: "Paste both JSON documents", content: "Place the left and right payloads in the editor with a separator." }, { title: "Run comparison", content: "Normalize both inputs and inspect differences." }, { title: "Review output", content: "Use the result to debug changed fields or missing values." }], examples: [{ input: '{"a":1}\n---\n{"a":2}', output: "Left and right JSON shown with different values" }] }, zh: { title: "免费在线 JSON Diff 工具", h1: "免费 JSON Diff 工具", description: "比较两个 JSON 文档并查看差异。", seoTitle: "免费 JSON Diff 工具", seoDescription: "快速比较两个 JSON 对象，适合调试接口返回和配置差异。", intro: "JSON Diff 适合比较接口响应、配置快照和测试数据中的结构变化。", howToUse: [{ title: "粘贴两份 JSON", content: "把左右两份数据放入编辑器，并用分隔符隔开。" }, { title: "执行比较", content: "工具会标准化输入并展示差异。" }, { title: "查看输出", content: "定位字段变化、缺失值或调试差异。" }], examples: [{ input: '{"a":1}\n---\n{"a":2}', output: "展示左右 JSON 中不同的值" }] } }),
  createTool({ slug: "json-escape", component: "JsonEscape", category: "developer", relatedTools: ["json-formatter", "json-validator", "base64"], keywords: ["json escape", "escape json string"], en: { title: "Free Online JSON Escape Tool", h1: "Free JSON Escape Tool", description: "Escape JSON strings for code, logs, and payloads.", seoTitle: "Free JSON Escape Tool", seoDescription: "Escape quotes and special characters in JSON strings instantly.", intro: "Escaping JSON strings is useful when embedding payloads inside source code, shell commands, or nested data.", howToUse: [{ title: "Paste raw text", content: "Add the string you need to escape for JSON usage." }, { title: "Run escape", content: "Convert quotes and special characters into safe JSON string form." }, { title: "Copy output", content: "Paste the escaped result into code or config files." }], examples: [{ input: 'hello "world"', output: '"hello \\\"world\\\""' }] }, zh: { title: "免费在线 JSON Escape 工具", h1: "免费 JSON Escape 工具", description: "转义 JSON 字符串，适用于代码、日志和请求体。", seoTitle: "免费 JSON Escape 工具", seoDescription: "快速转义引号和特殊字符，便于在代码或配置中嵌入 JSON。", intro: "当你需要把 JSON 内容嵌入代码、命令行或嵌套数据时，转义工具会很有用。", howToUse: [{ title: "粘贴原始文本", content: "输入要转成 JSON 字符串的内容。" }, { title: "执行转义", content: "把引号和特殊字符转换为安全格式。" }, { title: "复制输出", content: "可直接用于代码或配置文件。" }], examples: [{ input: 'hello "world"', output: '"hello \\\"world\\\""' }] } }),
  createTool({ slug: "yaml-formatter", component: "YamlFormatter", category: "developer", relatedTools: ["json-formatter", "xml-formatter", "sql-formatter"], keywords: ["yaml formatter", "format yaml online"], en: { title: "Free Online YAML Formatter", h1: "Free YAML Formatter Online", description: "Format YAML for cleaner configs and manifests.", seoTitle: "Free YAML Formatter Online", seoDescription: "Format YAML files and configuration snippets in the browser.", intro: "YAML formatting helps when reviewing config files, CI pipelines, Kubernetes manifests, and static site settings.", howToUse: [{ title: "Paste YAML", content: "Insert the configuration snippet you want to clean up." }, { title: "Run formatter", content: "Normalize lines and spacing for better readability." }, { title: "Copy the result", content: "Reuse the formatted YAML in CI, infra, or app config." }], examples: [{ input: "name:Madabase", output: "name: Madabase" }] }, zh: { title: "免费在线 YAML 格式化工具", h1: "免费 YAML 格式化工具", description: "整理 YAML 配置，让结构更清晰。", seoTitle: "免费 YAML 格式化工具", seoDescription: "快速格式化 YAML 文件和配置片段。", intro: "YAML 格式化适合查看配置文件、CI 流水线、Kubernetes 清单和站点设置。", howToUse: [{ title: "粘贴 YAML", content: "输入需要整理的配置片段。" }, { title: "运行格式化", content: "标准化空格与换行，提升可读性。" }, { title: "复制结果", content: "可继续用于 CI、基础设施或应用配置。" }], examples: [{ input: "name:Madabase", output: "name: Madabase" }] } }),
  createTool({ slug: "xml-formatter", component: "XmlFormatter", category: "web", relatedTools: ["html-formatter", "yaml-formatter", "json-formatter"], keywords: ["xml formatter", "xml beautifier"], en: { title: "Free Online XML Formatter", h1: "Free XML Formatter Online", description: "Beautify XML for feeds, configs, and API payloads.", seoTitle: "Free XML Formatter Online", seoDescription: "Format XML documents instantly and make nested markup easier to inspect.", intro: "XML is still widely used in feeds, configs, and legacy integrations, so readable structure matters during debugging.", howToUse: [{ title: "Paste XML", content: "Insert the compact XML string you need to inspect." }, { title: "Run formatter", content: "Break tags onto readable lines." }, { title: "Review nesting", content: "Check the structure before copying the output." }], examples: [{ input: "<root><a>1</a></root>", output: "<root>\n<a>1</a>\n</root>" }] }, zh: { title: "免费在线 XML 格式化工具", h1: "免费 XML 格式化工具", description: "美化 XML，适合接口、订阅和配置内容。", seoTitle: "免费 XML 格式化工具", seoDescription: "快速整理 XML 结构，让嵌套标签更容易检查。", intro: "XML 依然常见于订阅源、配置文件和旧系统集成中，调试时需要更清晰的结构。", howToUse: [{ title: "粘贴 XML", content: "输入需要查看的紧凑 XML 字符串。" }, { title: "运行格式化", content: "把标签拆分成更易阅读的多行结构。" }, { title: "检查嵌套", content: "复制前确认层级关系是否正确。" }], examples: [{ input: "<root><a>1</a></root>", output: "<root>\n<a>1</a>\n</root>" }] } }),
  createTool({ slug: "sql-formatter", component: "SqlFormatter", category: "developer", relatedTools: ["json-formatter", "yaml-formatter", "regex-tester"], keywords: ["sql formatter", "sql beautifier"], en: { title: "Free Online SQL Formatter", h1: "Free SQL Formatter Online", description: "Format SQL queries for readability and review.", seoTitle: "Free SQL Formatter Online", seoDescription: "Beautify SQL queries and make clauses easier to scan during debugging.", intro: "SQL formatting improves readability when debugging joins, filters, ordering, and long queries in logs or dashboards.", howToUse: [{ title: "Paste SQL", content: "Insert the query you want to clean up." }, { title: "Run formatter", content: "Break major clauses onto separate lines." }, { title: "Review structure", content: "Check select, where, group by, and order by more easily." }], examples: [{ input: "select * from users where active=1", output: "SELECT ...\nFROM users\nWHERE active=1" }] }, zh: { title: "免费在线 SQL 格式化工具", h1: "免费 SQL 格式化工具", description: "格式化 SQL 查询，提高可读性。", seoTitle: "免费 SQL 格式化工具", seoDescription: "快速美化 SQL 语句，更方便调试和审查查询逻辑。", intro: "SQL 格式化适合排查 join、条件过滤、排序和日志中的长查询语句。", howToUse: [{ title: "粘贴 SQL", content: "输入需要整理的查询语句。" }, { title: "执行格式化", content: "将主要子句拆分到独立行。" }, { title: "检查结构", content: "更容易查看 select、where、group by 和 order by。" }], examples: [{ input: "select * from users where active=1", output: "SELECT ...\nFROM users\nWHERE active=1" }] } }),
  createTool({ slug: "regex-tester", component: "RegexTester", category: "developer", popular: true, relatedTools: ["word-counter", "text-cleaner", "slug-generator"], keywords: ["regex tester", "regular expression tester"], en: { title: "Free Online Regex Tester", h1: "Free Regex Tester Online", description: "Test regular expressions against sample text.", seoTitle: "Free Regex Tester Online", seoDescription: "Test regex patterns and view matches directly in the browser.", intro: "Regex testers help you validate patterns for validation, parsing, replacements, and search rules before shipping them.", howToUse: [{ title: "Enter a regex pattern", content: "Add the expression and flags you want to test." }, { title: "Paste sample text", content: "Use the real string you want to validate or parse." }, { title: "Review matches", content: "Inspect returned matches and refine the pattern." }], examples: [{ input: "pattern: \\d+", output: "Finds all number sequences" }] }, zh: { title: "免费在线 Regex Tester", h1: "免费 Regex Tester 工具", description: "对示例文本测试正则表达式。", seoTitle: "免费 Regex Tester 工具", seoDescription: "在浏览器中测试正则模式并查看匹配结果。", intro: "Regex Tester 适合在上线前验证校验规则、解析模式、替换逻辑和搜索表达式。", howToUse: [{ title: "输入正则模式", content: "填写要测试的表达式和 flags。" }, { title: "粘贴示例文本", content: "尽量使用真实业务中的字符串。" }, { title: "查看匹配结果", content: "根据返回内容继续优化模式。" }], examples: [{ input: "pattern: \\d+", output: "匹配所有数字片段" }] } }),
  createTool({ slug: "cron-generator", component: "CronGenerator", category: "developer", relatedTools: ["timestamp", "regex-tester", "uuid-generator"], keywords: ["cron generator", "cron expression generator"], en: { title: "Free Online Cron Generator", h1: "Free Cron Generator Online", description: "Generate cron expressions for scheduled jobs.", seoTitle: "Free Cron Generator Online", seoDescription: "Build cron expressions quickly for recurring scheduled tasks.", intro: "Cron generators are useful when configuring scheduled jobs, scripts, reports, and recurring background tasks.", howToUse: [{ title: "Choose time fields", content: "Set the minute and hour values for your schedule." }, { title: "Generate expression", content: "Create a valid cron string you can reuse." }, { title: "Copy into your scheduler", content: "Paste it into your OS cron, CI, or task runner." }], examples: [{ input: "minute=0, hour=9", output: "0 9 * * *" }] }, zh: { title: "免费在线 Cron Generator", h1: "免费 Cron Generator 工具", description: "生成定时任务 cron 表达式。", seoTitle: "免费 Cron Generator 工具", seoDescription: "快速创建 cron 表达式，用于计划任务和周期性脚本。", intro: "Cron 生成器适合配置定时任务、自动脚本、报表和后台周期执行流程。", howToUse: [{ title: "设置时间字段", content: "填写分钟和小时等基础调度信息。" }, { title: "生成表达式", content: "快速得到可复用的 cron 字符串。" }, { title: "复制到调度系统", content: "可直接用于系统 cron、CI 或任务调度器。" }], examples: [{ input: "minute=0, hour=9", output: "0 9 * * *" }] } }),
  createTool({ slug: "hash-generator", component: "HashGenerator", category: "developer", relatedTools: ["password-generator", "uuid-generator", "base64"], keywords: ["hash generator", "text hash generator"], en: { title: "Free Online Hash Generator", h1: "Free Hash Generator Online", description: "Generate a simple hash from plain text.", seoTitle: "Free Hash Generator Online", seoDescription: "Create quick text hashes for demos, testing, and local tooling workflows.", intro: "Hash generators are handy in demos, examples, and lightweight local checks where you need stable derived values.", howToUse: [{ title: "Enter text", content: "Paste the string you want to hash." }, { title: "Generate hash", content: "Transform it into a deterministic output." }, { title: "Reuse locally", content: "Copy the result for testing or examples." }], examples: [{ input: "Madabase", output: "5d4140" }] }, zh: { title: "免费在线 Hash Generator", h1: "免费 Hash Generator 工具", description: "从文本生成简单哈希值。", seoTitle: "免费 Hash Generator 工具", seoDescription: "快速生成文本哈希，适合本地测试、演示和工具流程。", intro: "哈希生成器适合演示、示例或轻量本地校验，需要稳定派生值时很方便。", howToUse: [{ title: "输入文本", content: "粘贴需要转换的字符串。" }, { title: "生成哈希", content: "将文本转换为确定性的输出结果。" }, { title: "复制使用", content: "可用于测试或示例场景。" }], examples: [{ input: "Madabase", output: "5d4140" }] } }),
  createTool({ slug: "color-converter", component: "ColorConverter", category: "web", relatedTools: ["css-formatter", "html-formatter", "qr-code-generator"], keywords: ["color converter", "hex to rgb"], en: { title: "Free Online Color Converter", h1: "Free Color Converter Online", description: "Convert color values like HEX to RGB.", seoTitle: "Free Color Converter Online", seoDescription: "Convert hex colors to RGB instantly for web and design workflows.", intro: "Color converters help designers and frontend developers move between CSS-ready color formats quickly.", howToUse: [{ title: "Enter a HEX color", content: "Use a six-character CSS color value." }, { title: "Convert to RGB", content: "The tool calculates the matching red, green, and blue values." }, { title: "Reuse in CSS", content: "Copy the output into styles or design specs." }], examples: [{ input: "#0f766e", output: "rgb(15, 118, 110)" }] }, zh: { title: "免费在线 Color Converter", h1: "免费 Color Converter 工具", description: "转换颜色值，例如 HEX 转 RGB。", seoTitle: "免费 Color Converter 工具", seoDescription: "快速把十六进制颜色转换成 RGB，适合前端和设计流程。", intro: "颜色转换器适合前端和设计师在不同 CSS 颜色格式之间快速切换。", howToUse: [{ title: "输入 HEX 颜色", content: "填写六位十六进制颜色值。" }, { title: "转换为 RGB", content: "工具会计算出对应的 RGB 结果。" }, { title: "用于 CSS", content: "复制到样式代码或设计说明中。" }], examples: [{ input: "#0f766e", output: "rgb(15, 118, 110)" }] } }),
  createTool({ slug: "password-generator", component: "PasswordGenerator", category: "developer", popular: true, relatedTools: ["uuid-generator", "hash-generator", "base64"], keywords: ["password generator", "random password generator"], en: { title: "Free Online Password Generator", h1: "Free Password Generator Online", description: "Generate strong passwords instantly.", seoTitle: "Free Password Generator Online", seoDescription: "Generate strong passwords in the browser for accounts, demos, and testing.", intro: "Password generators help you create strong random-looking credentials without relying on weak manual patterns.", howToUse: [{ title: "Set length", content: "Choose how long the generated password should be." }, { title: "Generate password", content: "Create a strong result instantly in the browser." }, { title: "Copy and store safely", content: "Use a password manager or secure workflow to save it." }], examples: [{ input: "length=16", output: "Aa9!xP2..." }] }, zh: { title: "免费在线 Password Generator", h1: "免费 Password Generator 工具", description: "立即生成强密码。", seoTitle: "免费 Password Generator 工具", seoDescription: "在浏览器中快速生成强密码，适合账号、演示和测试场景。", intro: "密码生成器可以帮助你避免手动拼凑弱密码，快速得到更强的凭据。", howToUse: [{ title: "设置长度", content: "选择生成密码的长度。" }, { title: "生成密码", content: "在浏览器中立即创建新的密码。" }, { title: "安全保存", content: "建议复制后存入密码管理器或安全系统。" }], examples: [{ input: "length=16", output: "Aa9!xP2..." }] } }),
  createTool({ slug: "word-counter", component: "WordCounter", category: "text", relatedTools: ["character-counter", "text-cleaner", "markdown-preview"], keywords: ["word counter", "count words online"], en: { title: "Free Online Word Counter", h1: "Free Word Counter Online", description: "Count words in plain text instantly.", seoTitle: "Free Word Counter Online", seoDescription: "Count words quickly for articles, essays, and content drafts.", intro: "Word counters are useful for blog drafts, essays, social content, and copywriting tasks with length targets.", howToUse: [{ title: "Paste your text", content: "Insert the paragraph, draft, or article." }, { title: "Read the word count", content: "The tool calculates the current total instantly." }, { title: "Edit as needed", content: "Trim or expand content to fit your target length." }], examples: [{ input: "Madabase builds online tools", output: "4 words" }] }, zh: { title: "免费在线 Word Counter", h1: "免费 Word Counter 工具", description: "快速统计文本中的单词数量。", seoTitle: "免费 Word Counter 工具", seoDescription: "适合文章、作文和文案草稿的单词计数工具。", intro: "Word Counter 适合博客草稿、作文、社交内容和需要控制篇幅的文案任务。", howToUse: [{ title: "粘贴文本", content: "输入段落、草稿或文章内容。" }, { title: "查看字数", content: "工具会立即统计当前单词总数。" }, { title: "按目标调整", content: "根据要求增减内容长度。" }], examples: [{ input: "Madabase builds online tools", output: "4 words" }] } }),
  createTool({ slug: "character-counter", component: "CharacterCounter", category: "text", relatedTools: ["word-counter", "text-cleaner", "slug-generator"], keywords: ["character counter", "count characters online"], en: { title: "Free Online Character Counter", h1: "Free Character Counter Online", description: "Count characters in text instantly.", seoTitle: "Free Character Counter Online", seoDescription: "Measure character length for titles, posts, and SEO descriptions.", intro: "Character counters are useful for meta descriptions, social captions, UI copy, and input limits.", howToUse: [{ title: "Paste text", content: "Add the text you want to measure." }, { title: "Read the count", content: "See how many characters are currently used." }, { title: "Adjust for limits", content: "Refine the text to fit SEO or UI constraints." }], examples: [{ input: "Madabase", output: "8 characters" }] }, zh: { title: "免费在线 Character Counter", h1: "免费 Character Counter 工具", description: "快速统计文本字符数。", seoTitle: "免费 Character Counter 工具", seoDescription: "适合 SEO 描述、标题、文案和输入长度限制场景。", intro: "字符计数适合控制 meta description、社媒文案、按钮文字和输入上限。", howToUse: [{ title: "粘贴文本", content: "输入需要计算长度的内容。" }, { title: "查看结果", content: "立即知道当前字符总数。" }, { title: "按限制调整", content: "根据 SEO 或 UI 限制优化文案。" }], examples: [{ input: "Madabase", output: "8 characters" }] } }),
  createTool({ slug: "case-converter", component: "CaseConverter", category: "text", relatedTools: ["text-cleaner", "slug-generator", "word-counter"], keywords: ["case converter", "uppercase lowercase converter"], en: { title: "Free Online Case Converter", h1: "Free Case Converter Online", description: "Convert text to upper, lower, and title case.", seoTitle: "Free Case Converter Online", seoDescription: "Change text case instantly for headlines, code snippets, and content cleanup.", intro: "Case converters save time when adapting content for headings, UI labels, slugs, and docs.", howToUse: [{ title: "Paste text", content: "Add the string you want to transform." }, { title: "Run conversion", content: "Generate uppercase, lowercase, and title case versions." }, { title: "Copy the needed style", content: "Reuse the version that fits your workflow." }], examples: [{ input: "madabase growth", output: "Madabase Growth" }] }, zh: { title: "免费在线 Case Converter", h1: "免费 Case Converter 工具", description: "转换为大写、小写和标题格式。", seoTitle: "免费 Case Converter 工具", seoDescription: "快速切换文本大小写，适合标题、文案和内容整理。", intro: "大小写转换器适合调整标题、UI 文案、slug 和文档内容格式。", howToUse: [{ title: "粘贴文本", content: "输入需要转换的字符串。" }, { title: "执行转换", content: "生成大写、小写和标题格式。" }, { title: "复制需要的结果", content: "选择适合当前场景的版本。" }], examples: [{ input: "madabase growth", output: "Madabase Growth" }] } }),
  createTool({ slug: "text-cleaner", component: "TextCleaner", category: "text", relatedTools: ["case-converter", "word-counter", "character-counter"], keywords: ["text cleaner", "remove extra spaces"], en: { title: "Free Online Text Cleaner", h1: "Free Text Cleaner Online", description: "Clean text by removing extra spaces and line noise.", seoTitle: "Free Text Cleaner Online", seoDescription: "Normalize messy text, remove extra spaces, and clean pasted content fast.", intro: "Text cleaners help when content is copied from PDFs, chats, emails, or editors with messy spacing.", howToUse: [{ title: "Paste messy text", content: "Insert copied content with extra whitespace." }, { title: "Run cleanup", content: "Normalize spaces and compress noisy formatting." }, { title: "Copy the cleaned text", content: "Reuse the output in docs, forms, or writing workflows." }], examples: [{ input: "hello   world", output: "hello world" }] }, zh: { title: "免费在线 Text Cleaner", h1: "免费 Text Cleaner 工具", description: "清理文本中的多余空格和杂乱换行。", seoTitle: "免费 Text Cleaner 工具", seoDescription: "快速清理复制文本中的多余空格和格式噪音。", intro: "当文本来自 PDF、聊天记录、邮件或编辑器时，Text Cleaner 很适合做快速整理。", howToUse: [{ title: "粘贴杂乱文本", content: "输入带有多余空格或格式噪音的内容。" }, { title: "执行清理", content: "统一空格并压缩无用格式。" }, { title: "复制清理结果", content: "可继续用于文档、表单或写作场景。" }], examples: [{ input: "hello   world", output: "hello world" }] } }),
  createTool({ slug: "slug-generator", component: "SlugGenerator", category: "text", relatedTools: ["url-encoder", "case-converter", "word-counter"], keywords: ["slug generator", "url slug generator"], en: { title: "Free Online Slug Generator", h1: "Free Slug Generator Online", description: "Generate clean URL slugs from titles.", seoTitle: "Free Slug Generator Online", seoDescription: "Turn titles into SEO-friendly URL slugs instantly.", intro: "Slug generators are useful for blog posts, docs pages, category pages, and other SEO-friendly URLs.", howToUse: [{ title: "Enter a title", content: "Paste the heading or phrase you want to turn into a slug." }, { title: "Generate the slug", content: "Normalize spacing, casing, and punctuation." }, { title: "Reuse in URLs", content: "Copy the slug into routes, CMS entries, or blog systems." }], examples: [{ input: "Best Online Developer Tools", output: "best-online-developer-tools" }] }, zh: { title: "免费在线 Slug Generator", h1: "免费 Slug Generator 工具", description: "从标题生成干净的 URL slug。", seoTitle: "免费 Slug Generator 工具", seoDescription: "将标题快速转换为适合 SEO 的 URL slug。", intro: "Slug 生成器适合博客文章、文档页面、分类页和其它需要 SEO 友好链接的场景。", howToUse: [{ title: "输入标题", content: "粘贴要转成 slug 的标题或短语。" }, { title: "生成 slug", content: "自动规范大小写、空格和标点。" }, { title: "复制到链接中", content: "用于路由、CMS 或博客系统。" }], examples: [{ input: "Best Online Developer Tools", output: "best-online-developer-tools" }] } }),
  createTool({ slug: "qr-code-generator", component: "QrCodeGenerator", category: "web", popular: true, relatedTools: ["url-parser", "url-encoder", "slug-generator"], keywords: ["qr code generator", "generate qr code online"], en: { title: "Free Online QR Code Generator", h1: "Free QR Code Generator Online", description: "Generate QR codes for links and text.", seoTitle: "Free QR Code Generator Online", seoDescription: "Create QR codes for URLs, text, and sharing workflows instantly.", intro: "QR code generators are useful for links, event materials, product packaging, docs, and offline-to-online sharing.", howToUse: [{ title: "Enter text or URL", content: "Paste the destination link or content you want to encode." }, { title: "Generate the QR code", content: "The tool renders a browser-side QR-style SVG." }, { title: "Copy or export", content: "Reuse the SVG in your workflow or assets." }], examples: [{ input: "https://madabase.com", output: "Rendered QR SVG" }] }, zh: { title: "免费在线 QR Code Generator", h1: "免费 QR Code Generator 工具", description: "为链接和文本生成二维码。", seoTitle: "免费 QR Code Generator 工具", seoDescription: "快速生成用于链接、文本和分享场景的二维码。", intro: "二维码生成器适合链接分享、活动物料、产品包装、文档和线下导流场景。", howToUse: [{ title: "输入文本或链接", content: "粘贴目标 URL 或需要编码的内容。" }, { title: "生成二维码", content: "工具会在浏览器中生成二维码样式 SVG。" }, { title: "复制或导出", content: "可继续用于设计资源或分享流程。" }], examples: [{ input: "https://madabase.com", output: "渲染后的二维码 SVG" }] } }),
  createTool({ slug: "html-encoder", component: "HtmlEncoder", category: "web", relatedTools: ["html-formatter", "url-encoder", "base64"], keywords: ["html encoder", "escape html online"], en: { title: "Free Online HTML Encoder", h1: "Free HTML Encoder Online", description: "Encode HTML entities safely.", seoTitle: "Free HTML Encoder Online", seoDescription: "Escape HTML tags and special characters for safe display in docs and code blocks.", intro: "HTML encoding is useful when you want to display markup as text instead of letting the browser render it.", howToUse: [{ title: "Paste HTML", content: "Enter the markup or snippet you want to escape." }, { title: "Encode entities", content: "Convert angle brackets and quotes into safe HTML entities." }, { title: "Copy result", content: "Use it in docs, examples, emails, or tutorials." }], examples: [{ input: "<div>Hello</div>", output: "&lt;div&gt;Hello&lt;/div&gt;" }] }, zh: { title: "免费在线 HTML Encoder", h1: "免费 HTML Encoder 工具", description: "安全编码 HTML 实体。", seoTitle: "免费 HTML Encoder 工具", seoDescription: "将 HTML 标签和特殊字符转义，便于在文档和教程中展示。", intro: "当你想显示 HTML 代码文本而不是让浏览器渲染它时，HTML Encoder 很有用。", howToUse: [{ title: "粘贴 HTML", content: "输入要转义的标记或片段。" }, { title: "执行编码", content: "将尖括号和引号转成安全的 HTML 实体。" }, { title: "复制结果", content: "适合文档、示例、邮件和教程内容。" }], examples: [{ input: "<div>Hello</div>", output: "&lt;div&gt;Hello&lt;/div&gt;" }] } }),
  createTool({ slug: "css-formatter", component: "CssFormatter", category: "web", relatedTools: ["html-formatter", "js-formatter", "color-converter"], keywords: ["css formatter", "css beautifier"], en: { title: "Free Online CSS Formatter", h1: "Free CSS Formatter Online", description: "Beautify CSS for easier editing and debugging.", seoTitle: "Free CSS Formatter Online", seoDescription: "Format CSS rules and declarations into a cleaner readable layout.", intro: "CSS formatters help when inspecting compressed styles, snippets, generated code, or copied stylesheets.", howToUse: [{ title: "Paste CSS", content: "Insert the compact CSS snippet you want to tidy up." }, { title: "Run formatter", content: "Break declarations onto cleaner lines." }, { title: "Review and copy", content: "Use the result in debugging or editing workflows." }], examples: [{ input: "body{margin:0;color:#111}", output: "body {\nmargin:0;\ncolor:#111;\n}" }] }, zh: { title: "免费在线 CSS Formatter", h1: "免费 CSS Formatter 工具", description: "格式化 CSS，便于编辑和调试。", seoTitle: "免费 CSS Formatter 工具", seoDescription: "快速整理 CSS 规则和声明，让代码更易阅读。", intro: "CSS 格式化适合检查压缩样式、片段代码、生成样式和复制来的样式表。", howToUse: [{ title: "粘贴 CSS", content: "输入要整理的紧凑 CSS 代码。" }, { title: "运行格式化", content: "将声明拆分成更清晰的行结构。" }, { title: "检查并复制", content: "用于调试或后续编辑。" }], examples: [{ input: "body{margin:0;color:#111}", output: "body {\nmargin:0;\ncolor:#111;\n}" }] } }),
  createTool({ slug: "js-formatter", component: "JsFormatter", category: "developer", relatedTools: ["json-formatter", "css-formatter", "html-formatter"], keywords: ["javascript formatter", "js beautifier"], en: { title: "Free Online JavaScript Formatter", h1: "Free JavaScript Formatter Online", description: "Format JavaScript snippets for readability.", seoTitle: "Free JavaScript Formatter Online", seoDescription: "Beautify JavaScript code and inspect snippets more easily in the browser.", intro: "JavaScript formatting is useful when debugging copied snippets, generated code, or quick examples from logs and docs.", howToUse: [{ title: "Paste JavaScript", content: "Insert the snippet you want to reformat." }, { title: "Run formatter", content: "Break statements and blocks onto more readable lines." }, { title: "Copy the result", content: "Reuse it for review or editing." }], examples: [{ input: "const a=1;console.log(a);", output: "const a=1;\nconsole.log(a);" }] }, zh: { title: "免费在线 JavaScript Formatter", h1: "免费 JavaScript Formatter 工具", description: "格式化 JavaScript 片段，提高可读性。", seoTitle: "免费 JavaScript Formatter 工具", seoDescription: "快速整理 JavaScript 代码，方便审查和调试。", intro: "JavaScript 格式化适合查看复制来的片段、生成代码和日志或文档中的示例。", howToUse: [{ title: "粘贴 JavaScript", content: "输入需要整理的代码片段。" }, { title: "运行格式化", content: "把语句和代码块拆分成更清晰的结构。" }, { title: "复制输出", content: "继续用于阅读、调试或编辑。" }], examples: [{ input: "const a=1;console.log(a);", output: "const a=1;\nconsole.log(a);" }] } }),
  createTool({ slug: "url-parser", component: "UrlParser", category: "web", relatedTools: ["url-encoder", "slug-generator", "qr-code-generator"], keywords: ["url parser", "parse url online"], en: { title: "Free Online URL Parser", h1: "Free URL Parser Online", description: "Parse URLs into protocol, host, path, query, and hash.", seoTitle: "Free URL Parser Online", seoDescription: "Break down URLs into readable components instantly in your browser.", intro: "URL parsing helps when debugging redirects, callback URLs, query strings, routing bugs, and tracking links.", howToUse: [{ title: "Paste a full URL", content: "Insert the address you want to inspect." }, { title: "Parse the parts", content: "Extract protocol, host, pathname, query, and hash." }, { title: "Review components", content: "Use the output to debug links or route handling." }], examples: [{ input: "https://madabase.com/en/tools?ref=seo#faq", output: '{\n  "protocol": "https:"\n}' }] }, zh: { title: "免费在线 URL Parser", h1: "免费 URL Parser 工具", description: "解析 URL 的协议、域名、路径、查询参数和锚点。", seoTitle: "免费 URL Parser 工具", seoDescription: "快速拆解 URL，适合调试重定向、路由和追踪参数。", intro: "URL 解析适合排查跳转链接、回调地址、查询参数、路由问题和追踪链接。", howToUse: [{ title: "粘贴完整 URL", content: "输入需要检查的链接地址。" }, { title: "解析各部分", content: "提取协议、域名、路径、查询和锚点。" }, { title: "查看输出", content: "用于调试链接或路由处理逻辑。" }], examples: [{ input: "https://madabase.com/en/tools?ref=seo#faq", output: '{\n  "protocol": "https:"\n}' }] } }),
];

export const toolMap = new Map(toolRegistry.map((tool) => [tool.slug, tool]));

export function getRelatedTools(slug: string) {
  const tool = toolMap.get(slug);
  if (!tool) return [];

  return tool.relatedTools.map((relatedSlug) => toolMap.get(relatedSlug)).filter((item): item is ToolDefinition => Boolean(item));
}

export function getPopularTools() {
  return toolRegistry.filter((tool) => tool.popular);
}

export function getToolsByCategory(category: ToolDefinition["category"]) {
  return toolRegistry.filter((tool) => tool.category === category);
}

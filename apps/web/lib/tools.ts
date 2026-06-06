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
  | "HtmlFormatter";

export type ToolDefinition = {
  slug: string;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  h1: Record<Locale, string>;
  category: "developer" | "ai";
  keywords: string[];
  component: ToolComponentName;
  body: Record<Locale, { heading: string; text: string }[]>;
  faq: Record<Locale, { q: string; a: string }[]>;
};

const localFaq = {
  en: { q: "Does this tool upload my input?", a: "No. This tool runs in your browser for the first release, so your input stays local." },
  zh: { q: "这个工具会上传我的输入吗？", a: "不会。第一版工具在浏览器本地运行，你输入的内容会保留在本地。" },
};

export const toolRegistry: ToolDefinition[] = [
  {
    slug: "json-formatter",
    title: { en: "Free Online JSON Formatter", zh: "免费在线 JSON 格式化工具" },
    h1: { en: "JSON Formatter", zh: "JSON 格式化" },
    description: {
      en: "Format, minify, and validate JSON instantly in your browser.",
      zh: "在浏览器中快速格式化、压缩并校验 JSON。",
    },
    category: "developer",
    keywords: ["json formatter", "json beautifier", "json validator"],
    component: "JsonFormatter",
    body: {
      en: [
        { heading: "What is a JSON Formatter?", text: "A JSON formatter turns compact or hard-to-read JSON into an indented structure that is easier to inspect, debug, and share." },
        { heading: "How to format JSON", text: "Paste JSON into the editor, then choose Format to beautify it or Minify to remove whitespace for transport." },
      ],
      zh: [
        { heading: "什么是 JSON 格式化工具？", text: "JSON 格式化工具可以把紧凑或难以阅读的 JSON 转成带缩进的结构，方便检查、调试和分享。" },
        { heading: "如何格式化 JSON", text: "把 JSON 粘贴到编辑器里，点击格式化即可美化，点击压缩可以移除多余空白。" },
      ],
    },
    faq: {
      en: [
        { q: "What does JSON Formatter do?", a: "It formats JSON, minifies JSON, and validates syntax locally in the browser." },
        localFaq.en,
      ],
      zh: [
        { q: "JSON 格式化工具做什么？", a: "它可以在浏览器本地完成 JSON 格式化、压缩与校验。" },
        localFaq.zh,
      ],
    },
  },
  {
    slug: "json-validator",
    title: { en: "Free Online JSON Validator", zh: "免费在线 JSON 校验器" },
    h1: { en: "JSON Validator", zh: "JSON 校验器" },
    description: {
      en: "Validate JSON and surface syntax errors with useful hints.",
      zh: "校验 JSON 并展示有用的语法错误提示。",
    },
    category: "developer",
    keywords: ["json validator", "json lint"],
    component: "JsonValidator",
    body: {
      en: [{ heading: "Validate JSON before using it", text: "Use this validator to catch missing commas, invalid strings, trailing characters, and other syntax problems before JSON reaches your app." }],
      zh: [{ heading: "在使用前校验 JSON", text: "用这个校验器提前发现缺少逗号、字符串不合法、多余字符等语法问题，避免错误进入应用。" }],
    },
    faq: {
      en: [{ q: "What errors can it detect?", a: "It detects JSON.parse syntax errors and shows the browser-provided error message." }, localFaq.en],
      zh: [{ q: "它能发现哪些错误？", a: "它会检测 JSON.parse 能识别的语法错误，并显示浏览器返回的错误信息。" }, localFaq.zh],
    },
  },
  {
    slug: "json-to-typescript",
    title: { en: "JSON to TypeScript Interface Generator", zh: "JSON 转 TypeScript Interface 工具" },
    h1: { en: "JSON to TypeScript", zh: "JSON 转 TypeScript" },
    description: {
      en: "Generate TypeScript interfaces from JSON samples.",
      zh: "从 JSON 示例自动生成 TypeScript Interface。",
    },
    category: "developer",
    keywords: ["json to typescript", "typescript interface generator"],
    component: "JsonToTypescript",
    body: {
      en: [{ heading: "Generate types from sample JSON", text: "Paste a representative JSON object and generate a TypeScript interface you can refine for your API or frontend model." }],
      zh: [{ heading: "从 JSON 示例生成类型", text: "粘贴一个有代表性的 JSON 对象，即可生成可继续调整的 TypeScript Interface。" }],
    },
    faq: {
      en: [{ q: "Can it infer nested objects?", a: "Yes. The MVP generator creates nested interfaces for object fields and arrays." }, localFaq.en],
      zh: [{ q: "可以识别嵌套对象吗？", a: "可以。MVP 版本会为对象字段和数组生成嵌套接口。" }, localFaq.zh],
    },
  },
  {
    slug: "jwt-decoder",
    title: { en: "Free Online JWT Decoder", zh: "免费在线 JWT 解码器" },
    h1: { en: "JWT Decoder", zh: "JWT 解码器" },
    description: {
      en: "Decode JWT header and payload instantly.",
      zh: "快速解码 JWT 的 Header 与 Payload。",
    },
    category: "developer",
    keywords: ["jwt decoder", "jwt parser"],
    component: "JwtDecoder",
    body: {
      en: [{ heading: "Inspect JWT claims", text: "Decode the header and payload of a JSON Web Token to inspect algorithms, expiration times, issuers, and custom claims." }],
      zh: [{ heading: "查看 JWT 声明", text: "解码 JSON Web Token 的 Header 和 Payload，查看算法、过期时间、签发方和自定义声明。" }],
    },
    faq: {
      en: [{ q: "Does this verify the signature?", a: "No. It decodes the token for inspection only and does not verify signatures." }, localFaq.en],
      zh: [{ q: "它会校验签名吗？", a: "不会。它只用于解码查看内容，不做签名校验。" }, localFaq.zh],
    },
  },
  {
    slug: "uuid-generator",
    title: { en: "Free Online UUID Generator", zh: "免费在线 UUID 生成器" },
    h1: { en: "UUID Generator", zh: "UUID 生成器" },
    description: {
      en: "Generate secure UUIDs in one click.",
      zh: "一键生成安全的 UUID。",
    },
    category: "developer",
    keywords: ["uuid generator", "uuid v4"],
    component: "UuidGenerator",
    body: {
      en: [{ heading: "Create UUID v4 values", text: "Generate random UUID values for identifiers, test data, temporary keys, and development workflows." }],
      zh: [{ heading: "生成 UUID v4", text: "为标识符、测试数据、临时 key 和开发流程生成随机 UUID。" }],
    },
    faq: {
      en: [{ q: "Which UUID version is generated?", a: "The tool generates UUID v4 values using the browser crypto API when available." }, localFaq.en],
      zh: [{ q: "生成的是哪个 UUID 版本？", a: "该工具优先使用浏览器 crypto API 生成 UUID v4。" }, localFaq.zh],
    },
  },
  {
    slug: "base64",
    title: { en: "Free Online Base64 Encoder and Decoder", zh: "免费在线 Base64 编码解码工具" },
    h1: { en: "Base64 Encoder / Decoder", zh: "Base64 编码 / 解码" },
    description: {
      en: "Encode and decode Base64 text in the browser.",
      zh: "在浏览器中进行 Base64 编码和解码。",
    },
    category: "developer",
    keywords: ["base64 encode", "base64 decode"],
    component: "Base64Tool",
    body: {
      en: [{ heading: "Encode and decode Base64", text: "Convert plain text to Base64 or decode Base64 strings back into readable text, including Unicode content." }],
      zh: [{ heading: "Base64 编码与解码", text: "把普通文本转换为 Base64，或把 Base64 字符串解码回可读文本，支持 Unicode 内容。" }],
    },
    faq: {
      en: [{ q: "Can it handle Unicode text?", a: "Yes. The encoder uses UTF-8 handling so non-ASCII text can be encoded and decoded." }, localFaq.en],
      zh: [{ q: "可以处理中文等 Unicode 文本吗？", a: "可以。编码器使用 UTF-8 处理非 ASCII 文本。" }, localFaq.zh],
    },
  },
  {
    slug: "url-encoder",
    title: { en: "Free Online URL Encoder and Decoder", zh: "免费在线 URL 编码解码工具" },
    h1: { en: "URL Encoder / Decoder", zh: "URL 编码 / 解码" },
    description: {
      en: "Encode and decode URL strings safely.",
      zh: "安全地对 URL 字符串进行编码与解码。",
    },
    category: "developer",
    keywords: ["url encode", "url decode"],
    component: "UrlEncoder",
    body: {
      en: [{ heading: "Prepare URL-safe text", text: "Encode query values, path fragments, and other URL text, or decode escaped values back into readable strings." }],
      zh: [{ heading: "处理 URL 安全文本", text: "编码查询参数、路径片段和其它 URL 文本，也可以把转义后的内容解码为可读字符串。" }],
    },
    faq: {
      en: [{ q: "What encoding does it use?", a: "It uses encodeURIComponent and decodeURIComponent for common URL component workflows." }, localFaq.en],
      zh: [{ q: "它使用什么编码方式？", a: "它使用 encodeURIComponent 和 decodeURIComponent，适合常见 URL 组件处理。" }, localFaq.zh],
    },
  },
  {
    slug: "timestamp",
    title: { en: "Free Online Timestamp Converter", zh: "免费在线时间戳转换器" },
    h1: { en: "Timestamp Converter", zh: "时间戳转换器" },
    description: {
      en: "Convert Unix timestamps to human-readable dates.",
      zh: "将 Unix 时间戳转换为可读日期。",
    },
    category: "developer",
    keywords: ["timestamp converter", "unix time"],
    component: "TimestampConverter",
    body: {
      en: [{ heading: "Convert Unix time", text: "Convert seconds or milliseconds timestamps into local and UTC date strings, or generate the current timestamp." }],
      zh: [{ heading: "转换 Unix 时间", text: "把秒或毫秒时间戳转换成本地和 UTC 日期，也可以生成当前时间戳。" }],
    },
    faq: {
      en: [{ q: "Does it support milliseconds?", a: "Yes. It can read seconds or milliseconds and shows both current formats." }, localFaq.en],
      zh: [{ q: "支持毫秒时间戳吗？", a: "支持。它可以读取秒或毫秒，并显示当前两种格式。" }, localFaq.zh],
    },
  },
  {
    slug: "markdown-preview",
    title: { en: "Free Online Markdown Preview", zh: "免费在线 Markdown 预览工具" },
    h1: { en: "Markdown Preview", zh: "Markdown 预览" },
    description: {
      en: "Preview Markdown content in real time.",
      zh: "实时预览 Markdown 内容。",
    },
    category: "developer",
    keywords: ["markdown preview", "markdown editor"],
    component: "MarkdownPreview",
    body: {
      en: [{ heading: "Preview Markdown as you type", text: "Write Markdown and see headings, lists, code blocks, quotes, and links rendered in a live preview." }],
      zh: [{ heading: "实时预览 Markdown", text: "输入 Markdown，即时查看标题、列表、代码块、引用和链接的预览效果。" }],
    },
    faq: {
      en: [{ q: "Is the preview a full Markdown engine?", a: "The MVP supports common Markdown patterns and can later be upgraded to a dedicated parser." }, localFaq.en],
      zh: [{ q: "预览是完整 Markdown 引擎吗？", a: "MVP 支持常见 Markdown 语法，后续可以升级为专用解析器。" }, localFaq.zh],
    },
  },
  {
    slug: "html-formatter",
    title: { en: "Free Online HTML Formatter", zh: "免费在线 HTML 格式化工具" },
    h1: { en: "HTML Formatter", zh: "HTML 格式化" },
    description: {
      en: "Beautify and format HTML instantly.",
      zh: "即时美化与格式化 HTML。",
    },
    category: "developer",
    keywords: ["html formatter", "html beautifier"],
    component: "HtmlFormatter",
    body: {
      en: [{ heading: "Beautify HTML markup", text: "Paste compact HTML and format it into readable indentation for review, snippets, and quick debugging." }],
      zh: [{ heading: "美化 HTML 标记", text: "粘贴紧凑的 HTML，把它格式化成易读缩进，适合审查片段和快速调试。" }],
    },
    faq: {
      en: [{ q: "Does it change the HTML structure?", a: "It only formats whitespace and indentation for simple markup. Always review complex templates after formatting." }, localFaq.en],
      zh: [{ q: "它会改变 HTML 结构吗？", a: "它主要处理简单标记的空白和缩进。复杂模板格式化后建议人工检查。" }, localFaq.zh],
    },
  },
];

export const toolMap = new Map(toolRegistry.map((tool) => [tool.slug, tool]));

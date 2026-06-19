import type { Locale } from "./i18n";

type RetentionHint = {
  example: Record<Locale, string>;
  error: Record<Locale, string>;
  workflow: Record<Locale, string>;
};

const defaultHint: RetentionHint = {
  example: {
    en: "Use real project input rather than placeholder text so the output can be copied directly into your workflow.",
    zh: "建议粘贴真实项目输入，而不是占位文本，这样输出结果可以直接进入你的工作流。",
  },
  error: {
    en: "If the result looks wrong, check quoting, escaping, invalid characters, and incomplete input first.",
    zh: "如果结果不符合预期，优先检查引号、转义、非法字符和输入是否完整。",
  },
  workflow: {
    en: "After running the tool, copy or download the result and save a known-good sample for the next task.",
    zh: "运行后复制或下载结果，并保留一份确认正确的样例，方便下次复用。",
  },
};

const hints: Record<string, RetentionHint> = {
  "json-formatter": {
    example: { en: "Paste API responses, config files, or webhook payloads to inspect nested structure quickly.", zh: "粘贴接口响应、配置文件或 Webhook payload，快速检查嵌套结构。" },
    error: { en: "Most failures come from trailing commas, comments, unquoted keys, or copied log prefixes.", zh: "常见错误来自尾逗号、注释、未加引号的 key，或复制日志时带入的前缀。" },
    workflow: { en: "Format before review, minify before embedding, and keep a valid sample as a regression fixture.", zh: "评审前格式化，嵌入前压缩，并保留一份有效样例作为回归用例。" },
  },
  "json-validator": {
    example: { en: "Validate payloads before sending them to APIs, automation tools, or database seed scripts.", zh: "在发送到 API、自动化工具或数据库种子脚本前先校验 payload。" },
    error: { en: "Use the parser error as a pointer, then inspect the previous line for missing commas or brackets.", zh: "把解析错误当作定位线索，同时检查上一行是否缺逗号或括号。" },
    workflow: { en: "Validate, format, then copy the cleaned payload into the final request or issue report.", zh: "先校验，再格式化，最后把清理后的 payload 复制到请求或问题报告中。" },
  },
  base64: {
    example: { en: "Encode tokens, small config values, or test fixtures while preserving Unicode text.", zh: "编码 token、小配置值或测试样例，同时保留 Unicode 文本。" },
    error: { en: "Decode errors usually mean the input includes whitespace, URL-safe variants, or missing padding.", zh: "解码失败通常是因为包含空白、URL-safe 变体或缺少 padding。" },
    workflow: { en: "Decode before inspecting JWT-like data, and encode only the exact value you intend to ship.", zh: "检查类似 JWT 的数据前先解码；编码时只处理真正要发送的精确值。" },
  },
  "url-encoder": {
    example: { en: "Encode query parameter values before building links for redirects, sharing, or tracking.", zh: "构建跳转、分享或追踪链接前，先编码查询参数值。" },
    error: { en: "Decode failures often come from partial percent-encoding such as a lone percent sign.", zh: "解码失败常来自不完整的百分号编码，例如单独的百分号。" },
    workflow: { en: "Encode individual parameter values, then parse the full URL to verify the final link.", zh: "先编码单个参数值，再解析完整 URL 检查最终链接。" },
  },
  "sql-formatter": {
    example: { en: "Format review queries, migration snippets, and dashboard SQL before sharing with teammates.", zh: "分享评审查询、迁移片段和看板 SQL 前先格式化。" },
    error: { en: "If formatting fails, check dialect-specific syntax and unmatched quotes first.", zh: "如果格式化失败，先检查方言特有语法和未闭合引号。" },
    workflow: { en: "Use formatted SQL for review, then keep the original query in version control when behavior matters.", zh: "评审时使用格式化 SQL；行为敏感时在版本控制中保留原始查询。" },
  },
  "regex-tester": {
    example: { en: "Test extraction patterns against realistic logs, filenames, or pasted customer messages.", zh: "用真实日志、文件名或用户消息测试提取规则。" },
    error: { en: "Unexpected matches usually come from greedy operators, missing anchors, or incorrect flags.", zh: "意外匹配通常来自贪婪操作符、缺少锚点或 flags 设置不对。" },
    workflow: { en: "Save a passing sample and a failing sample before moving the regex into code.", zh: "把正则写进代码前，先保存一个通过样例和一个失败样例。" },
  },
};

export function getToolRetentionHint(slug: string, locale: Locale) {
  const hint = hints[slug] ?? defaultHint;
  return {
    example: hint.example[locale],
    error: hint.error[locale],
    workflow: hint.workflow[locale],
  };
}

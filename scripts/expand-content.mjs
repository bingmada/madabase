import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(".");

const tools = [
  ["line-sorter", "text", "Line Sorter", "行排序工具", "Sort lines alphabetically and clean up list data.", "按字母顺序整理多行文本和列表数据。"],
  ["line-deduplicator", "text", "Line Deduplicator", "行去重工具", "Remove duplicate lines while keeping one clean list.", "移除重复行，保留一份干净列表。"],
  ["empty-line-remover", "text", "Empty Line Remover", "空行移除工具", "Remove blank lines from pasted text.", "从粘贴文本中移除空白行。"],
  ["whitespace-normalizer", "text", "Whitespace Normalizer", "空白字符规范化工具", "Normalize repeated spaces, tabs, and line breaks.", "规范化多余空格、制表符和换行。"],
  ["text-diff", "text", "Text Diff Checker", "文本差异对比工具", "Compare two text blocks and spot changed lines.", "比较两段文本并查看变化行。"],
  ["email-extractor", "text", "Email Extractor", "邮箱提取工具", "Extract email addresses from messy text.", "从杂乱文本中提取邮箱地址。"],
  ["url-extractor", "web", "URL Extractor", "链接提取工具", "Extract URLs from documents, logs, and messages.", "从文档、日志和消息中提取链接。"],
  ["number-extractor", "text", "Number Extractor", "数字提取工具", "Extract numbers from text for quick cleanup.", "从文本中提取数字，便于快速整理。"],
  ["csv-to-json", "developer", "CSV to JSON Converter", "CSV 转 JSON 工具", "Convert simple CSV rows into JSON objects.", "将简单 CSV 行转换为 JSON 对象。"],
  ["json-to-csv", "developer", "JSON to CSV Converter", "JSON 转 CSV 工具", "Convert JSON arrays into CSV tables.", "将 JSON 数组转换为 CSV 表格。"],
  ["json-to-yaml", "developer", "JSON to YAML Converter", "JSON 转 YAML 工具", "Convert simple JSON objects into YAML-like output.", "将简单 JSON 对象转换为类 YAML 输出。"],
  ["yaml-to-json", "developer", "YAML to JSON Converter", "YAML 转 JSON 工具", "Convert simple key-value YAML into JSON.", "将简单键值 YAML 转换为 JSON。"],
  ["env-to-json", "developer", "ENV to JSON Converter", "ENV 转 JSON 工具", "Turn .env key-value files into JSON.", "将 .env 键值文件转换为 JSON。"],
  ["json-to-env", "developer", "JSON to ENV Converter", "JSON 转 ENV 工具", "Convert flat JSON objects into .env lines.", "将扁平 JSON 对象转换为 .env 行。"],
  ["toml-to-json", "developer", "TOML to JSON Converter", "TOML 转 JSON 工具", "Convert simple TOML key-value data into JSON.", "将简单 TOML 键值数据转换为 JSON。"],
  ["query-string-parser", "web", "Query String Parser", "Query String 解析器", "Parse query strings into readable JSON.", "将查询字符串解析为可读 JSON。"],
  ["query-string-builder", "web", "Query String Builder", "Query String 生成器", "Build URL query strings from JSON.", "从 JSON 生成 URL 查询字符串。"],
  ["http-header-parser", "developer", "HTTP Header Parser", "HTTP Header 解析器", "Parse HTTP headers into structured JSON.", "将 HTTP 头解析为结构化 JSON。"],
  ["user-agent-parser", "web", "User Agent Parser", "User Agent 解析器", "Inspect browser and device hints from user agent strings.", "从 User Agent 字符串识别浏览器和设备线索。"],
  ["unicode-escape", "developer", "Unicode Escape Tool", "Unicode 转义工具", "Convert text into Unicode escape sequences.", "将文本转换为 Unicode 转义序列。"],
  ["unicode-unescape", "developer", "Unicode Unescape Tool", "Unicode 反转义工具", "Decode Unicode escape sequences back to text.", "将 Unicode 转义序列还原为文本。"],
  ["hex-to-text", "developer", "Hex to Text Converter", "Hex 转文本工具", "Decode hexadecimal strings into text.", "将十六进制字符串解码为文本。"],
  ["text-to-hex", "developer", "Text to Hex Converter", "文本转 Hex 工具", "Encode text as hexadecimal bytes.", "将文本编码为十六进制字节。"],
  ["binary-to-text", "developer", "Binary to Text Converter", "二进制转文本工具", "Decode binary byte strings into text.", "将二进制字节串解码为文本。"],
  ["text-to-binary", "developer", "Text to Binary Converter", "文本转二进制工具", "Encode text into binary byte strings.", "将文本编码为二进制字节串。"],
  ["html-stripper", "web", "HTML Tag Stripper", "HTML 标签移除工具", "Remove HTML tags and keep plain text.", "移除 HTML 标签并保留纯文本。"],
  ["markdown-to-text", "creator", "Markdown to Text Converter", "Markdown 转文本工具", "Strip Markdown syntax for clean plain text.", "移除 Markdown 语法，得到干净纯文本。"],
  ["reading-time", "creator", "Reading Time Calculator", "阅读时间计算器", "Estimate reading time from article text.", "根据文章文本估算阅读时间。"],
  ["lorem-ipsum", "creator", "Lorem Ipsum Generator", "占位文本生成器", "Generate placeholder paragraphs for drafts and layouts.", "为草稿和布局生成占位段落。"],
  ["list-randomizer", "text", "List Randomizer", "列表随机排序工具", "Shuffle list items into a new order.", "将列表项目打乱为新顺序。"],
];

const tests = [
  ["big-five", "personality", "Big Five Personality Test", "大五人格测试", ["OPENNESS", "CONSCIENTIOUSNESS", "EXTRAVERSION", "AGREEABLENESS", "NEUROTICISM"]],
  ["enneagram", "personality", "Enneagram Test", "九型人格测试", ["REFORMER", "HELPER", "ACHIEVER", "INDIVIDUALIST", "INVESTIGATOR", "LOYALIST", "ENTHUSIAST", "CHALLENGER", "PEACEMAKER"]],
  ["disc", "career", "DISC Personality Test", "DISC 性格测试", ["DOMINANCE", "INFLUENCE", "STEADINESS", "COMPLIANCE"]],
  ["attachment-style", "relationship", "Attachment Style Test", "依恋类型测试", ["SECURE", "ANXIOUS", "AVOIDANT", "FEARFUL"]],
  ["communication-style", "relationship", "Communication Style Test", "沟通风格测试", ["ASSERTIVE", "ANALYTICAL", "EXPRESSIVE", "SUPPORTIVE"]],
  ["eq", "intelligence", "Emotional Intelligence Test", "情绪智力测试", ["SELF_AWARENESS", "SELF_REGULATION", "EMPATHY", "SOCIAL_SKILL"]],
  ["procrastination", "career", "Procrastination Test", "拖延程度测试", ["LOW", "MODERATE", "HIGH", "SEVERE"]],
  ["time-management", "career", "Time Management Style Test", "时间管理风格测试", ["PLANNER", "SPRINTER", "FLEXIBLE", "REACTIVE"]],
  ["resilience", "career", "Resilience Test", "心理韧性测试", ["STEADY", "RECOVERING", "STRAINED", "FRAGILE"]],
  ["conflict-style", "relationship", "Conflict Style Test", "冲突处理风格测试", ["COLLABORATING", "COMPETING", "COMPROMISING", "AVOIDING", "ACCOMMODATING"]],
  ["leadership-style", "career", "Leadership Style Test", "领导力风格测试", ["COACH", "VISIONARY", "OPERATOR", "DEMOCRATIC"]],
  ["team-role", "career", "Team Role Test", "团队角色测试", ["COORDINATOR", "CREATOR", "IMPLEMENTER", "ANALYST", "SUPPORTER"]],
  ["decision-style", "personality", "Decision Style Test", "决策风格测试", ["ANALYTICAL", "INTUITIVE", "DEPENDENT", "SPONTANEOUS"]],
  ["work-values", "career", "Work Values Test", "职场价值观测试", ["AUTONOMY", "IMPACT", "SECURITY", "MASTERY", "RECOGNITION"]],
  ["creativity", "personality", "Creativity Style Test", "创造力风格测试", ["IDEATOR", "MAKER", "REFINER", "CONNECTOR"]],
];

function writeToolRegistry() {
  const entries = tools
    .map(([slug, category, en, zh, descEn, descZh]) => `  { slug: "${slug}", component: "GenericTextTool", category: "${category}", relatedTools: ["text-cleaner", "json-formatter", "url-encoder"], keywords: ["${slug.replaceAll("-", " ")}", "online ${slug.replaceAll("-", " ")}"], h1: { en: "Free ${en} Online", zh: "免费${zh}" }, description: { en: "${descEn}", zh: "${descZh}" } },`)
    .join("\n");
  return `import type { ToolRegistryEntry } from "./tool-registry";\n\nexport const expandedToolRegistry: ToolRegistryEntry[] = [\n${entries}\n];\n`;
}

function toolContent({ slug, category, en, zh, descEn, descZh, locale }) {
  const isZh = locale === "zh";
  return `[TITLE]
${isZh ? `免费${zh}` : `Free ${en} Online`}
[H1]
${isZh ? `免费${zh}` : `Free ${en} Online`}
[DESCRIPTION]
${isZh ? descZh : descEn}
[SEO_TITLE]
${isZh ? `免费${zh}` : `Free ${en} Online`} | Madabase
[SEO_DESCRIPTION]
${isZh ? `${descZh} 在浏览器中快速处理并复制结果。` : `${descEn} Run it locally in your browser with a clean copyable output.`}
[INTRO]
${isZh ? `当你需要快速清理、转换、调试或准备内容时，可以使用这个${zh}。它适合日常小任务，不需要打开复杂软件。` : `Use this ${en.toLowerCase()} when you need a fast browser-based utility for cleanup, conversion, debugging, or content preparation.`}
[HOW_TO_USE]
${isZh ? "粘贴输入\n输入你要处理的文本、数据或片段。\n---\n运行工具\n点击操作按钮，立即生成结果。\n---\n复制结果\n检查输出内容，并复制到你的工作流中。" : "Paste your input\nAdd the text, data, or snippet you want to process.\n---\nRun the tool\nClick the action button to transform the input instantly.\n---\nCopy the result\nReview the output and copy it into your workflow."}
[EXAMPLES]
${isZh ? "Madabase 工具\n===\n处理后的 Madabase 工具" : "Madabase tools\n===\nProcessed Madabase tools"}
[FAQ]
${isZh ? `这个${zh}免费吗？\n是的。当前版本可以在浏览器中免费使用。\n可以处理私密数据吗？\n工具界面在浏览器中运行，但仍建议不要把敏感密钥粘贴到任何网页。` : `Is this ${en.toLowerCase()} free?\nYes. The first release is free to use in your browser.\nCan I use private data?\nThe tool runs locally in the browser UI, but you should still avoid pasting secrets into any web page you do not control.`}
[RELATED_TOOLS]
text-cleaner
json-formatter
url-encoder
[KEYWORDS]
${slug.replaceAll("-", " ")}
${isZh ? "免费" : "free"} ${slug.replaceAll("-", " ")}
${isZh ? "在线" : "online"} ${slug.replaceAll("-", " ")}
[CATEGORY]
${category}
`;
}

function writeTestRegistry() {
  const entries = tests
    .map(([slug, category, en, zh, types], index) => `  { slug: "${slug}", category: "${category}", title: { en: "${en}", zh: "${zh}" }, description: { en: "Explore your ${en.toLowerCase().replace(" test", "")} pattern with a practical self-reflection test.", zh: "通过实用自评了解你的${zh.replace("测试", "")}模式。" }, questionCount: ${types.length * 6}, estimatedMinutes: ${Math.max(6, Math.ceil(types.length * 1.4))}, unlockCost: 5, ${index < 4 ? "popular: true, " : ""}relatedTools: ["word-counter", "markdown-preview", "text-cleaner"], resultTypes: ${JSON.stringify(types)}, seo: { en: { title: "Free ${en} Online", description: "Take a practical ${en.toLowerCase()} and unlock a clear report with strengths, risks, and growth ideas.", keywords: ["${en.toLowerCase()}", "online test", "self assessment"] }, zh: { title: "免费${zh}在线版", description: "完成${zh}，获得包含优势、风险和成长建议的清晰报告。", keywords: ["${zh}", "在线测试", "自我评估"] } } },`)
    .join("\n");
  return `import type { TestRegistryEntry } from "./test-registry";\n\nexport type ExpandedTestConfig = Omit<TestRegistryEntry, "calculator">;\n\nexport const expandedTestConfigs: ExpandedTestConfig[] = [\n${entries}\n];\n`;
}

const scaleEn = [
  { id: "1", text: "Strongly disagree", value: 1 },
  { id: "2", text: "Disagree", value: 2 },
  { id: "3", text: "Neutral", value: 3 },
  { id: "4", text: "Agree", value: 4 },
  { id: "5", text: "Strongly agree", value: 5 },
];
const scaleZh = [
  { id: "1", text: "非常不同意", value: 1 },
  { id: "2", text: "不同意", value: 2 },
  { id: "3", text: "一般", value: 3 },
  { id: "4", text: "同意", value: 4 },
  { id: "5", text: "非常同意", value: 5 },
];

function human(type) {
  return type.toLowerCase().split("_").map((item) => item.charAt(0).toUpperCase() + item.slice(1)).join(" ");
}

function zhType(type) {
  return {
    OPENNESS: "开放探索",
    CONSCIENTIOUSNESS: "尽责规划",
    EXTRAVERSION: "外向能量",
    AGREEABLENESS: "宜人合作",
    NEUROTICISM: "情绪敏感",
    SECURE: "安全型",
    ANXIOUS: "焦虑型",
    AVOIDANT: "回避型",
    FEARFUL: "矛盾型",
    LOW: "低风险",
    MODERATE: "中等风险",
    HIGH: "高风险",
    SEVERE: "严重风险",
  }[type] ?? human(type);
}

function makeQuestions(types, locale) {
  return types.flatMap((type) =>
    Array.from({ length: 6 }, (_, index) => ({
      id: `${type.toLowerCase()}_${index + 1}`,
      question: locale === "zh" ? `我在相关情境中经常表现出「${zhType(type)}」这一倾向。` : `In relevant situations, I often show a ${human(type)} pattern.`,
      scoreKey: type,
    })),
  );
}

function result(type, locale) {
  const name = locale === "zh" ? zhType(type) : human(type);
  if (locale === "zh") {
    return {
      title: name,
      summary: `你的主要结果指向${name}。这不是固定标签，而是帮助你理解当前偏好的观察角度。`,
      traits: ["偏好清晰", "模式稳定", "可被情境调整"],
      strengths: ["能在合适环境中发挥明显优势", "容易形成可复用的方法", "对相关信号较敏感"],
      weaknesses: ["压力下可能过度使用同一种策略", "容易忽略相反视角", "需要避免把结果当成限制"],
      careers: ["复盘最近三次真实情境", "找到最常触发该模式的场景", "设计一个小实验"],
      relationships: ["向他人说明你的偏好，同时保留对方不同节奏的空间。"],
      growthPlan: ["记录一周内的典型表现", "选择一个需要微调的行为", "用一次低风险场景练习新策略"],
    };
  }
  return {
    title: name,
    summary: `Your primary result points to a ${name} pattern. Treat it as a useful lens, not a fixed label.`,
    traits: ["Clear preference", "Repeatable pattern", "Context sensitive"],
    strengths: ["You can create real leverage in the right environment", "You tend to build repeatable strategies", "You notice relevant signals quickly"],
    weaknesses: ["Under pressure, you may overuse one strategy", "Opposite perspectives can be easy to miss", "The result should guide you rather than limit you"],
    careers: ["Review three recent real situations", "Find where this pattern appears most often", "Design one small experiment"],
    relationships: ["Explain your preference clearly while leaving room for other people's pace and style."],
    growthPlan: ["Track the pattern for one week", "Choose one behavior to adjust", "Practice the new move in a low-risk situation"],
  };
}

await fs.writeFile(path.join(root, "apps/web/lib/expanded-tool-registry.ts"), writeToolRegistry());
await fs.writeFile(path.join(root, "apps/web/lib/expanded-test-registry.ts"), writeTestRegistry());

for (const [slug, category, en, zh, descEn, descZh] of tools) {
  await fs.writeFile(path.join(root, `apps/web/content/tools/en/${slug}.txt`), toolContent({ slug, category, en, zh, descEn, descZh, locale: "en" }));
  await fs.writeFile(path.join(root, `apps/web/content/tools/zh/${slug}.txt`), toolContent({ slug, category, en, zh, descEn, descZh, locale: "zh" }));
}

for (const [slug, , en, zh, types] of tests) {
  await fs.mkdir(path.join(root, `apps/web/content/tests/${slug}`), { recursive: true });
  await fs.writeFile(path.join(root, `apps/web/content/tests/${slug}/en.json`), JSON.stringify({
    title: en,
    description: `Answer ${types.length * 6} quick prompts to explore your ${en.toLowerCase().replace(" test", "")} pattern.`,
    instructions: ["Answer based on recent real behavior, not an ideal version of yourself.", "Use the whole scale when a statement clearly fits or does not fit.", "Your report highlights the strongest pattern and practical next steps."],
    scale: scaleEn,
    scaleQuestions: makeQuestions(types, "en"),
    results: Object.fromEntries(types.map((type) => [type, result(type, "en")])),
  }, null, 2));
  await fs.writeFile(path.join(root, `apps/web/content/tests/${slug}/zh.json`), JSON.stringify({
    title: zh,
    description: `通过 ${types.length * 6} 个快速问题了解你的${zh.replace("测试", "")}模式。`,
    instructions: ["请根据最近真实行为作答，不要按理想中的自己选择。", "当描述明显符合或不符合时，请大胆使用量表两端。", "报告会突出你的最强模式和可执行的下一步建议。"],
    reportLabels: { strengths: "优势", weaknesses: "风险", careers: "适合方法", relationships: "关系提示", growth: "成长计划" },
    scale: scaleZh,
    scaleQuestions: makeQuestions(types, "zh"),
    results: Object.fromEntries(types.map((type) => [type, result(type, "zh")])),
  }, null, 2));
}

console.log(`Generated ${tools.length} tools and ${tests.length} tests.`);

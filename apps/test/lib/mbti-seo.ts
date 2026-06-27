import type { Locale } from "./i18n";

export const mbtiTypes = [
  "INTJ",
  "INTP",
  "ENTJ",
  "ENTP",
  "INFJ",
  "INFP",
  "ENFJ",
  "ENFP",
  "ISTJ",
  "ISFJ",
  "ESTJ",
  "ESFJ",
  "ISTP",
  "ISFP",
  "ESTP",
  "ESFP",
] as const;

export type MbtiType = (typeof mbtiTypes)[number];
export type MbtiSeoTopic = "career" | "love" | "famous" | "match" | "alike";

type Localized = Record<Locale, string>;

type CareerTopic = {
  slug: string;
  title: Localized;
  angle: Localized;
};

type FamousPerson = {
  slug: string;
  name: string;
  role: Localized;
};

export type MbtiSeoPage = {
  topic: MbtiSeoTopic;
  slug: string;
  title: Localized;
  description: Localized;
  h1: Localized;
  type: MbtiType;
  secondaryType?: MbtiType;
  sections: Array<{ title: Localized; body: Localized; bullets: Localized[] }>;
  related: Array<{ topic: MbtiSeoTopic; slug: string; label: Localized }>;
};

const typeProfiles: Record<MbtiType, { name: Localized; strengths: Localized[]; watchouts: Localized[] }> = {
  INTJ: { name: { en: "Strategic Architect", zh: "战略型规划者" }, strengths: [{ en: "systems thinking", zh: "系统化思考" }, { en: "long-range planning", zh: "长期规划" }, { en: "independent execution", zh: "独立推进" }], watchouts: [{ en: "may sound too blunt under pressure", zh: "压力下容易显得直接" }, { en: "can over-optimize before acting", zh: "可能在行动前过度优化" }] },
  INTP: { name: { en: "Analytical Explorer", zh: "分析型探索者" }, strengths: [{ en: "conceptual problem solving", zh: "概念化解题" }, { en: "model building", zh: "模型构建" }, { en: "intellectual independence", zh: "智识独立" }], watchouts: [{ en: "may postpone closure", zh: "可能推迟收尾" }, { en: "can under-communicate progress", zh: "容易低估同步进展的重要性" }] },
  ENTJ: { name: { en: "Commanding Strategist", zh: "目标型指挥者" }, strengths: [{ en: "decisive leadership", zh: "果断领导" }, { en: "resource orchestration", zh: "资源整合" }, { en: "ambitious execution", zh: "高目标执行" }], watchouts: [{ en: "may rush consensus", zh: "可能过快推进共识" }, { en: "can overlook emotional pacing", zh: "容易忽略情绪节奏" }] },
  ENTP: { name: { en: "Inventive Debater", zh: "创意型辩手" }, strengths: [{ en: "idea generation", zh: "创意发散" }, { en: "strategic reframing", zh: "重新定义问题" }, { en: "rapid learning", zh: "快速学习" }], watchouts: [{ en: "may lose interest after the novelty fades", zh: "新鲜感下降后可能分心" }, { en: "can debate when reassurance is needed", zh: "需要安抚时仍可能进入辩论模式" }] },
  INFJ: { name: { en: "Insightful Counselor", zh: "洞察型引导者" }, strengths: [{ en: "pattern insight", zh: "模式洞察" }, { en: "values-led decisions", zh: "价值驱动决策" }, { en: "deep listening", zh: "深度倾听" }], watchouts: [{ en: "may carry too much privately", zh: "可能独自承担过多" }, { en: "can set unclear boundaries", zh: "边界表达可能不够清晰" }] },
  INFP: { name: { en: "Idealistic Creator", zh: "理想型创造者" }, strengths: [{ en: "empathy", zh: "共情力" }, { en: "authentic expression", zh: "真实表达" }, { en: "meaning making", zh: "意义建构" }], watchouts: [{ en: "may avoid practical conflict", zh: "可能回避现实冲突" }, { en: "can personalize neutral feedback", zh: "容易把中性反馈个人化" }] },
  ENFJ: { name: { en: "Charismatic Mentor", zh: "凝聚型导师" }, strengths: [{ en: "social leadership", zh: "社交领导力" }, { en: "motivation", zh: "激励他人" }, { en: "group harmony", zh: "群体协调" }], watchouts: [{ en: "may over-function for others", zh: "可能替他人承担过多" }, { en: "can struggle to disappoint people", zh: "不擅长让人失望" }] },
  ENFP: { name: { en: "Enthusiastic Catalyst", zh: "热情型催化者" }, strengths: [{ en: "possibility spotting", zh: "发现可能性" }, { en: "emotional energy", zh: "情绪感染力" }, { en: "creative connection", zh: "创意连接" }], watchouts: [{ en: "may scatter attention", zh: "注意力可能分散" }, { en: "can resist routine", zh: "容易抗拒重复流程" }] },
  ISTJ: { name: { en: "Reliable Operator", zh: "可靠型执行者" }, strengths: [{ en: "consistency", zh: "稳定性" }, { en: "detail ownership", zh: "细节负责" }, { en: "practical judgment", zh: "务实判断" }], watchouts: [{ en: "may resist vague change", zh: "可能抗拒模糊变化" }, { en: "can seem reserved with praise", zh: "赞赏表达可能较克制" }] },
  ISFJ: { name: { en: "Supportive Protector", zh: "支持型守护者" }, strengths: [{ en: "careful support", zh: "细致支持" }, { en: "memory for needs", zh: "记得他人需求" }, { en: "service reliability", zh: "服务可靠性" }], watchouts: [{ en: "may hide resentment", zh: "可能压抑不满" }, { en: "can over-prioritize stability", zh: "可能过度重视稳定" }] },
  ESTJ: { name: { en: "Practical Director", zh: "务实型管理者" }, strengths: [{ en: "clear standards", zh: "标准清晰" }, { en: "operational discipline", zh: "运营纪律" }, { en: "fast organization", zh: "快速组织" }], watchouts: [{ en: "may sound overly corrective", zh: "可能显得过于纠错" }, { en: "can undervalue ambiguity", zh: "容易低估模糊空间" }] },
  ESFJ: { name: { en: "Community Builder", zh: "关系型组织者" }, strengths: [{ en: "relationship maintenance", zh: "关系维护" }, { en: "social responsibility", zh: "社会责任感" }, { en: "warm coordination", zh: "温暖协调" }], watchouts: [{ en: "may seek too much approval", zh: "可能过度寻求认可" }, { en: "can avoid hard tradeoffs", zh: "可能回避艰难取舍" }] },
  ISTP: { name: { en: "Tactical Problem Solver", zh: "战术型解题者" }, strengths: [{ en: "hands-on troubleshooting", zh: "动手排障" }, { en: "calm in crisis", zh: "危机中冷静" }, { en: "mechanical clarity", zh: "机制清晰" }], watchouts: [{ en: "may disengage from emotional talk", zh: "可能回避情绪沟通" }, { en: "can under-plan long arcs", zh: "长期规划可能不足" }] },
  ISFP: { name: { en: "Sensitive Artisan", zh: "感受型创作者" }, strengths: [{ en: "aesthetic judgment", zh: "审美判断" }, { en: "quiet care", zh: "安静关怀" }, { en: "present-moment awareness", zh: "当下感知" }], watchouts: [{ en: "may avoid direct assertion", zh: "可能不愿直接表达立场" }, { en: "can resist rigid plans", zh: "可能抗拒僵硬计划" }] },
  ESTP: { name: { en: "Energetic Improviser", zh: "行动型应变者" }, strengths: [{ en: "real-time action", zh: "实时行动" }, { en: "risk reading", zh: "风险感知" }, { en: "persuasive presence", zh: "现场说服力" }], watchouts: [{ en: "may chase stimulation", zh: "可能追求刺激感" }, { en: "can skip reflection", zh: "容易跳过复盘" }] },
  ESFP: { name: { en: "Expressive Performer", zh: "表达型体验者" }, strengths: [{ en: "people energy", zh: "人际能量" }, { en: "experiential learning", zh: "体验式学习" }, { en: "emotional warmth", zh: "情绪温度" }], watchouts: [{ en: "may postpone structure", zh: "可能延后建立结构" }, { en: "can overcommit socially", zh: "社交承诺可能过多" }] },
};

const careerTopics: CareerTopic[] = [
  ["software-engineer", "Software Engineer", "程序员", "whether this type fits coding, debugging, and product engineering", "是否适合编码、调试与产品工程"],
  ["founder", "Startup Founder", "创业者", "how this type handles uncertainty, hiring, and market pressure", "如何处理不确定性、招聘与市场压力"],
  ["product-manager", "Product Manager", "产品经理", "fit with prioritization, user research, and stakeholder tradeoffs", "与优先级、用户研究和协作取舍的匹配度"],
  ["data-analyst", "Data Analyst", "数据分析师", "strengths in metrics, pattern discovery, and business questions", "在指标、模式发现和业务问题上的优势"],
  ["designer", "Designer", "设计师", "how this type approaches taste, constraints, and iteration", "如何面对审美、约束与迭代"],
  ["teacher", "Teacher", "教师", "fit with explaining, mentoring, and classroom energy", "与讲解、指导和课堂能量的匹配度"],
  ["consultant", "Consultant", "咨询顾问", "fit with diagnosis, client pressure, and structured recommendations", "与诊断、客户压力和结构化建议的匹配度"],
  ["sales", "Sales", "销售", "how this type persuades, follows up, and handles rejection", "如何说服、跟进与处理拒绝"],
  ["lawyer", "Lawyer", "律师", "fit with argument, evidence, and sustained preparation", "与论证、证据和长期准备的匹配度"],
  ["doctor", "Doctor", "医生", "fit with precision, empathy, and high-stakes decisions", "与精确性、共情和高压决策的匹配度"],
  ["writer", "Writer", "写作者", "how this type turns ideas into publishable work", "如何把想法变成可发布作品"],
  ["manager", "Manager", "管理者", "leadership style, delegation, and team rhythm", "领导风格、授权与团队节奏"],
  ["researcher", "Researcher", "研究员", "fit with deep focus, evidence, and long feedback cycles", "与深度专注、证据和长反馈周期的匹配度"],
  ["marketing", "Marketing", "市场营销", "fit with messaging, experimentation, and audience insight", "与信息表达、实验和用户洞察的匹配度"],
  ["finance", "Finance", "金融", "fit with risk, models, and disciplined execution", "与风险、模型和纪律执行的匹配度"],
].map(([slug, enTitle, zhTitle, enAngle, zhAngle]) => ({
  slug,
  title: { en: enTitle, zh: zhTitle },
  angle: { en: enAngle, zh: zhAngle },
}));

const famousPeople: FamousPerson[] = [
  { slug: "elon-musk", name: "Elon Musk", role: { en: "technology founder", zh: "科技创业者" } },
  { slug: "mark-zuckerberg", name: "Mark Zuckerberg", role: { en: "social platform founder", zh: "社交平台创始人" } },
  { slug: "bill-gates", name: "Bill Gates", role: { en: "software entrepreneur", zh: "软件企业家" } },
  { slug: "steve-jobs", name: "Steve Jobs", role: { en: "product visionary", zh: "产品型创业者" } },
  { slug: "taylor-swift", name: "Taylor Swift", role: { en: "artist and operator", zh: "创作者与经营者" } },
  { slug: "oprah-winfrey", name: "Oprah Winfrey", role: { en: "media leader", zh: "媒体人物" } },
  { slug: "barack-obama", name: "Barack Obama", role: { en: "public leader", zh: "公共领导者" } },
  { slug: "j-k-rowling", name: "J.K. Rowling", role: { en: "novelist", zh: "小说家" } },
];

function localizeJoin(items: Localized[], locale: Locale) {
  return items.map((item) => item[locale]).join(locale === "en" ? ", " : "、");
}

function compatibilityScore(left: MbtiType, right: MbtiType) {
  const shared = Array.from(left).filter((letter, index) => letter === right[index]).length;
  const balance = left[0] !== right[0] ? 8 : 0;
  const intuitionBonus = left.includes("N") && right.includes("N") ? 8 : 0;
  return Math.min(96, 58 + shared * 8 + balance + intuitionBonus);
}

function relatedFor(type: MbtiType): MbtiSeoPage["related"] {
  return [
    { topic: "career", slug: `${type.toLowerCase()}-software-engineer`, label: { en: `${type} as a software engineer`, zh: `${type} 适合程序员吗` } },
    { topic: "love", slug: `${type.toLowerCase()}-relationship-traits`, label: { en: `${type} relationship traits`, zh: `${type} 恋爱特点` } },
    { topic: "alike", slug: `${type.toLowerCase()}-famous-people`, label: { en: `Who is ${type} most like?`, zh: `${type} 最像谁` } },
  ];
}

function careerPage(type: MbtiType, topic: CareerTopic): MbtiSeoPage {
  const profile = typeProfiles[type];
  return {
    topic: "career",
    slug: `${type.toLowerCase()}-${topic.slug}`,
    type,
    title: { en: `${type} ${topic.title.en} Career Fit`, zh: `${type} 适合做${topic.title.zh}吗` },
    description: { en: `Analyze ${type} fit for ${topic.title.en.toLowerCase()} work, including strengths, risks, and practical career advice.`, zh: `分析 ${type} 是否适合${topic.title.zh}，包含优势、风险和职业建议。` },
    h1: { en: `Is ${type} a good fit for ${topic.title.en}?`, zh: `${type} 适合做${topic.title.zh}吗？` },
    sections: [
      { title: { en: "Quick Answer", zh: "快速结论" }, body: { en: `${type} can do well in ${topic.title.en.toLowerCase()} work when the role rewards ${localizeJoin(profile.strengths, "en")}. The key question is ${topic.angle.en}.`, zh: `当岗位奖励${localizeJoin(profile.strengths, "zh")}时，${type} 通常可以胜任${topic.title.zh}。关键要看：${topic.angle.zh}。` }, bullets: profile.strengths },
      { title: { en: "Career Risks", zh: "职业风险" }, body: { en: `${profile.name.en} types usually need clear success criteria and enough autonomy. Watch the following patterns before choosing the role.`, zh: `${profile.name.zh}通常需要清晰标准和一定自主权。选择该方向前，尤其要注意这些模式。` }, bullets: profile.watchouts },
      { title: { en: "Best Work Setup", zh: "最佳工作方式" }, body: { en: `A strong setup gives ${type} ownership, feedback, and a visible path from effort to outcome. Pair the role with a manager or team that values explicit expectations.`, zh: `更适合 ${type} 的配置，是有责任边界、有反馈、能看见投入产出的环境。最好搭配重视明确预期的团队。` }, bullets: [{ en: "Define success metrics before starting", zh: "开始前定义成功指标" }, { en: "Choose roles with learning depth", zh: "选择有学习深度的岗位" }, { en: "Review energy drain every month", zh: "每月复盘能量消耗" }] },
    ],
    related: relatedFor(type),
  };
}

function lovePage(type: MbtiType): MbtiSeoPage {
  const profile = typeProfiles[type];
  return {
    topic: "love",
    slug: `${type.toLowerCase()}-relationship-traits`,
    type,
    title: { en: `${type} Relationship Traits`, zh: `${type} 恋爱特点` },
    description: { en: `Understand how ${type} behaves in dating, intimacy, conflict, and long-term relationships.`, zh: `了解 ${type} 在恋爱、亲密关系、冲突和长期相处中的表现。` },
    h1: { en: `${type} in love and relationships`, zh: `${type} 的恋爱特点` },
    sections: [
      { title: { en: "Love Style", zh: "恋爱风格" }, body: { en: `${type} often brings ${localizeJoin(profile.strengths, "en")} into relationships. They usually value partners who respect their natural pace.`, zh: `${type} 常把${localizeJoin(profile.strengths, "zh")}带入关系。他们通常重视能尊重自身节奏的伴侣。` }, bullets: profile.strengths },
      { title: { en: "Conflict Pattern", zh: "冲突模式" }, body: { en: `When stressed, ${type} may show the watch-outs below. Naming the pattern early makes repair easier.`, zh: `压力下，${type} 可能出现以下注意点。越早说清模式，越容易修复关系。` }, bullets: profile.watchouts },
      { title: { en: "Advice", zh: "相处建议" }, body: { en: `The healthiest relationship rhythm combines direct language, predictable check-ins, and room for difference.`, zh: `更健康的相处节奏，是直接表达、稳定同步，并允许双方保留差异。` }, bullets: [{ en: "Ask for needs before giving solutions", zh: "先询问需求，再给方案" }, { en: "Use weekly check-ins", zh: "建立每周同步" }, { en: "Separate personality from behavior", zh: "把人格标签和具体行为分开" }] },
    ],
    related: relatedFor(type),
  };
}

function matchPage(left: MbtiType, right: MbtiType): MbtiSeoPage {
  const score = compatibilityScore(left, right);
  return {
    topic: "match",
    slug: `${left.toLowerCase()}-${right.toLowerCase()}`,
    type: left,
    secondaryType: right,
    title: { en: `${left} and ${right} Compatibility`, zh: `${left} 和 ${right} 配对分析` },
    description: { en: `Compatibility analysis for ${left} and ${right}: score, conflict points, and relationship advice.`, zh: `${left} 和 ${right} 的契合度、冲突点与相处建议。` },
    h1: { en: `${left} and ${right} compatibility`, zh: `${left} 和 ${right} 配吗？` },
    sections: [
      { title: { en: "Compatibility Score", zh: "契合度" }, body: { en: `Estimated compatibility: ${score}%. This is a practical relationship lens, not a prediction of fate.`, zh: `估算契合度：${score}%。这是一种关系观察角度，不是命运预测。` }, bullets: [{ en: `${left} brings ${typeProfiles[left].strengths[0].en}`, zh: `${left} 带来${typeProfiles[left].strengths[0].zh}` }, { en: `${right} brings ${typeProfiles[right].strengths[0].en}`, zh: `${right} 带来${typeProfiles[right].strengths[0].zh}` }] },
      { title: { en: "Conflict Points", zh: "冲突点" }, body: { en: `Most friction appears when each side assumes their own pace is obvious.`, zh: `主要摩擦通常来自双方都默认自己的节奏“理所当然”。` }, bullets: [...typeProfiles[left].watchouts.slice(0, 1), ...typeProfiles[right].watchouts.slice(0, 1)] },
      { title: { en: "How To Get Along", zh: "相处建议" }, body: { en: `Agree on decision rules, emotional check-ins, and alone/social time before conflict escalates.`, zh: `在冲突升级前，先约定决策规则、情绪同步方式和独处/社交时间。` }, bullets: [{ en: "Make expectations explicit", zh: "把期待说具体" }, { en: "Do not use type as an accusation", zh: "不要把类型当作指责" }, { en: "Review recurring conflict patterns", zh: "复盘重复冲突模式" }] },
    ],
    related: relatedFor(left),
  };
}

function famousPage(type: MbtiType, person: FamousPerson): MbtiSeoPage {
  return {
    topic: "famous",
    slug: `${type.toLowerCase()}-${person.slug}`,
    type,
    title: { en: `Is ${person.name} ${type}?`, zh: `${person.name} 是 ${type} 吗` },
    description: { en: `A careful personality-style analysis of whether ${person.name} looks like ${type}, based on public behavior signals.`, zh: `基于公开行为线索，分析 ${person.name} 是否像 ${type}。` },
    h1: { en: `Is ${person.name} an ${type}?`, zh: `${person.name} 是 ${type} 吗？` },
    sections: [
      { title: { en: "Short Answer", zh: "简短结论" }, body: { en: `${person.name} is often discussed as a ${person.role.en}. Public behavior can resemble ${type}, but no public typing should be treated as certain without a direct assessment.`, zh: `${person.name} 常被视为${person.role.zh}。公开行为可能呈现 ${type} 的某些特征，但未亲自测评前不应当作确定结论。` }, bullets: typeProfiles[type].strengths },
      { title: { en: "Visible Signals", zh: "可观察线索" }, body: { en: `Look for repeated patterns in decisions, communication, stress response, and work style rather than isolated quotes.`, zh: `判断时应看决策、沟通、压力反应和工作方式的重复模式，而不是单句语录。` }, bullets: [{ en: "Decision style", zh: "决策风格" }, { en: "Communication rhythm", zh: "沟通节奏" }, { en: "Stress behavior", zh: "压力行为" }] },
      { title: { en: "Better Use", zh: "更好的用法" }, body: { en: `Use famous-person comparisons as a reflection prompt: which traits do you recognize, and which are just projection?`, zh: `名人对比更适合当作自我观察：哪些特质你真的认同，哪些只是投射？` }, bullets: [{ en: "Compare behavior, not status", zh: "比较行为，不比较身份" }, { en: "Avoid treating type as proof", zh: "不要把类型当证据" }] },
    ],
    related: relatedFor(type),
  };
}

function alikePage(type: MbtiType): MbtiSeoPage {
  const people = famousPeople.slice(0, 5);
  return {
    topic: "alike",
    slug: `${type.toLowerCase()}-famous-people`,
    type,
    title: { en: `Which famous people are like ${type}?`, zh: `${type} 最像哪些名人` },
    description: { en: `Shareable ${type} look-alike analysis with famous people, similarity scores, and reflection prompts.`, zh: `${type} 像谁：名人相似度、可分享结果和自我观察提示。` },
    h1: { en: `Who are ${type} people most like?`, zh: `${type} 最像谁？` },
    sections: [
      { title: { en: "Top Matches", zh: "相似人物" }, body: { en: `${type} often resonates with public figures who show ${localizeJoin(typeProfiles[type].strengths, "en")}.`, zh: `${type} 往往会对展现${localizeJoin(typeProfiles[type].strengths, "zh")}的公众人物产生共鸣。` }, bullets: people.map((person, index) => ({ en: `${person.name}: ${86 - index * 4}%`, zh: `${person.name}：${86 - index * 4}%` })) },
      { title: { en: "Share Prompt", zh: "分享提示" }, body: { en: `This page is designed for reflection and sharing after a test result. Similarity means pattern overlap, not identical life path.`, zh: `这个页面适合测试后分享。相似代表模式重叠，不代表人生路径相同。` }, bullets: [{ en: "Share the top three", zh: "分享前三个相似人物" }, { en: "Add one trait you recognize", zh: "补充一个你认可的特质" }] },
    ],
    related: relatedFor(type),
  };
}

export function getMbtiSeoPages(): MbtiSeoPage[] {
  return [
    ...mbtiTypes.flatMap((type) => careerTopics.map((topic) => careerPage(type, topic))),
    ...mbtiTypes.map((type) => lovePage(type)),
    ...mbtiTypes.flatMap((left) => mbtiTypes.map((right) => matchPage(left, right))),
    ...mbtiTypes.flatMap((type) => famousPeople.map((person) => famousPage(type, person))),
    ...mbtiTypes.map((type) => alikePage(type)),
  ];
}

export const mbtiSeoPages = getMbtiSeoPages();
export const mbtiSeoPageMap = new Map(mbtiSeoPages.map((page) => [`${page.topic}/${page.slug}`, page]));

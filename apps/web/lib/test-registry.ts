import type { Locale } from "./i18n";

export type TestCategory = "personality" | "career" | "relationship" | "intelligence" | "learning";

export type TestScoreKey = string;

export type TestAnswerScore = Partial<Record<TestScoreKey, number>>;

export type TestAnswer = {
  questionId: string;
  optionId: string;
  score: TestAnswerScore;
};

export type TestResult = {
  type: string;
  scores: Record<string, number>;
};

export type TestRegistryEntry = {
  slug: string;
  category: TestCategory;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  questionCount: number;
  estimatedMinutes: number;
  unlockCost: number;
  popular?: boolean;
  relatedTools: string[];
  resultTypes: string[];
  seo: Record<Locale, { title: string; description: string; keywords: string[] }>;
  calculator: (answers: TestAnswer[]) => TestResult;
};

const mbtiResultTypes = [
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
];

const scoreKeys: TestScoreKey[] = ["E", "I", "S", "N", "T", "F", "J", "P"];

function sumScores(answers: TestAnswer[]) {
  const scores: Record<string, number> = {};
  for (const answer of answers) {
    for (const [key, value] of Object.entries(answer.score)) {
      scores[key] = (scores[key] ?? 0) + (value ?? 0);
    }
  }
  return scores;
}

function calculateMbti(answers: TestAnswer[]): TestResult {
  const scores = { ...Object.fromEntries(scoreKeys.map((key) => [key, 0])), ...sumScores(answers) };

  const type = [
    scores.E >= scores.I ? "E" : "I",
    scores.S >= scores.N ? "S" : "N",
    scores.T >= scores.F ? "T" : "F",
    scores.J >= scores.P ? "J" : "P",
  ].join("");

  return { type, scores };
}

function calculateTopScore(answers: TestAnswer[]): TestResult {
  const scores = sumScores(answers);
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  return { type: sorted[0]?.[0] ?? "balanced", scores };
}

function calculateBurnout(answers: TestAnswer[]): TestResult {
  const scores = sumScores(answers);
  const total = scores.STRESS ?? 0;
  const type = total >= 82 ? "SEVERE" : total >= 62 ? "HIGH" : total >= 40 ? "MODERATE" : "LOW";
  return { type, scores };
}

export const testRegistry: TestRegistryEntry[] = [
  {
    slug: "mbti",
    category: "personality",
    title: {
      en: "MBTI Personality Test",
      zh: "MBTI 人格测试",
    },
    description: {
      en: "Explore your personality preferences across energy, information, decisions, and structure.",
      zh: "从精力来源、信息处理、决策方式与生活结构四个维度了解你的人格偏好。",
    },
    questionCount: 60,
    estimatedMinutes: 12,
    unlockCost: 5,
    popular: true,
    relatedTools: ["word-counter", "markdown-preview", "text-cleaner"],
    resultTypes: mbtiResultTypes,
    seo: {
      en: {
        title: "Free MBTI Personality Test Online",
        description: "Take a 60-question MBTI-style personality test and discover your type, traits, strengths, and growth direction.",
        keywords: ["mbti test", "personality test", "free mbti test", "personality type"],
      },
      zh: {
        title: "免费 MBTI 人格测试在线版",
        description: "完成 60 道 MBTI 风格人格测试题，了解你的人格类型、特质、优势与成长方向。",
        keywords: ["MBTI 测试", "人格测试", "免费 MBTI", "性格测试"],
      },
    },
    calculator: calculateMbti,
  },
  {
    slug: "career-interest",
    category: "career",
    title: { en: "Career Interest Test", zh: "职业兴趣测试" },
    description: {
      en: "Map your work interests across realistic, investigative, artistic, social, enterprising, and conventional patterns.",
      zh: "从现实型、研究型、艺术型、社会型、企业型、常规型六个方向了解你的职业兴趣。",
    },
    questionCount: 48,
    estimatedMinutes: 10,
    unlockCost: 5,
    popular: true,
    relatedTools: ["markdown-preview", "word-counter", "text-cleaner"],
    resultTypes: ["REALISTIC", "INVESTIGATIVE", "ARTISTIC", "SOCIAL", "ENTERPRISING", "CONVENTIONAL"],
    seo: {
      en: {
        title: "Free Career Interest Test Online",
        description: "Take a practical career interest test inspired by RIASEC dimensions and discover your strongest work preference.",
        keywords: ["career test", "career interest test", "riasec test", "career aptitude"],
      },
      zh: {
        title: "免费职业兴趣测试在线版",
        description: "基于 RIASEC 六维职业兴趣框架完成职业兴趣测试，找到更匹配你的工作方向。",
        keywords: ["职业兴趣测试", "霍兰德测试", "职业测试", "职业倾向"],
      },
    },
    calculator: calculateTopScore,
  },
  {
    slug: "love-language",
    category: "relationship",
    title: { en: "Love Language Test", zh: "爱的语言测试" },
    description: {
      en: "Understand how you prefer to give and receive affection across five common relationship signals.",
      zh: "从五种常见亲密关系信号中了解你更偏好的表达爱与接收爱的方式。",
    },
    questionCount: 30,
    estimatedMinutes: 7,
    unlockCost: 5,
    popular: true,
    relatedTools: ["word-counter", "markdown-preview", "text-cleaner"],
    resultTypes: ["WORDS", "TIME", "ACTS", "GIFTS", "TOUCH"],
    seo: {
      en: {
        title: "Free Love Language Test Online",
        description: "Take a 30-question relationship communication test and discover your primary love language.",
        keywords: ["love language test", "relationship test", "communication style test"],
      },
      zh: {
        title: "免费爱的语言测试在线版",
        description: "完成 30 道亲密关系沟通测试，了解你的主要爱的语言。",
        keywords: ["爱的语言测试", "亲密关系测试", "恋爱测试", "关系沟通"],
      },
    },
    calculator: calculateTopScore,
  },
  {
    slug: "burnout-check",
    category: "career",
    title: { en: "Burnout Risk Check", zh: "职业倦怠风险测试" },
    description: {
      en: "Check your recent exhaustion, cynicism, focus, and recovery signals with a non-clinical self-reflection test.",
      zh: "从疲惫感、疏离感、专注状态与恢复能力评估近期职业倦怠风险。本测试不作医学诊断。",
    },
    questionCount: 30,
    estimatedMinutes: 7,
    unlockCost: 5,
    relatedTools: ["timestamp", "word-counter", "text-cleaner"],
    resultTypes: ["LOW", "MODERATE", "HIGH", "SEVERE"],
    seo: {
      en: {
        title: "Free Burnout Risk Check Online",
        description: "Take a 30-question burnout risk check for work stress, recovery, motivation, and emotional load.",
        keywords: ["burnout test", "work stress test", "burnout risk", "stress check"],
      },
      zh: {
        title: "免费职业倦怠风险测试在线版",
        description: "通过 30 道题评估工作压力、恢复状态、动机与情绪负荷，了解你的倦怠风险。",
        keywords: ["职业倦怠测试", "压力测试", "工作压力", "倦怠风险"],
      },
    },
    calculator: calculateBurnout,
  },
  {
    slug: "learning-style",
    category: "learning",
    title: { en: "Learning Style Test", zh: "学习风格测试" },
    description: {
      en: "Find your preferred way to learn through visual, verbal, hands-on, and structured learning signals.",
      zh: "从视觉、语言、实践和结构化学习信号中找到更适合你的学习方式。",
    },
    questionCount: 32,
    estimatedMinutes: 7,
    unlockCost: 5,
    relatedTools: ["markdown-preview", "word-counter", "text-cleaner"],
    resultTypes: ["VISUAL", "VERBAL", "HANDS_ON", "STRUCTURED"],
    seo: {
      en: {
        title: "Free Learning Style Test Online",
        description: "Take a practical learning style test and discover whether visual, verbal, hands-on, or structured study fits you best.",
        keywords: ["learning style test", "study style test", "visual learner", "learning preference"],
      },
      zh: {
        title: "免费学习风格测试在线版",
        description: "完成学习风格测试，了解视觉、语言、实践或结构化学习哪种方式更适合你。",
        keywords: ["学习风格测试", "学习方式测试", "学习偏好", "学习效率"],
      },
    },
    calculator: calculateTopScore,
  },
];

export const testMap = new Map(testRegistry.map((test) => [test.slug, test]));

export function getAllTestSlugs() {
  return testRegistry.map((test) => test.slug);
}

export function getPopularTests() {
  return testRegistry.filter((test) => test.popular);
}

export function getTestsByCategory(category: TestCategory) {
  return testRegistry.filter((test) => test.category === category);
}

export function getTestCategories(): TestCategory[] {
  return ["personality", "career", "relationship", "intelligence", "learning"];
}

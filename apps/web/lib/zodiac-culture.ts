import type { Locale } from "./i18n";

export type ZodiacSignSlug =
  | "aries"
  | "taurus"
  | "gemini"
  | "cancer"
  | "leo"
  | "virgo"
  | "libra"
  | "scorpio"
  | "sagittarius"
  | "capricorn"
  | "aquarius"
  | "pisces";

export type ZodiacSign = {
  slug: ZodiacSignSlug;
  name: Record<Locale, string>;
  dateRange: Record<Locale, string>;
  element: Record<Locale, string>;
  modality: Record<Locale, string>;
  summary: Record<Locale, string>;
  strengths: Record<Locale, string[]>;
  watchouts: Record<Locale, string[]>;
  relationship: Record<Locale, string>;
  career: Record<Locale, string>;
};

const signOrder: ZodiacSignSlug[] = [
  "aries",
  "taurus",
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
  "capricorn",
  "aquarius",
  "pisces",
];

export const zodiacSigns: ZodiacSign[] = [
  {
    slug: "aries",
    name: { en: "Aries", zh: "白羊座" },
    dateRange: { en: "Mar 21 - Apr 19", zh: "3月21日 - 4月19日" },
    element: { en: "Fire", zh: "火象" },
    modality: { en: "Cardinal", zh: "开创" },
    summary: { en: "Aries moves quickly, trusts direct action, and learns by entering the arena.", zh: "白羊座行动快，重视直接表达，常常通过先开始再调整来获得动力。" },
    strengths: { en: ["Decisive starts", "Clear courage", "High momentum"], zh: ["启动速度快", "表达直接", "遇到挑战更容易被点燃"] },
    watchouts: { en: ["Impatience", "Overpromising", "Missing softer cues"], zh: ["容易急躁", "可能承诺过快", "需要留意他人的细腻感受"] },
    relationship: { en: "Aries needs room for enthusiasm and honest feedback without games.", zh: "白羊座在关系里需要热情、坦率和及时反馈，不太适合长期猜测。" },
    career: { en: "Best in roles with ownership, urgency, and visible progress.", zh: "适合有主动权、节奏明确、能看到推进感的任务。" },
  },
  {
    slug: "taurus",
    name: { en: "Taurus", zh: "金牛座" },
    dateRange: { en: "Apr 20 - May 20", zh: "4月20日 - 5月20日" },
    element: { en: "Earth", zh: "土象" },
    modality: { en: "Fixed", zh: "固定" },
    summary: { en: "Taurus values stability, tangible comfort, and decisions that can stand the test of time.", zh: "金牛座重视稳定、真实可感的安全感，以及经得起时间检验的选择。" },
    strengths: { en: ["Patience", "Consistency", "Practical taste"], zh: ["耐心稳定", "执行持久", "对品质和实际价值敏感"] },
    watchouts: { en: ["Stubborn pacing", "Slow adaptation", "Comfort-zone bias"], zh: ["节奏可能偏慢", "适应变化需要时间", "容易留在舒适区"] },
    relationship: { en: "Taurus feels loved through reliability, sensory warmth, and steady presence.", zh: "金牛座常通过稳定陪伴、真实照顾和生活质感感到被爱。" },
    career: { en: "Best in work that rewards craft, patience, and long-term compounding.", zh: "适合需要积累、打磨、长期复利的工作。" },
  },
  {
    slug: "gemini",
    name: { en: "Gemini", zh: "双子座" },
    dateRange: { en: "May 21 - Jun 21", zh: "5月21日 - 6月21日" },
    element: { en: "Air", zh: "风象" },
    modality: { en: "Mutable", zh: "变动" },
    summary: { en: "Gemini learns through exchange, curiosity, language, and fast mental movement.", zh: "双子座通过交流、好奇、语言和快速切换来理解世界。" },
    strengths: { en: ["Curiosity", "Adaptability", "Communication"], zh: ["好奇心强", "适应快", "表达和连接能力强"] },
    watchouts: { en: ["Scattered focus", "Restlessness", "Surface-level decisions"], zh: ["注意力容易分散", "容易不耐无聊", "需要避免停留在表层判断"] },
    relationship: { en: "Gemini needs conversation, humor, and mental freshness.", zh: "双子座在关系里需要对话、幽默感和持续的新鲜感。" },
    career: { en: "Best in writing, teaching, media, sales, research, and fast-changing work.", zh: "适合写作、教学、媒体、销售、研究和变化快的工作。" },
  },
  {
    slug: "cancer",
    name: { en: "Cancer", zh: "巨蟹座" },
    dateRange: { en: "Jun 22 - Jul 22", zh: "6月22日 - 7月22日" },
    element: { en: "Water", zh: "水象" },
    modality: { en: "Cardinal", zh: "开创" },
    summary: { en: "Cancer protects what matters and reads emotional temperature with unusual sensitivity.", zh: "巨蟹座会保护重要的人和事，也很擅长感知关系里的情绪温度。" },
    strengths: { en: ["Care", "Memory", "Emotional insight"], zh: ["照顾力强", "记忆细腻", "情绪洞察敏锐"] },
    watchouts: { en: ["Defensiveness", "Mood loops", "Indirect needs"], zh: ["容易防御", "可能陷入情绪循环", "需求表达有时不够直接"] },
    relationship: { en: "Cancer needs emotional safety before fully opening up.", zh: "巨蟹座通常需要足够安全感，才会真正打开自己。" },
    career: { en: "Best in support, care, people operations, hospitality, and memory-rich creative work.", zh: "适合服务、照护、人事支持、家庭生活相关和情感创作类工作。" },
  },
  {
    slug: "leo",
    name: { en: "Leo", zh: "狮子座" },
    dateRange: { en: "Jul 23 - Aug 22", zh: "7月23日 - 8月22日" },
    element: { en: "Fire", zh: "火象" },
    modality: { en: "Fixed", zh: "固定" },
    summary: { en: "Leo brings warmth, pride, creative presence, and a desire to be seen for genuine contribution.", zh: "狮子座带来热度、自尊、创造力，也希望自己的付出被真诚看见。" },
    strengths: { en: ["Confidence", "Generosity", "Creative leadership"], zh: ["有感染力", "慷慨大方", "适合带动气氛和创意表达"] },
    watchouts: { en: ["Pride wounds", "Drama under neglect", "Need for validation"], zh: ["自尊受伤时反应强", "被忽视时容易放大情绪", "需要学会自我确认"] },
    relationship: { en: "Leo thrives with admiration that feels specific and sincere.", zh: "狮子座需要具体、真诚的欣赏，而不是敷衍的夸奖。" },
    career: { en: "Best in visible leadership, performance, brand, teaching, and creative production.", zh: "适合可见度高的领导、表达、品牌、教学和创意产出。" },
  },
  {
    slug: "virgo",
    name: { en: "Virgo", zh: "处女座" },
    dateRange: { en: "Aug 23 - Sep 22", zh: "8月23日 - 9月22日" },
    element: { en: "Earth", zh: "土象" },
    modality: { en: "Mutable", zh: "变动" },
    summary: { en: "Virgo improves systems through attention, precision, and useful service.", zh: "处女座擅长通过细节、秩序和实用改进，让事情变得更好。" },
    strengths: { en: ["Precision", "Service", "Analysis"], zh: ["细节敏感", "解决问题能力强", "愿意持续优化"] },
    watchouts: { en: ["Overchecking", "Self-criticism", "Perfection delays"], zh: ["容易反复检查", "对自己要求过高", "完美主义可能拖慢行动"] },
    relationship: { en: "Virgo often shows love by helping, fixing, and remembering details.", zh: "处女座常通过帮忙、提醒和记住细节来表达在乎。" },
    career: { en: "Best in analysis, operations, editing, health, product quality, and process design.", zh: "适合分析、运营、编辑、健康、质量控制和流程设计。" },
  },
  {
    slug: "libra",
    name: { en: "Libra", zh: "天秤座" },
    dateRange: { en: "Sep 23 - Oct 23", zh: "9月23日 - 10月23日" },
    element: { en: "Air", zh: "风象" },
    modality: { en: "Cardinal", zh: "开创" },
    summary: { en: "Libra searches for balance, fairness, social grace, and decisions that preserve connection.", zh: "天秤座重视平衡、公平、审美与关系中的体面连接。" },
    strengths: { en: ["Diplomacy", "Taste", "Perspective taking"], zh: ["协调能力强", "审美敏感", "能看到多方立场"] },
    watchouts: { en: ["Indecision", "People pleasing", "Conflict avoidance"], zh: ["容易犹豫", "可能过度照顾别人", "需要练习直接面对冲突"] },
    relationship: { en: "Libra needs mutual respect, shared beauty, and decisions made together.", zh: "天秤座在关系中重视互相尊重、共同审美和一起做决定。" },
    career: { en: "Best in design, law, mediation, partnerships, client work, and brand strategy.", zh: "适合设计、法律、协调、合作关系、客户服务和品牌策略。" },
  },
  {
    slug: "scorpio",
    name: { en: "Scorpio", zh: "天蝎座" },
    dateRange: { en: "Oct 24 - Nov 22", zh: "10月24日 - 11月22日" },
    element: { en: "Water", zh: "水象" },
    modality: { en: "Fixed", zh: "固定" },
    summary: { en: "Scorpio seeks depth, loyalty, truth, and transformation beneath the surface.", zh: "天蝎座追求深度、忠诚、真实，也常能看见表面之下的变化。" },
    strengths: { en: ["Depth", "Focus", "Emotional courage"], zh: ["洞察深", "专注力强", "敢面对复杂情绪"] },
    watchouts: { en: ["Control loops", "Suspicion", "All-or-nothing reactions"], zh: ["容易想掌控", "不信任时会反复确认", "反应可能走向极端"] },
    relationship: { en: "Scorpio needs trust that is proven through consistency, not just words.", zh: "天蝎座需要通过稳定行动建立信任，而不只是语言承诺。" },
    career: { en: "Best in research, psychology, finance, investigation, crisis work, and strategy.", zh: "适合研究、心理、金融、调查、危机处理和策略工作。" },
  },
  {
    slug: "sagittarius",
    name: { en: "Sagittarius", zh: "射手座" },
    dateRange: { en: "Nov 23 - Dec 21", zh: "11月23日 - 12月21日" },
    element: { en: "Fire", zh: "火象" },
    modality: { en: "Mutable", zh: "变动" },
    summary: { en: "Sagittarius follows meaning, freedom, learning, and the horizon beyond current limits.", zh: "射手座追寻意义、自由、学习，以及眼前限制之外的更大世界。" },
    strengths: { en: ["Optimism", "Big-picture thinking", "Exploration"], zh: ["乐观开阔", "看大方向", "探索欲强"] },
    watchouts: { en: ["Bluntness", "Restless exits", "Skipping details"], zh: ["表达可能太直接", "不耐束缚时会想逃开", "容易忽略细节"] },
    relationship: { en: "Sagittarius needs room to grow and a partner who can laugh through uncertainty.", zh: "射手座需要成长空间，也欣赏能一起面对未知的人。" },
    career: { en: "Best in education, travel, publishing, strategy, international work, and entrepreneurship.", zh: "适合教育、旅行、出版、战略、国际化和创业相关工作。" },
  },
  {
    slug: "capricorn",
    name: { en: "Capricorn", zh: "摩羯座" },
    dateRange: { en: "Dec 22 - Jan 19", zh: "12月22日 - 1月19日" },
    element: { en: "Earth", zh: "土象" },
    modality: { en: "Cardinal", zh: "开创" },
    summary: { en: "Capricorn builds durable results through discipline, responsibility, and long-range planning.", zh: "摩羯座通过纪律、责任感和长期规划，建立经得起时间检验的成果。" },
    strengths: { en: ["Discipline", "Responsibility", "Strategic patience"], zh: ["自律务实", "责任感强", "能做长期规划"] },
    watchouts: { en: ["Emotional restraint", "Overwork", "Harsh self-judgment"], zh: ["情绪表达偏克制", "容易过度工作", "对自己可能太严厉"] },
    relationship: { en: "Capricorn shows love through commitment, planning, and practical support.", zh: "摩羯座常通过承诺、规划和实际支持表达感情。" },
    career: { en: "Best in management, operations, finance, engineering, law, and long-term building.", zh: "适合管理、运营、金融、工程、法律和长期建设型工作。" },
  },
  {
    slug: "aquarius",
    name: { en: "Aquarius", zh: "水瓶座" },
    dateRange: { en: "Jan 20 - Feb 18", zh: "1月20日 - 2月18日" },
    element: { en: "Air", zh: "风象" },
    modality: { en: "Fixed", zh: "固定" },
    summary: { en: "Aquarius thinks in systems, future possibilities, communities, and unconventional patterns.", zh: "水瓶座擅长系统思考，关注未来可能、群体议题和非传统路径。" },
    strengths: { en: ["Originality", "Systems thinking", "Independence"], zh: ["想法独特", "系统感强", "重视独立和边界"] },
    watchouts: { en: ["Emotional distance", "Contrarian reflex", "Detached decisions"], zh: ["情感表达可能显得疏离", "容易本能反向思考", "需要照顾具体人的感受"] },
    relationship: { en: "Aquarius needs friendship, freedom, and respect for difference.", zh: "水瓶座在关系里需要朋友感、自由度和对差异的尊重。" },
    career: { en: "Best in technology, social systems, research, product thinking, and future-facing work.", zh: "适合科技、社会系统、研究、产品思维和面向未来的工作。" },
  },
  {
    slug: "pisces",
    name: { en: "Pisces", zh: "双鱼座" },
    dateRange: { en: "Feb 19 - Mar 20", zh: "2月19日 - 3月20日" },
    element: { en: "Water", zh: "水象" },
    modality: { en: "Mutable", zh: "变动" },
    summary: { en: "Pisces senses atmosphere, imagination, compassion, and the emotional undercurrent of a room.", zh: "双鱼座对氛围、想象、共情和情绪暗流很敏感。" },
    strengths: { en: ["Empathy", "Imagination", "Emotional intuition"], zh: ["共情力强", "想象力丰富", "情绪直觉敏锐"] },
    watchouts: { en: ["Blurred boundaries", "Escapism", "Absorbing others' moods"], zh: ["边界容易模糊", "压力下可能逃避", "容易吸收他人情绪"] },
    relationship: { en: "Pisces needs tenderness, creativity, and clear boundaries that keep softness safe.", zh: "双鱼座需要温柔、想象力，也需要清晰边界来保护柔软。" },
    career: { en: "Best in art, healing, service, storytelling, spirituality, and emotionally aware work.", zh: "适合艺术、疗愈、服务、叙事、身心灵和情绪敏感型工作。" },
  },
];

export const zodiacSignSlugs = signOrder;

export function getZodiacSign(slug: string) {
  return zodiacSigns.find((sign) => sign.slug === slug);
}

function signIndex(slug: ZodiacSignSlug) {
  return signOrder.indexOf(slug);
}

function pairTone(distance: number, sameElement: boolean) {
  if (sameElement) return "flow";
  if (distance === 6) return "mirror";
  if (distance <= 2) return "spark";
  if (distance === 3 || distance === 9) return "growth";
  return "steady";
}

export function getZodiacCompatibility(firstSlug: ZodiacSignSlug, secondSlug: ZodiacSignSlug, locale: Locale) {
  const first = getZodiacSign(firstSlug)!;
  const second = getZodiacSign(secondSlug)!;
  const a = signIndex(firstSlug);
  const b = signIndex(secondSlug);
  const distance = Math.min(Math.abs(a - b), 12 - Math.abs(a - b));
  const sameElement = first.element.en === second.element.en;
  const score = Math.min(98, Math.max(55, 72 + (sameElement ? 14 : 0) + (firstSlug === secondSlug ? 9 : 0) + (distance === 6 ? 5 : 0) - Math.max(0, distance - 3) * 4));
  const tone = pairTone(distance, sameElement);
  const toneText = {
    flow: { en: "Natural flow", zh: "自然顺流" },
    mirror: { en: "Mirror attraction", zh: "镜像吸引" },
    spark: { en: "Fast spark", zh: "快速来电" },
    growth: { en: "Growth pairing", zh: "成长型组合" },
    steady: { en: "Steady practice", zh: "需要磨合" },
  }[tone];
  return {
    first,
    second,
    score,
    tone: toneText[locale],
    attraction:
      locale === "zh"
        ? `${first.name.zh}带来的${first.element.zh}能量，会被${second.name.zh}的${second.modality.zh}节奏激活。两个人容易在新鲜感、互相补位或共同目标里找到连接。`
        : `${first.name.en}'s ${first.element.en.toLowerCase()} energy can be activated by ${second.name.en}'s ${second.modality.en.toLowerCase()} rhythm. The pair often connects through novelty, complementary roles, or shared goals.`,
    friction:
      locale === "zh"
        ? `真正的挑战通常不在喜欢与否，而在节奏管理：一个人想推进时，另一个人可能更需要确认、空间或稳定感。`
        : `The main challenge is usually rhythm rather than attraction: when one person wants movement, the other may need reassurance, space, or stability.`,
    advice:
      locale === "zh"
        ? "把期待说具体，不要只靠暗示。每周留出一次轻量复盘，比等矛盾爆发后再处理更有效。"
        : "Make expectations specific instead of relying on hints. A light weekly check-in works better than waiting until tension becomes obvious.",
  };
}

export function getZodiacByDate(month: number, day: number) {
  const value = month * 100 + day;
  if (value >= 321 && value <= 419) return "aries";
  if (value >= 420 && value <= 520) return "taurus";
  if (value >= 521 && value <= 621) return "gemini";
  if (value >= 622 && value <= 722) return "cancer";
  if (value >= 723 && value <= 822) return "leo";
  if (value >= 823 && value <= 922) return "virgo";
  if (value >= 923 && value <= 1023) return "libra";
  if (value >= 1024 && value <= 1122) return "scorpio";
  if (value >= 1123 && value <= 1221) return "sagittarius";
  if (value >= 1222 || value <= 119) return "capricorn";
  if (value >= 120 && value <= 218) return "aquarius";
  return "pisces";
}

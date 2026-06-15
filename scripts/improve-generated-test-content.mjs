import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(".");

const testNames = {
  "big-five": ["大五人格测试", "Big Five Personality Test"],
  enneagram: ["九型人格测试", "Enneagram Test"],
  disc: ["DISC 性格测试", "DISC Personality Test"],
  "attachment-style": ["依恋类型测试", "Attachment Style Test"],
  "communication-style": ["沟通风格测试", "Communication Style Test"],
  eq: ["情绪智力测试", "Emotional Intelligence Test"],
  procrastination: ["拖延程度测试", "Procrastination Test"],
  "time-management": ["时间管理风格测试", "Time Management Style Test"],
  resilience: ["心理韧性测试", "Resilience Test"],
  "conflict-style": ["冲突处理风格测试", "Conflict Style Test"],
  "leadership-style": ["领导力风格测试", "Leadership Style Test"],
  "team-role": ["团队角色测试", "Team Role Test"],
  "decision-style": ["决策风格测试", "Decision Style Test"],
  "work-values": ["职场价值观测试", "Work Values Test"],
  creativity: ["创造力风格测试", "Creativity Style Test"],
};

const labels = {
  OPENNESS: ["开放探索", "Openness"],
  CONSCIENTIOUSNESS: ["尽责规划", "Conscientiousness"],
  EXTRAVERSION: ["外向能量", "Extraversion"],
  AGREEABLENESS: ["宜人合作", "Agreeableness"],
  NEUROTICISM: ["情绪敏感", "Emotional Sensitivity"],
  REFORMER: ["原则改革者", "Reformer"],
  HELPER: ["支持助人者", "Helper"],
  ACHIEVER: ["目标成就者", "Achiever"],
  INDIVIDUALIST: ["独特感受者", "Individualist"],
  INVESTIGATOR: ["理性观察者", "Investigator"],
  LOYALIST: ["谨慎守护者", "Loyalist"],
  ENTHUSIAST: ["热情探索者", "Enthusiast"],
  CHALLENGER: ["坚定挑战者", "Challenger"],
  PEACEMAKER: ["和平协调者", "Peacemaker"],
  DOMINANCE: ["主导型", "Dominance"],
  INFLUENCE: ["影响型", "Influence"],
  STEADINESS: ["稳定型", "Steadiness"],
  COMPLIANCE: ["谨慎型", "Compliance"],
  SECURE: ["安全型", "Secure"],
  ANXIOUS: ["焦虑型", "Anxious"],
  AVOIDANT: ["回避型", "Avoidant"],
  FEARFUL: ["矛盾型", "Fearful"],
  ASSERTIVE: ["坚定表达型", "Assertive"],
  ANALYTICAL: ["分析型", "Analytical"],
  EXPRESSIVE: ["表达型", "Expressive"],
  SUPPORTIVE: ["支持型", "Supportive"],
  SELF_AWARENESS: ["自我觉察", "Self Awareness"],
  SELF_REGULATION: ["情绪调节", "Self Regulation"],
  EMPATHY: ["共情理解", "Empathy"],
  SOCIAL_SKILL: ["社交协调", "Social Skill"],
  LOW: ["低风险", "Low"],
  MODERATE: ["中等风险", "Moderate"],
  HIGH: ["高风险", "High"],
  SEVERE: ["严重风险", "Severe"],
  PLANNER: ["计划型", "Planner"],
  SPRINTER: ["冲刺型", "Sprinter"],
  FLEXIBLE: ["弹性型", "Flexible"],
  REACTIVE: ["响应型", "Reactive"],
  STEADY: ["稳定恢复型", "Steady"],
  RECOVERING: ["恢复调整型", "Recovering"],
  STRAINED: ["持续紧绷型", "Strained"],
  FRAGILE: ["脆弱消耗型", "Fragile"],
  COLLABORATING: ["协作型", "Collaborating"],
  COMPETING: ["竞争型", "Competing"],
  COMPROMISING: ["折中型", "Compromising"],
  AVOIDING: ["回避型", "Avoiding"],
  ACCOMMODATING: ["迁就型", "Accommodating"],
  COACH: ["教练型", "Coach"],
  VISIONARY: ["愿景型", "Visionary"],
  OPERATOR: ["运营型", "Operator"],
  DEMOCRATIC: ["共创型", "Democratic"],
  COORDINATOR: ["协调者", "Coordinator"],
  CREATOR: ["创意者", "Creator"],
  IMPLEMENTER: ["执行者", "Implementer"],
  ANALYST: ["分析者", "Analyst"],
  SUPPORTER: ["支持者", "Supporter"],
  INTUITIVE: ["直觉型", "Intuitive"],
  DEPENDENT: ["依赖型", "Dependent"],
  SPONTANEOUS: ["即兴型", "Spontaneous"],
  AUTONOMY: ["自主自由", "Autonomy"],
  IMPACT: ["影响价值", "Impact"],
  SECURITY: ["稳定安全", "Security"],
  MASTERY: ["专业精进", "Mastery"],
  RECOGNITION: ["认可回报", "Recognition"],
  IDEATOR: ["点子发散者", "Ideator"],
  MAKER: ["动手实现者", "Maker"],
  REFINER: ["打磨优化者", "Refiner"],
  CONNECTOR: ["连接整合者", "Connector"],
};

const zhTemplates = {
  default: [
    "遇到重要选择时，我会自然地把「{label}」放在很靠前的位置。",
    "别人评价我时，常会提到我在「{label}」上的表现。",
    "压力变大时，我仍会下意识用「{label}」的方式处理问题。",
    "如果环境长期压制「{label}」，我会明显感到不舒服。",
    "和别人合作时，我通常会把「{label}」带进互动方式里。",
    "回看最近三个月，我确实多次表现出「{label}」这一模式。",
  ],
  "work-values": [
    "选择工作机会时，我会优先看它能否满足「{label}」。",
    "如果岗位缺少「{label}」，即使薪资不错，我也很难长期投入。",
    "和上级沟通期待时，我最希望对方理解我对「{label}」的重视。",
    "做职业规划时，「{label}」会影响我接受或拒绝一个机会。",
    "当工作状态变差时，通常和「{label}」长期得不到满足有关。",
    "我愿意为了更强的「{label}」放弃一部分不那么重要的条件。",
  ],
  "attachment-style": [
    "关系变亲近时，我对安全感的处理更接近「{label}」。",
    "对方回复变慢或态度变化时，我常出现「{label}」相关反应。",
    "发生争执后，我修复关系的方式往往带有「{label}」特点。",
    "当我需要表达依赖或边界时，「{label}」会影响我的语气和行动。",
    "越在乎一个人，我越容易显露出「{label}」这一关系模式。",
    "回看过去的亲密关系，我能看到「{label}」反复出现。",
  ],
  eq: [
    "情绪上来时，我通常能看见自己在「{label}」上的真实状态。",
    "和别人沟通矛盾时，「{label}」会明显影响我的处理方式。",
    "面对压力或误解，我常用「{label}」帮助自己稳住局面。",
    "我能从对方的语气和表情里捕捉到与「{label}」有关的线索。",
    "团队气氛紧张时，我会主动运用「{label}」让交流继续下去。",
    "最近一次冲突里，我能看到自己使用了「{label}」能力。",
  ],
  procrastination: [
    "任务临近截止时，我的拖延状态更接近「{label}」。",
    "面对复杂任务，我开始行动的难度常体现出「{label}」。",
    "当任务没有明确反馈时，我更容易进入「{label}」模式。",
    "我拖延时最常见的理由和「{label}」有关。",
    "别人催促我时，我的反应通常会暴露「{label}」程度。",
    "过去一周，我能明显观察到「{label}」相关行为。",
  ],
  "time-management": [
    "安排一天任务时，我的节奏更像「{label}」。",
    "遇到临时变化时，我通常会用「{label}」方式重新分配时间。",
    "截止日期靠近时，我的效率模式会明显呈现「{label}」。",
    "如果同时有多个任务，我更习惯用「{label}」来决定先后。",
    "别人和我协作时，常能感受到我的「{label}」时间风格。",
    "最近一次高压工作里，我主要依靠「{label}」完成推进。",
  ],
  resilience: [
    "经历压力事件后，我的恢复速度更接近「{label}」。",
    "连续忙碌几天后，我的身心状态会呈现「{label}」特点。",
    "遇到挫折时，我维持行动的方式常和「{label}」有关。",
    "睡眠、情绪和注意力变化能反映出我的「{label}」状态。",
    "别人需要我承担额外压力时，我通常表现出「{label}」。",
    "回顾最近一个月，我的压力恢复曲线更像「{label}」。",
  ],
  "leadership-style": [
    "带人推进目标时，我最自然的领导方式是「{label}」。",
    "团队失去方向时，我会倾向用「{label}」来重新组织大家。",
    "做决策前，我通常会以「{label}」方式收集信息和影响他人。",
    "面对成员状态不一时，我的管理动作常体现「{label}」。",
    "项目卡住时，我会优先启动「{label}」相关的领导行为。",
    "别人评价我的带队方式时，常会提到「{label}」。",
  ],
  "team-role": [
    "团队分工不清时，我最容易承担「{label}」角色。",
    "项目推进中，我常用「{label}」方式补上团队缺口。",
    "讨论进入混乱时，我会自然展现「{label}」贡献。",
    "团队需要结果时，我的行动更接近「{label}」。",
    "和不同性格的人合作时，我常被推到「{label}」位置。",
    "回看最近一次协作，我最明显的角色是「{label}」。",
  ],
  "decision-style": [
    "面对重要选择时，我的第一反应更接近「{label}」。",
    "信息不完整时，我仍会用「{label}」方式做判断。",
    "当别人催我决定时，我最常表现出「{label}」。",
    "复盘错误决定时，我能看到「{label}」的影响。",
    "在风险和机会之间取舍时，我更依赖「{label}」。",
    "最近一次重大决定里，我主要用了「{label}」模式。",
  ],
  creativity: [
    "开始创作或解决问题时，我最自然的入口是「{label}」。",
    "从想法到作品的过程中，我常承担「{label}」角色。",
    "当灵感不够时，我会用「{label}」方式重新打开局面。",
    "和别人共创时，我最能贡献「{label}」相关价值。",
    "面对粗糙初稿，我通常会启动「{label}」模式。",
    "最近一次完成作品时，我最明显的创造力风格是「{label}」。",
  ],
};

const enTemplates = [
  "In recent real situations, I can see a clear {label} pattern in how I choose and act.",
  "When pressure rises, I often rely on a {label} strategy instead of switching styles.",
  "People who work with me would probably notice my {label} tendency.",
  "If an environment blocks {label} for too long, my motivation drops.",
  "During collaboration, I often bring {label} into the way I contribute.",
  "Looking back over the last month, {label} describes a repeated behavior pattern for me.",
];

function makeResult(key, locale, slug) {
  const [zh, en] = labels[key] ?? [key, key];
  const [zhName, enName] = testNames[slug];
  if (locale === "zh") {
    return {
      title: zh,
      summary: `在这份${zhName}中，你的结果是「${zh}」。这表示你的作答更集中在「${zh}」所代表的行为、需求或反应方式。`,
      traits: [`重视${zh}`, "模式较稳定", "会受环境影响"],
      strengths: [`在需要${zh}的任务里更容易进入状态`, "容易形成可复用的处理方式", "能较快捕捉到影响表现的关键线索"],
      weaknesses: ["压力下可能过度依赖单一策略", "容易忽略相反视角", "需要避免把测评结果当成限制"],
      careers: ["找出最常触发这种模式的具体任务", "选择更匹配该倾向的工作安排", "用一次小实验验证调整方向"],
      relationships: [`向他人说明你对「${zh}」的需求，同时保留对方不同节奏的空间。`],
      growthPlan: ["记录一周内的典型表现", "选择一个需要微调的行为", "在低压力场景练习新的回应方式"],
    };
  }
  return {
    title: en,
    summary: `In this ${enName}, your result is ${en}. Your answers cluster around the behaviors, needs, or reactions represented by this pattern.`,
    traits: [`Values ${en}`, "Repeatable pattern", "Context sensitive"],
    strengths: [`You can create leverage in tasks that reward ${en}`, "You tend to build repeatable strategies", "You notice the cues that affect your performance"],
    weaknesses: ["Under pressure, you may overuse one strategy", "Opposite perspectives can be easy to miss", "The result should guide you rather than limit you"],
    careers: ["Find the situations that trigger this pattern", "Choose tasks that fit the tendency", "Test one small adjustment"],
    relationships: [`Explain your need for ${en} clearly while leaving room for other people's pace and style.`],
    growthPlan: ["Track the pattern for one week", "Choose one behavior to adjust", "Practice the new move in a low-risk situation"],
  };
}

function improveQuestions(data, slug, locale) {
  const seen = {};
  const templates = locale === "zh" ? (zhTemplates[slug] ?? zhTemplates.default) : enTemplates;
  data.scaleQuestions = data.scaleQuestions.map((question) => {
    const key = question.scoreKey;
    const index = seen[key] ?? 0;
    seen[key] = index + 1;
    const [zh, en] = labels[key] ?? [key, key];
    const label = locale === "zh" ? zh : en;
    return {
      ...question,
      question: templates[index % templates.length].replaceAll("{label}", label),
    };
  });
}

for (const slug of Object.keys(testNames)) {
  for (const locale of ["zh", "en"]) {
    const file = path.join(root, "apps/web/content/tests", slug, `${locale}.json`);
    const raw = await fs.readFile(file, "utf8");
    const data = JSON.parse(raw);
    const [zhName, enName] = testNames[slug];
    data.title = locale === "zh" ? zhName : enName;
    data.description =
      locale === "zh"
        ? `通过更贴近真实场景的问题，了解你的${zhName.replace("测试", "")}模式。`
        : `Explore your ${enName.replace(" Test", "").toLowerCase()} pattern with practical, scenario-based questions.`;
    data.instructions =
      locale === "zh"
        ? ["请根据最近真实行为作答，不要按理想中的自己选择。", "如果某句话让你想到具体经历，通常说明它更有参考价值。", "结果用于自我理解和沟通参考，不是诊断或定论。"]
        : ["Answer from recent real behavior, not an ideal version of yourself.", "If a statement reminds you of a concrete situation, it is usually more useful.", "Use the result for reflection and communication, not as a diagnosis."];
    if (Array.isArray(data.scaleQuestions)) improveQuestions(data, slug, locale);
    data.results = Object.fromEntries(Object.keys(data.results).map((key) => [key, makeResult(key, locale, slug)]));
    if (locale === "zh") {
      data.reportLabels = { strengths: "优势", weaknesses: "风险", careers: "适合场景", relationships: "关系提示", growth: "成长计划" };
    }
    await fs.writeFile(file, `${JSON.stringify(data, null, 2)}\n`);
  }
}

const severityScaleZh = [
  { id: "1", text: "完全不符合", value: 1 },
  { id: "2", text: "较少符合", value: 2 },
  { id: "3", text: "有时符合", value: 3 },
  { id: "4", text: "比较符合", value: 4 },
  { id: "5", text: "非常符合", value: 5 },
];

const severityScaleEn = [
  { id: "1", text: "Not at all true", value: 1 },
  { id: "2", text: "Rarely true", value: 2 },
  { id: "3", text: "Sometimes true", value: 3 },
  { id: "4", text: "Often true", value: 4 },
  { id: "5", text: "Very true", value: 5 },
];

function severityQuestions(scoreKey, questions) {
  return questions.map((question, index) => ({
    id: `${scoreKey.toLowerCase()}_${index + 1}`,
    question,
    scoreKey,
  }));
}

function riskResult(title, summary, level, locale) {
  if (locale === "zh") {
    return {
      title,
      summary,
      traits: level === "low" ? ["启动较快", "能自我修正", "拖延影响较小"] : level === "severe" ? ["启动困难明显", "压力累积较高", "影响学习或工作节奏"] : ["偶尔卡住", "受任务清晰度影响", "需要更稳定的启动机制"],
      strengths: level === "low" ? ["多数任务能按时推进", "能较快从分心中拉回", "自我管理基础较好"] : ["已经能觉察拖延模式", "适合从降低启动门槛开始", "通过外部结构能明显改善"],
      weaknesses: level === "low" ? ["仍可能在模糊任务上拖延", "容易低估长期项目", "忙碌时会牺牲复盘"] : ["任务越大越容易回避", "截止前压力会明显上升", "容易用自责替代行动"],
      careers: ["把任务拆成 15 分钟起步动作", "先定义完成标准，再开始执行", "为重要任务设置中途检查点"],
      relationships: ["如果拖延影响协作，请提前说明进度和下一步，不要等到最后一刻才解释。"],
      growthPlan: ["今天选一个被拖延的任务，只做第一步", "把下一个截止日期提前 24 小时", "记录一周内最常触发拖延的任务类型"],
    };
  }
  return {
    title,
    summary,
    traits: level === "low" ? ["Starts quickly", "Self-corrects", "Low disruption"] : level === "severe" ? ["Hard to start", "High pressure buildup", "Work rhythm is affected"] : ["Sometimes stuck", "Sensitive to task clarity", "Needs a steadier start routine"],
    strengths: level === "low" ? ["Most tasks move on time", "You recover from distraction quickly", "Your self-management base is solid"] : ["You can already notice the delay pattern", "Lowering the start barrier will help", "External structure can improve follow-through"],
    weaknesses: level === "low" ? ["Ambiguous tasks can still stall", "Long projects may be underestimated", "Reflection can disappear when busy"] : ["Large tasks can trigger avoidance", "Pressure rises close to deadlines", "Self-blame can replace action"],
    careers: ["Break tasks into a 15-minute start", "Define done before execution", "Set midpoint checks for important work"],
    relationships: ["If delay affects collaboration, share progress and the next step early instead of explaining at the last minute."],
    growthPlan: ["Choose one delayed task and do only the first step today", "Move the next deadline 24 hours earlier", "Track the task types that trigger delay this week"],
  };
}

function resilienceResult(title, summary, level, locale) {
  if (locale === "zh") {
    return {
      title,
      summary,
      traits: level === "steady" ? ["恢复速度较好", "压力下仍能行动", "节奏相对稳定"] : level === "fragile" ? ["恢复变慢", "容易被压力打断", "需要优先补充资源"] : ["恢复能力有波动", "压力下容易紧绷", "需要更稳定的恢复安排"],
      strengths: level === "steady" ? ["遇到挫折后能较快回到任务", "能区分问题和情绪", "有一定自我修复方法"] : ["已经能识别消耗信号", "通过睡眠、边界和支持能改善", "适合先恢复基本节奏"],
      weaknesses: level === "steady" ? ["可能忽略早期疲劳信号", "容易替别人多承担", "长期压力下仍需要恢复窗口"] : ["连续压力会明显影响专注", "容易把短期挫折放大", "恢复不足时判断会变保守"],
      careers: ["保留固定恢复时间", "把压力源分成可控和不可控", "在高压项目中提前设置求助点"],
      relationships: ["让身边人知道你在压力下需要什么支持：安静、陪伴、具体帮助或更清晰的信息。"],
      growthPlan: ["本周固定一个恢复时段", "列出三个最常见压力源", "给一个可信任的人说明你的支持需求"],
    };
  }
  return {
    title,
    summary,
    traits: level === "steady" ? ["Recovers well", "Keeps acting under stress", "Stable rhythm"] : level === "fragile" ? ["Recovery is slower", "Stress interrupts focus", "Needs resource repair first"] : ["Recovery fluctuates", "Stress creates tension", "Needs a steadier recovery plan"],
    strengths: level === "steady" ? ["You return to tasks after setbacks", "You can separate problems from emotion", "You have some repair routines"] : ["You can identify depletion signals", "Sleep, boundaries, and support can help", "Rebuilding rhythm is the best first move"],
    weaknesses: level === "steady" ? ["Early fatigue cues may be missed", "You may carry too much for others", "Long pressure still needs recovery windows"] : ["Repeated stress affects focus", "Short setbacks can feel larger", "Low recovery can make judgment too cautious"],
    careers: ["Protect regular recovery time", "Separate controllable and uncontrollable stressors", "Set help points before high-pressure projects"],
    relationships: ["Tell people what support helps under stress: quiet, company, practical help, or clearer information."],
    growthPlan: ["Block one recovery period this week", "List your three most common stressors", "Tell one trusted person what support you need"],
  };
}

async function writeSpecialScaleTest(slug, locale, data) {
  const file = path.join(root, "apps/web/content/tests", slug, `${locale}.json`);
  const current = JSON.parse(await fs.readFile(file, "utf8"));
  await fs.writeFile(file, `${JSON.stringify({ ...current, ...data }, null, 2)}\n`);
}

await writeSpecialScaleTest("procrastination", "zh", {
  description: "通过近期任务启动、截止压力和回避行为，评估你的拖延程度。",
  reportLabels: { strengths: "可用优势", weaknesses: "主要风险", careers: "行动建议", relationships: "协作提示", growth: "改善计划" },
  scale: severityScaleZh,
  scaleQuestions: severityQuestions("PROCRASTINATION", [
    "明知道任务重要，我仍会先去做更轻松的小事。",
    "任务越复杂，我越容易迟迟不开始。",
    "没有明确截止日期时，我很难主动推进。",
    "我经常等到压力足够大，才真正进入状态。",
    "开始前，我会反复准备资料，却没有实际推进。",
    "我会用刷手机、整理桌面或查资料来回避核心任务。",
    "想到任务结果可能不够好时，我会更想推迟。",
    "别人询问进度时，我才意识到自己拖了很久。",
    "任务拆得不清楚时，我会直接停在原地。",
    "我常低估完成任务需要的时间。",
    "拖延后，我会陷入自责，但下一次仍重复类似模式。",
    "临近截止时，我的睡眠或情绪会被明显影响。",
    "我会因为不知道从哪里开始而放弃开始。",
    "即使有时间，我也常把重要任务留到最后。",
    "我需要外部提醒或监督，才能稳定推进。",
    "当任务涉及评价或比较时，我更容易拖延。",
    "我经常把任务想得很大，导致第一步变得很难。",
    "我会在多个任务之间切换，却很少真正完成。",
    "拖延已经影响到我的学习、工作或协作节奏。",
    "我常用“状态不好”作为推迟开始的理由。",
    "如果任务没有即时反馈，我会很快失去动力。",
    "我会逃避查看和任务有关的信息或消息。",
    "我经常需要最后一刻的紧张感才能完成。",
    "拖延带来的后果已经让我想认真调整。",
  ]),
  results: {
    LOW: riskResult("低拖延风险", "你的拖延指数较低。多数任务能够正常启动和完成，偶尔拖延更可能来自任务不清晰或短期疲劳。", "low", "zh"),
    MODERATE: riskResult("中等拖延风险", "你的拖延指数处于中等水平。你并不是不想完成任务，而是容易在任务复杂、反馈模糊或压力不足时卡住。", "moderate", "zh"),
    HIGH: riskResult("高拖延风险", "你的拖延指数偏高。拖延已经开始影响任务质量、截止压力或协作节奏，需要建立更明确的启动和反馈机制。", "high", "zh"),
    SEVERE: riskResult("严重拖延风险", "你的拖延指数很高。拖延可能已经明显影响学习、工作或生活节奏，建议优先降低任务压力并寻求外部支持。", "severe", "zh"),
  },
});

await writeSpecialScaleTest("procrastination", "en", {
  description: "Measure procrastination through recent task starts, deadline pressure, and avoidance behavior.",
  scale: severityScaleEn,
  scaleQuestions: severityQuestions("PROCRASTINATION", [
    "I know a task matters, but I still choose easier small tasks first.",
    "The more complex a task is, the harder it is for me to start.",
    "Without a clear deadline, I struggle to move work forward.",
    "I often need pressure before I can fully engage.",
    "I prepare around the task without actually progressing.",
    "I use phone checks, desk cleaning, or research to avoid the core task.",
    "When the result may not be good enough, I want to delay.",
    "I notice how long I have delayed only when someone asks for progress.",
    "When the next step is unclear, I stop.",
    "I often underestimate how long a task will take.",
    "After delaying, I feel guilty but repeat the pattern.",
    "Close deadlines noticeably affect my sleep or mood.",
    "Not knowing where to begin keeps me from beginning at all.",
    "Even when I have time, I leave important tasks until late.",
    "I need reminders or supervision to keep moving.",
    "Tasks involving evaluation or comparison make me delay more.",
    "I make tasks feel so large that the first step becomes hard.",
    "I switch between tasks without finishing much.",
    "Procrastination affects my study, work, or collaboration rhythm.",
    "I often use not being in the right state as a reason to postpone.",
    "If a task has no immediate feedback, I lose motivation quickly.",
    "I avoid checking messages or information related to the task.",
    "I often need last-minute pressure to finish.",
    "The consequences of delay have made me want to change seriously.",
  ]),
  results: {
    LOW: riskResult("Low procrastination risk", "Your procrastination index is low. Most tasks start and finish normally; delays usually come from unclear tasks or short-term fatigue.", "low", "en"),
    MODERATE: riskResult("Moderate procrastination risk", "Your procrastination index is moderate. You are not unwilling to finish; you tend to get stuck when tasks are complex, feedback is vague, or pressure is low.", "moderate", "en"),
    HIGH: riskResult("High procrastination risk", "Your procrastination index is high. Delay is starting to affect quality, deadline pressure, or collaboration rhythm.", "high", "en"),
    SEVERE: riskResult("Severe procrastination risk", "Your procrastination index is very high. Delay may be affecting study, work, or daily rhythm; reduce task pressure and seek outside support first.", "severe", "en"),
  },
});

await writeSpecialScaleTest("resilience", "zh", {
  description: "通过压力后的恢复速度、情绪稳定和持续行动能力，评估你的心理韧性。",
  reportLabels: { strengths: "可用资源", weaknesses: "脆弱点", careers: "恢复建议", relationships: "支持提示", growth: "改善计划" },
  scale: severityScaleZh,
  scaleQuestions: severityQuestions("RESILIENCE", [
    "遇到挫折后，我能在较短时间内重新开始行动。",
    "压力很大时，我仍能分清哪些事可以控制。",
    "我有固定的方法帮助自己从疲惫中恢复。",
    "计划被打乱后，我能重新安排优先级。",
    "情绪低落时，我仍能完成最关键的小任务。",
    "我能比较早觉察自己快要过载。",
    "连续忙碌后，我会主动安排休息而不是硬撑。",
    "遇到批评或失败时，我能把事件和自我价值分开。",
    "我愿意在压力过大时寻求帮助。",
    "睡眠不足或疲惫时，我会降低要求而不是彻底放弃。",
    "面对不确定性，我能先做一个可控的小动作。",
    "我能从过去的困难里总结出下一次可用的方法。",
    "压力上来时，我会先稳定呼吸或节奏。",
    "我能接受恢复需要时间，而不是强迫自己立刻正常。",
    "我会减少无谓消耗，把精力留给真正重要的事。",
    "当别人情绪很强时，我能保护自己的边界。",
    "我能把大问题拆成今天能处理的一部分。",
    "我能在不完美的状态下继续前进。",
    "我知道哪些人或环境能帮助我恢复。",
    "压力结束后，我会复盘而不是只想逃开。",
    "我能识别身体发出的疲惫信号。",
    "遇到长期压力时，我会调整节奏而不是一直加速。",
    "我能在失败后重新建立信心。",
    "最近一个月，我整体上能从压力中恢复过来。",
  ]),
  results: {
    STEADY: resilienceResult("稳定恢复型", "你的心理韧性指数较高。你通常能在压力后恢复节奏，并继续推进关键任务。", "steady", "zh"),
    RECOVERING: resilienceResult("恢复调整型", "你的心理韧性处于可恢复区间。你能从压力中回来，但需要更稳定的休息、边界和支持。", "recovering", "zh"),
    STRAINED: resilienceResult("持续紧绷型", "你的心理韧性正在被持续压力消耗。你还能撑住一部分任务，但恢复速度和情绪稳定已经受到影响。", "strained", "zh"),
    FRAGILE: resilienceResult("脆弱消耗型", "你的心理韧性指数偏低。当前最重要的不是继续硬撑，而是先恢复睡眠、支持和基本节奏。", "fragile", "zh"),
  },
});

await writeSpecialScaleTest("resilience", "en", {
  description: "Measure resilience through recovery speed, emotional steadiness, and ability to keep acting after stress.",
  scale: severityScaleEn,
  scaleQuestions: severityQuestions("RESILIENCE", [
    "After a setback, I can restart action within a reasonable time.",
    "Under pressure, I can still tell what is controllable.",
    "I have reliable ways to recover from fatigue.",
    "When plans break, I can reset priorities.",
    "When low, I can still complete the smallest key task.",
    "I notice overload early.",
    "After busy stretches, I schedule rest instead of only pushing through.",
    "After criticism or failure, I can separate the event from my worth.",
    "I am willing to ask for help when pressure is too high.",
    "When tired, I lower the bar instead of quitting entirely.",
    "With uncertainty, I can take one controllable small action.",
    "I can turn past difficulties into methods for next time.",
    "When stress rises, I first stabilize my breath or rhythm.",
    "I can accept that recovery takes time.",
    "I reduce unnecessary drain and save energy for what matters.",
    "When others are emotional, I can protect my boundary.",
    "I can break a big problem into one part for today.",
    "I can keep moving while imperfect.",
    "I know which people or environments help me recover.",
    "After pressure ends, I reflect instead of only escaping.",
    "I can identify body signals of fatigue.",
    "Under long pressure, I adjust pace instead of only accelerating.",
    "I can rebuild confidence after failure.",
    "Over the last month, I have generally recovered from stress.",
  ]),
  results: {
    STEADY: resilienceResult("Steady recovery", "Your resilience index is high. You usually recover rhythm after stress and keep moving on key tasks.", "steady", "en"),
    RECOVERING: resilienceResult("Recovering", "Your resilience is in a recoverable range. You can come back from stress, but need steadier rest, boundaries, and support.", "recovering", "en"),
    STRAINED: resilienceResult("Strained", "Your resilience is being drained by sustained pressure. You can still carry some tasks, but recovery speed and emotional steadiness are affected.", "strained", "en"),
    FRAGILE: resilienceResult("Fragile", "Your resilience index is low. The priority is not pushing harder; it is repairing sleep, support, and basic rhythm.", "fragile", "en"),
  },
});

console.log(`Improved ${Object.keys(testNames).length} generated tests in zh/en.`);

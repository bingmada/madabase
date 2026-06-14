import { readFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import type { Locale } from "./i18n";
import type { TestAnswerScore } from "./test-registry";

const optionSchema = z.object({
  id: z.string(),
  text: z.string(),
  score: z.record(z.string(), z.number()),
});

const questionSchema = z.object({
  id: z.string(),
  question: z.string(),
  options: z.array(optionSchema).min(2),
});

const scaleSchema = z.array(
  z.object({
    id: z.string(),
    text: z.string(),
    value: z.number(),
  })
);

const scaleQuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  scoreKey: z.string(),
  reverse: z.boolean().optional(),
});

const resultContentSchema = z.object({
  title: z.string(),
  summary: z.string(),
  traits: z.array(z.string()),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  careers: z.array(z.string()),
  relationships: z.array(z.string()),
  growthPlan: z.array(z.string()),
});

const testContentSchema = z.object({
  title: z.string(),
  description: z.string(),
  instructions: z.array(z.string()),
  reportLabels: z
    .object({
      strengths: z.string(),
      weaknesses: z.string(),
      careers: z.string(),
      relationships: z.string(),
      growth: z.string(),
    })
    .optional(),
  scale: scaleSchema.optional(),
  scaleQuestions: z.array(scaleQuestionSchema).optional(),
  questions: z.array(questionSchema).optional(),
  results: z.record(z.string(), resultContentSchema),
});

export type TestQuestion = {
  id: string;
  question: string;
  options: Array<{
    id: string;
    text: string;
    score: TestAnswerScore;
  }>;
};

export type TestResultContent = z.infer<typeof resultContentSchema>;

export type TestContent = {
  title: string;
  description: string;
  instructions: string[];
  reportLabels?: {
    strengths: string;
    weaknesses: string;
    careers: string;
    relationships: string;
    growth: string;
  };
  questions: TestQuestion[];
  results: Record<string, TestResultContent>;
};

export async function loadTestContent(slug: string, locale: Locale): Promise<TestContent | null> {
  try {
    const filePath = path.join(process.cwd(), "content", "tests", slug, `${locale}.json`);
    const raw = await readFile(filePath, "utf8");
    const parsed = testContentSchema.parse(JSON.parse(raw));
    const directQuestions = parsed.questions ?? [];
    const scaleQuestions =
      parsed.scale && parsed.scaleQuestions
        ? parsed.scaleQuestions.map((question) => {
            const values = parsed.scale?.map((option) => option.value) ?? [];
            const max = Math.max(...values);
            const min = Math.min(...values);
            return {
              id: question.id,
              question: question.question,
              options: parsed.scale!.map((option) => ({
                id: option.id,
                text: option.text,
                score: {
                  [question.scoreKey]: question.reverse ? max + min - option.value : option.value,
                },
              })),
            };
          })
        : [];

    return {
      title: parsed.title,
      description: parsed.description,
      instructions: parsed.instructions,
      reportLabels: parsed.reportLabels,
      questions: [...directQuestions, ...scaleQuestions] as TestQuestion[],
      results: parsed.results,
    };
  } catch {
    return null;
  }
}

export function getResultContent(content: TestContent, type: string) {
  return content.results[type.toUpperCase()] ?? null;
}

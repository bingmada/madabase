"use client";

import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import type { TestAnswer } from "@/lib/test-registry";
import type { TestQuestion } from "@/lib/test-content";
import { testMap } from "@/lib/test-registry";

export function TestRunner({
  locale,
  slug,
  questions,
}: {
  locale: Locale;
  slug: string;
  questions: TestQuestion[];
}) {
  const router = useRouter();
  const storageKey = `madabase:test:${slug}:answers`;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, TestAnswer>>({});
  const [isFinishing, setIsFinishing] = useState(false);
  const test = testMap.get(slug);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as Record<string, TestAnswer>;
      setAnswers(parsed);
      const firstUnanswered = questions.findIndex((question) => !parsed[question.id]);
      setCurrentIndex(firstUnanswered === -1 ? questions.length - 1 : firstUnanswered);
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, [questions, storageKey]);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(answers));
  }, [answers, storageKey]);

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / questions.length) * 100);
  const selectedOptionId = answers[currentQuestion.id]?.optionId;
  const firstUnansweredIndex = questions.findIndex((question) => !answers[question.id]);
  const hasMissingAnswers = firstUnansweredIndex !== -1;

  const orderedAnswers = useMemo(() => questions.map((question) => answers[question.id]).filter((answer): answer is TestAnswer => Boolean(answer)), [answers, questions]);

  function selectOption(option: TestQuestion["options"][number]) {
    const selectedQuestionId = currentQuestion.id;
    const selectedQuestionIndex = currentIndex;

    setAnswers((current) => ({
      ...current,
      [selectedQuestionId]: {
        questionId: selectedQuestionId,
        optionId: option.id,
        score: option.score,
      },
    }));

    if (selectedQuestionIndex < questions.length - 1) {
      setCurrentIndex((value) => (value === selectedQuestionIndex ? selectedQuestionIndex + 1 : value));
    }
  }

  function reset() {
    setAnswers({});
    setCurrentIndex(0);
    window.localStorage.removeItem(storageKey);
  }

  async function finish() {
    if (!test) return;
    if (isFinishing) return;
    if (orderedAnswers.length !== questions.length) {
      setCurrentIndex(firstUnansweredIndex === -1 ? questions.length - 1 : firstUnansweredIndex);
      return;
    }
    setIsFinishing(true);
    const result = test.calculator(orderedAnswers);
    const attemptId = window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(`madabase:test:${slug}:last-result`, JSON.stringify({ ...result, attemptId }));
    await fetch("/api/test-attempts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attemptId, testSlug: slug, resultType: result.type }),
    }).catch(() => null);
    const params = new URLSearchParams({ attempt: attemptId });
    const ref = new URL(window.location.href).searchParams.get("ref");
    if (ref) params.set("ref", ref);
    router.push(`/${locale}/tests/${slug}/result/${result.type.toLowerCase()}?${params.toString()}`);
  }

  const copy = {
    en: {
      question: "Question",
      answered: "answered",
      previous: "Previous",
      next: "Next",
      reset: "Reset",
      finish: "View result",
      missing: "Answer missing item",
      incomplete: "Answer every question to unlock your result.",
    },
    zh: {
      question: "问题",
      answered: "已回答",
      previous: "上一题",
      next: "下一题",
      reset: "重置",
      finish: "查看结果",
      missing: "补答漏题",
      incomplete: "完成所有问题后即可查看结果。",
    },
  }[locale];

  return (
    <section className="surface-card-strong overflow-hidden">
      <div className="border-b border-[var(--border)] p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="eyebrow">
              {copy.question} {currentIndex + 1} / {questions.length}
            </p>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              {answeredCount} / {questions.length} {copy.answered}
            </p>
          </div>
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-10 items-center gap-2 rounded-md border border-[var(--border)] bg-white px-3 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--brand)]"
          >
            <RotateCcw className="h-4 w-4" />
            {copy.reset}
          </button>
        </div>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-[var(--surface-muted)]">
          <div className="h-full rounded-full bg-[var(--brand)] transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="p-5 sm:p-7">
        <h1 className="text-2xl font-black tracking-tight text-[var(--text)] sm:text-3xl">{currentQuestion.question}</h1>
        <div className="mt-6 grid gap-3">
          {currentQuestion.options.map((option) => {
            const selected = option.id === selectedOptionId;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => selectOption(option)}
                className={`flex min-h-16 items-center justify-between gap-4 rounded-md border p-4 text-left transition ${
                  selected ? "border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--text)]" : "border-[var(--border)] bg-white text-[var(--text-muted)] hover:border-[var(--brand)] hover:text-[var(--text)]"
                }`}
              >
                <span className="text-base font-semibold leading-6">{option.text}</span>
                {selected ? <CheckCircle2 className="h-5 w-5 shrink-0 text-[var(--brand-strong)]" /> : null}
              </button>
            );
          })}
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setCurrentIndex((value) => Math.max(value - 1, 0))}
            disabled={currentIndex === 0}
            className="inline-flex h-11 items-center gap-2 rounded-md border border-[var(--border)] bg-white px-4 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--brand)] disabled:cursor-not-allowed disabled:opacity-45"
          >
            <ArrowLeft className="h-4 w-4" />
            {copy.previous}
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentIndex((value) => Math.min(value + 1, questions.length - 1))}
              className="inline-flex h-11 items-center gap-2 rounded-md bg-[var(--surface-code)] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--brand-strong)]"
            >
              {copy.next}
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={finish}
              disabled={isFinishing}
              className="inline-flex h-11 items-center gap-2 rounded-md bg-[var(--surface-code)] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--brand-strong)]"
            >
              {hasMissingAnswers ? copy.missing : copy.finish}
              {hasMissingAnswers ? <ArrowRight className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
            </button>
          )}
        </div>

        {orderedAnswers.length !== questions.length ? <p className="mt-4 text-sm text-[var(--text-soft)]">{copy.incomplete}</p> : null}
      </div>
    </section>
  );
}

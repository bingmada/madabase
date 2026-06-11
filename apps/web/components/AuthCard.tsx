"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AuthCard({
  locale,
  mode,
}: {
  locale: "en" | "zh";
  mode: "login" | "register";
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [requested, setRequested] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState<"success" | "error">("success");

  const copy = {
    en: {
      email: "Email",
      code: "Verification code",
      requestCode: "Send code",
      verify: mode === "login" ? "Log in" : "Create account",
      hint: "Email + verification code. No password required.",
      sent: "Verification code sent.",
      invalid: "Something went wrong. Please try again.",
    },
    zh: {
      email: "邮箱",
      code: "验证码",
      requestCode: "发送验证码",
      verify: mode === "login" ? "登录" : "创建账户",
      hint: "邮箱 + 验证码，无需密码。",
      sent: "验证码已发送。",
      invalid: "操作失败，请重试。",
    },
  }[locale];

  async function requestCode() {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/request-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? copy.invalid);
      setRequested(true);
      setMessage(copy.sent);
      setTone("success");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : copy.invalid);
      setTone("error");
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode() {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? copy.invalid);
      router.push(`/${locale}/profile`);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : copy.invalid);
      setTone("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="surface-card-strong mx-auto w-full max-w-lg p-6 sm:p-8">
      <p className="eyebrow">{mode === "login" ? "Madabase Auth" : "Madabase Account"}</p>
      <p className="mt-4 text-sm leading-6 text-[var(--text-muted)]">{copy.hint}</p>
      <div className="mt-6 space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[var(--text)]">{copy.email}</span>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            className="w-full rounded-md border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--text)] outline-none transition focus:border-[var(--brand)]"
            placeholder="you@example.com"
          />
        </label>

        {requested ? (
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[var(--text)]">{copy.code}</span>
            <input
              value={code}
              onChange={(event) => setCode(event.target.value)}
              className="w-full rounded-md border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--text)] outline-none transition focus:border-[var(--brand)]"
              placeholder="123456"
            />
          </label>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <button
            onClick={requestCode}
            disabled={loading || !email}
            className="inline-flex h-10 items-center rounded-md bg-[var(--surface-code)] px-4 text-sm font-semibold text-white transition hover:bg-[var(--brand-strong)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {copy.requestCode}
          </button>
          {requested ? (
            <button
              onClick={verifyCode}
              disabled={loading || !code}
              className="inline-flex h-10 items-center rounded-md border border-[var(--border)] bg-white px-4 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--brand)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {copy.verify}
            </button>
          ) : null}
        </div>

        {message ? (
          <div className={`rounded-md px-3 py-2 text-sm ${tone === "success" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
            {message}
          </div>
        ) : null}
      </div>
    </div>
  );
}

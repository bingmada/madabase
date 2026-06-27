"use client";

import { Check, Copy, Gift } from "lucide-react";
import { useState } from "react";
import type { Locale } from "@/lib/i18n";

export function TestShareCard({
  locale,
  shareUrl,
  rewardAmount,
}: {
  locale: Locale;
  shareUrl: string;
  rewardAmount: number;
}) {
  const [copied, setCopied] = useState(false);
  const copy = {
    en: {
      title: "Earn credits by sharing",
      description: `Invite someone with your link. When they finish this test and spend credits to unlock a report, you get ${rewardAmount} credits.`,
      copy: "Copy link",
      copied: "Copied",
    },
    zh: {
      title: "分享赚积分",
      description: `把链接分享给别人。对方完成这个测试并消耗积分解锁报告后，你会获得 ${rewardAmount} 积分。`,
      copy: "复制链接",
      copied: "已复制",
    },
  }[locale];

  async function copyLink() {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="mt-5 rounded-md border border-[var(--border)] bg-white p-4">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-[var(--brand-soft)] text-[var(--brand-strong)]">
          <Gift className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-[var(--text)]">{copy.title}</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{copy.description}</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              readOnly
              value={shareUrl}
              className="code-font min-w-0 flex-1 rounded-md border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 text-xs text-[var(--text-muted)]"
            />
            <button
              type="button"
              onClick={copyLink}
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md bg-[var(--surface-code)] px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--brand-strong)]"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? copy.copied : copy.copy}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


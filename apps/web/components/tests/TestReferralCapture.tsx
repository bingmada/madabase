"use client";

import { useEffect } from "react";

export function TestReferralCapture({ code, testSlug }: { code?: string; testSlug: string }) {
  useEffect(() => {
    if (!code) return;

    void fetch("/api/test-referrals/capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, testSlug }),
    });
  }, [code, testSlug]);

  return null;
}


import { normalizeEmail } from "../utils";

async function sendViaResend({ email, code }: { email: string; code: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.AUTH_EMAIL_FROM;

  if (!apiKey || !from) {
    throw new Error("Missing RESEND_API_KEY or AUTH_EMAIL_FROM.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: `Your Madabase verification code: ${code}`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;max-width:560px;margin:0 auto;padding:24px;">
          <h1 style="font-size:20px;margin:0 0 16px;">Madabase verification code</h1>
          <p style="margin:0 0 12px;">Use the code below to finish signing in:</p>
          <div style="font-size:32px;font-weight:700;letter-spacing:6px;margin:16px 0;padding:16px;border-radius:12px;background:#f3f4f6;text-align:center;">${code}</div>
          <p style="margin:12px 0 0;color:#6b7280;">This code expires in 10 minutes.</p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend email failed: ${body}`);
  }

  return { ok: true as const, provider: "resend" as const };
}

export async function sendEmailVerificationCode({
  email,
  code,
}: {
  email: string;
  code: string;
}) {
  const normalizedEmail = normalizeEmail(email);

  if (process.env.AUTH_EMAIL_PROVIDER === "resend") {
    return sendViaResend({ email: normalizedEmail, code });
  }

  if (process.env.NODE_ENV !== "production") {
    console.info(`[madabase auth] verification code for ${normalizedEmail}: ${code}`);
  }

  return {
    ok: true,
    provider: "console",
  } as const;
}

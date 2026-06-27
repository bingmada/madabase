export const authConfig = {
  sessionCookieName: "madabase_session",
  sessionDurationDays: 30,
  verificationCodeTtlMinutes: 10,
} as const;

export function getSessionMaxAgeSeconds() {
  return authConfig.sessionDurationDays * 24 * 60 * 60;
}

export function getVerificationCodeTtlMs() {
  return authConfig.verificationCodeTtlMinutes * 60 * 1000;
}

export function getAuthCookieDomain() {
  const domain = process.env.AUTH_COOKIE_DOMAIN?.trim();
  return domain || undefined;
}

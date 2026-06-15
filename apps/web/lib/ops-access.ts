const opsAllowedEmails = new Set(["15797688584@163.com"]);

export function canAccessOps(email?: string | null) {
  return Boolean(email && opsAllowedEmails.has(email.toLowerCase()));
}

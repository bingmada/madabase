export function effectiveContentUpdatedAt(contentUpdatedAt?: string, evidenceUpdatedAt?: string) {
  const timestamp = (value?: string) => {
    if (!value) return undefined;
    const parsed = new Date(`${value} 00:00:00 UTC`).getTime();
    return Number.isNaN(parsed) ? undefined : parsed;
  };
  const contentTimestamp = timestamp(contentUpdatedAt);
  const evidenceTimestamp = timestamp(evidenceUpdatedAt);
  if (contentTimestamp === undefined) return evidenceTimestamp === undefined ? undefined : evidenceUpdatedAt;
  if (evidenceTimestamp === undefined) return contentUpdatedAt;
  return evidenceTimestamp > contentTimestamp ? evidenceUpdatedAt : contentUpdatedAt;
}

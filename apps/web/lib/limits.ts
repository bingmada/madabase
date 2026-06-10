import { premiumFeatures, type PremiumFeature } from "./features";

export type ToolLimitConfig = {
  freePerDay: number;
  premiumPerDay: number | "unlimited";
  feature?: PremiumFeature;
};

export const toolLimits: Partial<Record<string, ToolLimitConfig>> = {
  "json-formatter": {
    freePerDay: 100,
    premiumPerDay: "unlimited",
    feature: "large_file",
  },
};

const LOCAL_STORAGE_KEY = "madabase.tool-usage";
const DAY_IN_MS = 24 * 60 * 60 * 1000;

function getDayBucket(timestamp: number) {
  return Math.floor(timestamp / DAY_IN_MS);
}

function readUsageStore() {
  if (typeof window === "undefined") return {} as Record<string, number[]>;

  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, number[]>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeUsageStore(store: Record<string, number[]>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(store));
}

function getClientIpBucket() {
  if (typeof window === "undefined") return "server";
  const siteUrl = (window as typeof window & { __MADABASE_SITE_URL__?: string }).__MADABASE_SITE_URL__ ?? "local";
  return `${siteUrl}:${window.location.hostname}`;
}

function getUsageKey(toolSlug: string) {
  return `${getClientIpBucket()}:${toolSlug}`;
}

export function getToolLimit(toolSlug: string) {
  return toolLimits[toolSlug] ?? null;
}

export function getRemainingFreeUses(toolSlug: string) {
  const config = getToolLimit(toolSlug);
  if (!config) return null;

  const store = readUsageStore();
  const key = getUsageKey(toolSlug);
  const today = getDayBucket(Date.now());
  const usesToday = (store[key] ?? []).filter((timestamp) => getDayBucket(timestamp) === today).length;
  return Math.max(config.freePerDay - usesToday, 0);
}

export function canExecuteTool(toolSlug: string) {
  const config = getToolLimit(toolSlug);
  if (!config) {
    return { allowed: true as const, remaining: null as number | null, reason: null as string | null };
  }

  if (config.feature && premiumFeatures[config.feature]) {
    return { allowed: true as const, remaining: null as number | null, reason: null as string | null };
  }

  const remaining = getRemainingFreeUses(toolSlug);
  if (remaining === null || remaining > 0) {
    return { allowed: true as const, remaining, reason: null as string | null };
  }

  return {
    allowed: false as const,
    remaining: 0,
    reason: `Daily free limit reached for ${toolSlug}.`,
  };
}

export function recordToolExecution(toolSlug: string) {
  const config = getToolLimit(toolSlug);
  if (!config) {
    return { allowed: true as const, remaining: null as number | null, reason: null as string | null };
  }

  const current = canExecuteTool(toolSlug);
  if (!current.allowed) {
    return current;
  }

  const store = readUsageStore();
  const key = getUsageKey(toolSlug);
  const timestamps = store[key] ?? [];
  const now = Date.now();
  const today = getDayBucket(now);
  store[key] = [...timestamps.filter((timestamp) => getDayBucket(timestamp) === today), now];
  writeUsageStore(store);

  return {
    allowed: true as const,
    remaining: getRemainingFreeUses(toolSlug),
    reason: null as string | null,
  };
}

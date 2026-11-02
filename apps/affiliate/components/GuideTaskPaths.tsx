import Link from "next/link";
import { taskGuidePaths } from "@/lib/task-guide-paths";
import type { SiteKey } from "@/lib/types";
import type { MarketProfile } from "@/lib/markets";
import { localizedMarketPathForBasePath } from "@/lib/market-content";

export function GuideTaskPaths({ site, slug, market }: { site: SiteKey; slug: string; market?: MarketProfile }) {
  const paths = taskGuidePaths(site, slug);
  if (!paths) return null;
  return <aside className="mt-6 rounded-md border border-[var(--border)] bg-white p-5" aria-label="Next step for this task" data-guide-task-paths="true">
    <h2 className="text-xl font-bold">Choose the next step for your task</h2>
    <ul className="mt-4 space-y-5">{paths.choices.map((choice) => <li key={choice.href}>
      <p className="text-sm leading-6">{choice.when}</p>
      <Link className="mt-1 inline-block font-bold underline underline-offset-4" href={market ? localizedMarketPathForBasePath(market, site, choice.href) ?? choice.href : choice.href}>{choice.label}</Link>
    </li>)}</ul>
    <p className="mt-5 text-sm leading-6 text-[var(--muted)]">{paths.keep}</p>
  </aside>;
}

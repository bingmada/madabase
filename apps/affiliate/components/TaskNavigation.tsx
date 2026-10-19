import Link from "next/link";
import { topicsForSite } from "@/lib/discovery-topics";
export function TaskNavigation({ site }: { site: string }) {
  const topics = topicsForSite(site);
  if (!topics.length) return null;
  return <nav className="discovery-chips task-navigation" aria-label="Browse by task">{topics.map((topic) => <Link key={topic.id} href={`/search?topic=${topic.id}`}>{topic.label}</Link>)}</nav>;
}

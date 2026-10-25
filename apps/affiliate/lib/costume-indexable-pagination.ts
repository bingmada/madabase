// Stable identity ordering covers the complete eligible catalog. A failed page
// must fail the sitemap request, not publish a successful truncated sitemap.
export async function collectAllCostumeProducts<T extends { id: string }>(
  loadPage: (afterId: string | null, take: number) => Promise<T[]>,
  eligible: (row: T) => boolean,
) {
  const selected: T[] = [];
  const pageSize = 100;
  let afterId: string | null = null;
  for (;;) {
    const page = await loadPage(afterId, pageSize);
    let previous = afterId;
    for (const row of page) {
      if (previous !== null && row.id <= previous) throw new Error("Costume catalog pagination did not advance in stable identity order.");
      if (eligible(row)) selected.push(row);
      previous = row.id;
    }
    if (page.length < pageSize) return selected;
    afterId = page[page.length - 1].id;
  }
}

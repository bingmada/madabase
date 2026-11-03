export function ListingIdentityNote({ checkedAt }: { checkedAt: string }) {
  const date = new Date(checkedAt);
  if (Number.isNaN(date.getTime())) return null;
  return (
    <p className="mt-4 text-sm leading-6 text-[var(--muted)]" data-historical-listing-evidence="true">
      Model reference checked: <time dateTime={date.toISOString()}>{date.toLocaleDateString("en-US", { timeZone: "UTC", dateStyle: "medium" })}</time>.
    </p>
  );
}

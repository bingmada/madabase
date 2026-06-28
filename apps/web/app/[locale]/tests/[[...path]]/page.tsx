import { notFound, permanentRedirect } from "next/navigation";
import { isLocale } from "@/lib/i18n";

export default async function LegacyTestsRedirect({
  params,
}: {
  params: Promise<{ locale: string; path?: string[] }>;
}) {
  const { locale, path = [] } = await params;
  if (!isLocale(locale)) notFound();

  const testSite = (process.env.NEXT_PUBLIC_TEST_SITE_URL ?? "https://test.madabase.com").replace(/\/$/, "");
  const targetPath = path.map((segment) => encodeURIComponent(segment)).join("/");
  permanentRedirect(`${testSite}/${locale}${targetPath ? `/${targetPath}` : ""}`);
}

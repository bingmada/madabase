import { permanentRedirect } from "next/navigation";

export default async function LegacyUnlocalizedTestsRedirect({
  params,
}: {
  params: Promise<{ path?: string[] }>;
}) {
  const { path = [] } = await params;
  const testSite = (process.env.NEXT_PUBLIC_TEST_SITE_URL ?? "https://test.madabase.com").replace(/\/$/, "");
  const targetPath = path.map((segment) => encodeURIComponent(segment)).join("/");

  permanentRedirect(`${testSite}/en${targetPath ? `/${targetPath}` : ""}`);
}

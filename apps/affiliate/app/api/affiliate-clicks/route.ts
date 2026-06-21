import { NextResponse } from "next/server";

type ClickPayload = {
  site?: string;
  productSlug?: string;
  merchant?: string;
  position?: string;
  path?: string;
};

const recentClicks: Array<ClickPayload & { at: string }> = [];

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => ({}))) as ClickPayload;
  const cleanPayload = {
    site: payload.site?.slice(0, 40),
    productSlug: payload.productSlug?.slice(0, 120),
    merchant: payload.merchant?.slice(0, 80),
    position: payload.position?.slice(0, 80),
    path: payload.path?.slice(0, 240),
    at: new Date().toISOString(),
  };

  recentClicks.unshift(cleanPayload);
  recentClicks.splice(50);

  console.info("affiliate_click", cleanPayload);

  return NextResponse.json({ ok: true });
}

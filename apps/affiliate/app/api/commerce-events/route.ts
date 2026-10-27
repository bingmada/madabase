import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { hasQaParameters } from "../../../../../shared/analytics-traffic";
import { validateCommerceEvent, knownAutomation } from "@/lib/commerce-events";
import { isPublishedCommerceClick } from "@/lib/commerce-inventory";
import { commerceReleaseId } from "@/lib/release-identity";
import { getAffiliatePrisma, hasDatabaseUrl } from "@/lib/db";

const headers = {"Cache-Control":"private, no-store"};
export async function POST(request: Request) {
  const requestHost = request.headers.get("host") || new URL(request.url).host;
  let host: string;
  try { host = new URL(`https://${requestHost}`).hostname; } catch { return NextResponse.json({ok:false},{status:400,headers}); }
  const origin = request.headers.get("origin");
  try {
    if (request.headers.get("sec-fetch-site") === "cross-site" || (origin && new URL(origin).host !== requestHost)) return NextResponse.json({ok:false,reason:"origin_mismatch"},{status:403,headers});
  } catch { return NextResponse.json({ok:false,reason:"invalid_origin"},{status:403,headers}); }
  if (Number(request.headers.get("content-length")) > 4096) return NextResponse.json({ok:false},{status:413,headers});
  const payload = validateCommerceEvent(await request.json().catch(()=>null),host);
  if (!payload || payload.releaseId !== commerceReleaseId()) return NextResponse.json({ok:false,reason:"invalid_event"},{status:400,headers});
  if (payload.eventType !== "content_view" && !isPublishedCommerceClick(payload.site,payload.productSlug,payload.merchant)) {
    return NextResponse.json({ok:false,reason:"invalid_offer"},{status:400,headers});
  }
  let qa = host === "localhost" || host === "127.0.0.1" || host.endsWith(".localhost");
  try {qa ||= hasQaParameters(new URL(request.headers.get("referer") || request.url).search);} catch { /* No valid referrer. */ }
  if (qa || knownAutomation(request.headers.get("user-agent") || "")) return NextResponse.json({ok:true,persisted:false,validated:true,reason:qa?"qa_visit":"known_automation"},{headers});
  if (!hasDatabaseUrl()) return NextResponse.json({ok:true,persisted:false,reason:"database_unavailable"},{status:202,headers});
  const id = createHash("sha256").update(JSON.stringify([payload.sessionId,payload.site,payload.path,payload.releaseId,payload.eventType,payload.productSlug,payload.merchant,payload.position])).digest("hex");
  try {
    await getAffiliatePrisma().commerceEvent.upsert({where:{id},update:{},create:{...payload,id}});
    return NextResponse.json({ok:true,persisted:true},{headers});
  } catch {
    console.error("commerce_event_not_persisted",{site:payload.site,path:payload.path,eventType:payload.eventType});
    return NextResponse.json({ok:true,persisted:false,reason:"persistence_failed"},{status:202,headers});
  }
}

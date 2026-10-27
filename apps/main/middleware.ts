import { NextResponse, type NextRequest } from "next/server";
import { isRetiredSite, retiredSiteResponse } from "../shared/retired-sites";

export function middleware(request: NextRequest) {
  if (isRetiredSite(request.headers)
    || /^\/(?:en|zh|tools)(?:\/|$)/.test(request.nextUrl.pathname)) {
    return retiredSiteResponse(request.nextUrl.pathname, request.method);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/:path*"] };

import { NextResponse, type NextRequest } from "next/server";
import { getMarketByRouteSlug } from "./lib/markets";
import { isRetiredSite, retiredSiteResponse } from "../shared/retired-sites";

export function middleware(request: NextRequest) {
  if (isRetiredSite(request.headers)) {
    return retiredSiteResponse(request.nextUrl.pathname, request.method);
  }
  const routeSlug = request.nextUrl.pathname.split("/")[1];
  const market = getMarketByRouteSlug(routeSlug);
  if (!market) return NextResponse.next();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-madabase-market", market.routeSlug);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/:path*"],
};

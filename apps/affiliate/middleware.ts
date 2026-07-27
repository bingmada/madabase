import { NextResponse, type NextRequest } from "next/server";
import { getMarketByRouteSlug } from "./lib/markets";

export function middleware(request: NextRequest) {
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
  matcher: ["/en-gb/:path*", "/en-ca/:path*", "/de-de/:path*", "/nl-nl/:path*"],
};

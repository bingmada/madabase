import { NextResponse, type NextRequest } from "next/server";

const retiredTestPath = /^\/(?:(?:en|zh)\/)?tests(?:\/|$)/;

export function middleware(request: NextRequest) {
  if (!retiredTestPath.test(request.nextUrl.pathname)) return NextResponse.next();

  return new NextResponse("This legacy test route is permanently unavailable.", {
    status: 410,
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "text/plain; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

export const config = {
  matcher: ["/tests/:path*", "/en/tests/:path*", "/zh/tests/:path*"],
};

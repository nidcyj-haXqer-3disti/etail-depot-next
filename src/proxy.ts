import type { NextRequest } from "next/server";
import { retiredRoute } from "./shared/public-routes";

/** Retired URLs never read sessions, call providers or connect to stored account data. */
export function proxy(request: NextRequest) {
  const route = retiredRoute(request.nextUrl.pathname);
  if (!route) return;
  const headers = {
    "Cache-Control": "no-store",
    "Referrer-Policy": "no-referrer",
    "X-Content-Type-Options": "nosniff",
    "X-Robots-Tag": "noindex, nofollow",
  };
  if (route.destination && ["GET", "HEAD"].includes(request.method)) {
    // A public anchor prevents inheritance of old invite/token fragments, even after URL normalization.
    const destination = route.destination.includes("#") ? route.destination : `${route.destination}#main-content`;
    return new Response(null, { status: 307, headers: { ...headers, Location: new URL(destination, request.url).href } });
  }
  return new Response("This service link is no longer available. Visit /help for support.", {
    status: 410, headers: { ...headers, "Content-Type": "text/plain; charset=utf-8" },
  });
}

export const config = {
  matcher: [
    "/api/:path*", "/checkout/:path*", "/pay/:path*", "/payments/:path*",
    "/cardholder-services/:path*", "/cards/:path*", "/merchant-services/:path*", "/merchants/:path*",
    "/login/:path*", "/profile/:path*", "/security/:path*", "/shared-access/:path*", "/invitations/:path*",
    "/operations/:path*", "/money-accounts/:path*", "/accounts/:path*", "/services/:path*",
  ],
};

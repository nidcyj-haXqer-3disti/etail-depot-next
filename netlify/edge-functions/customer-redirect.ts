import { customerHref } from "../../src/shared/customer-routes.ts";

/** Resolve customer bookmarks before the CDN can append the incoming query to Location. */
export default function customerRedirect(request: Request): Response | undefined {
  if (request.method !== "GET" && request.method !== "HEAD") return;
  const url = new URL(request.url);
  let destination: string;
  try { destination = customerHref(url.pathname, url.searchParams); }
  catch { return; } // The page loader retains its existing fail-closed response.
  if (destination === `${url.pathname}${url.search}`) return;
  return new Response(null, {
    status: 307,
    headers: {
      Location: new URL(destination, url.origin).href,
      "Cache-Control": "private, no-store",
      "Referrer-Policy": "no-referrer",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export const config = {
  path: ["/cardholder-services", "/cardholder-services/*", "/merchant-services", "/merchant-services/*", "/merchants/*", "/money-accounts/*"],
};

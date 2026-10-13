import { retiredRoute } from "../../src/shared/public-routes.ts";
import { isApprovedSearchRelease, PUBLIC_INDEXING_APPROVAL } from "../../src/shared/public-release.ts";

type Environment = Readonly<Record<string, string | undefined>>;

/** The platform supplies these fields; request headers cannot grant search approval. */
export interface PublicBoundaryContext {
  next(): Promise<Response>;
  site?: { id?: string };
  deploy?: { context?: string };
}

declare const Netlify: { env: { get(name: string): string | undefined } };

export const publicSecurityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "no-referrer",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
} as const;

const privateRobots = "noindex, nofollow";
const retiredMessage = "This service link is no longer available. Visit /help for support.";
const previewRobots = "User-Agent: *\nAllow: /\nDisallow: /api/\n";
const emptySitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>\n';

function withSecurityHeaders(response: Response, noindex: boolean): Response {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(publicSecurityHeaders)) headers.set(key, value);
  if (noindex) headers.set("X-Robots-Tag", privateRobots);
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

/** Read-only retirement routing and search policy shared by production and local preview tests. */
export async function handlePublicRequest(
  request: Request,
  context: PublicBoundaryContext,
  environment: Environment,
): Promise<Response> {
  const url = new URL(request.url);
  const retired = retiredRoute(url.pathname);
  if (retired) {
    const headers = { ...publicSecurityHeaders, "Cache-Control": "no-store", "X-Robots-Tag": privateRobots };
    if (retired.destination && ["GET", "HEAD"].includes(request.method)) {
      const destination = retired.destination.includes("#") ? retired.destination : `${retired.destination}#main-content`;
      return new Response(null, { status: 307, headers: { ...headers, Location: new URL(destination, request.url).href } });
    }
    // Submitted bodies are never read, forwarded or redirected into another service.
    return new Response(request.method === "HEAD" ? null : retiredMessage, {
      status: 410,
      headers: { ...headers, "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const approved = context.deploy?.context === "production" && isApprovedSearchRelease(PUBLIC_INDEXING_APPROVAL, {
    ...environment,
    SITE_ID: context.site?.id,
    CONTEXT: context.deploy.context,
  });
  if (!approved && ["GET", "HEAD"].includes(request.method)) {
    const metadataPath = url.pathname.replace(/\/$/, "");
    const body = metadataPath === "/robots.txt" ? previewRobots : metadataPath === "/sitemap.xml" ? emptySitemap : null;
    if (body !== null) {
      return new Response(request.method === "HEAD" ? null : body, {
        headers: {
          ...publicSecurityHeaders,
          "Cache-Control": "no-store",
          "Content-Type": metadataPath === "/robots.txt" ? "text/plain; charset=utf-8" : "application/xml; charset=utf-8",
          "X-Robots-Tag": privateRobots,
        },
      });
    }
  }

  const response = await context.next();
  const legalPage = /^\/(?:privacy|terms)(?:\.html|\/index\.html|\/)?$/.test(url.pathname);
  const navigationPayload = url.pathname.endsWith(".txt") && url.pathname !== "/robots.txt";
  return withSecurityHeaders(response, !approved || legalPage || navigationPayload || response.status >= 400);
}

export default function publicBoundary(request: Request, context: PublicBoundaryContext): Promise<Response> {
  return handlePublicRequest(request, context, {
    // This handler accompanies a Next production export, including on deploy previews.
    NODE_ENV: "production",
    APP_ENV: Netlify.env.get("APP_ENV"),
    ETAIL_SEARCH_CONTEXT: Netlify.env.get("ETAIL_SEARCH_CONTEXT"),
    ETAIL_PUBLIC_ORIGIN: Netlify.env.get("ETAIL_PUBLIC_ORIGIN"),
  });
}

// Unknown URLs need the same preview/404 protection as the six public routes.
// Do not cache the policy decision or bypass the boundary if it fails.
export const config = { pattern: "^/.*$", onError: "fail" };

import { describe, expect, it, vi } from "vitest";
import { retiredRoute } from "../../src/shared/public-routes";
import { canonicalOrigin, PUBLIC_INDEXING_APPROVAL } from "../../src/shared/public-release";
import { config, handlePublicRequest, publicSecurityHeaders, type PublicBoundaryContext } from "../../netlify/edge-functions/public-boundary";

const production = {
  NODE_ENV: "production", APP_ENV: "production", ETAIL_SEARCH_CONTEXT: "production",
  ETAIL_PUBLIC_ORIGIN: canonicalOrigin,
};
function context(response = new Response("public page"), changes: Partial<PublicBoundaryContext> = {}) {
  return { site: { id: PUBLIC_INDEXING_APPROVAL.siteId }, deploy: { context: "production" }, next: vi.fn(async () => response), ...changes };
}
const retiredDestinations = [
  ["/login", "/help#access"], ["/cardholder-services/cards/old-id", "/credit-card-services#main-content"],
  ["/cards/old-id", "/credit-card-services#main-content"], ["/merchant-services/terminals/old-id", "/payment-acceptance-service#main-content"],
  ["/merchants/old-id", "/payment-acceptance-service#main-content"], ["/profile", "/help#access"], ["/security", "/help#access"],
  ["/shared-access/old-id", "/help#access"], ["/invitations/old-id", "/help#access"], ["/money-accounts/old-id", "/#main-content"],
  ["/accounts/old-id", "/#main-content"], ["/services", "/#main-content"], ["/operations", "/help#main-content"],
] as const;

const movedPublicPages = [
  ["/card-services", "/credit-card-services"],
  ["/payment-services", "/payment-acceptance-service"],
] as const;
const publicAliases = movedPublicPages.flatMap(([oldPath, destination]) =>
  [oldPath, `${oldPath}/`, `${oldPath}.html`, `${oldPath}/index.html`].map(path => [path, destination] as const),
);

describe("renamed public product pages", () => {
  it.each(publicAliases)("permanently redirects GET and HEAD %s to its exact new path", async (path, destination) => {
    for (const method of ["GET", "HEAD"]) {
      const next = context();
      const response = await handlePublicRequest(new Request(`${canonicalOrigin}${path}?next=https://other.invalid&token=synthetic-test#fees`, { method }), next, production);
      expect(response.status).toBe(308);
      expect(response.headers.get("location")).toBe(`${canonicalOrigin}${destination}`);
      // No replacement fragment: the browser can retain an existing public section bookmark.
      expect(new URL(response.headers.get("location")!).hash).toBe("");
      expect(response.headers.has("x-robots-tag")).toBe(false);
      expect(response.headers.has("set-cookie")).toBe(false);
      expect(await response.text()).toBe("");
      expect(next.next).not.toHaveBeenCalled();
      for (const [key, value] of Object.entries(publicSecurityHeaders)) expect(response.headers.get(key)).toBe(value);
    }
  });

  it.each(publicAliases)("keeps %s redirects on the preview origin and out of search", async (path, destination) => {
    const previewOrigin = "https://deploy-preview-203--etail-depot-next.netlify.app";
    for (const method of ["GET", "HEAD"]) {
      const next = context(undefined, { deploy: { context: "deploy-preview" } });
      const response = await handlePublicRequest(new Request(`${previewOrigin}${path}?next=${canonicalOrigin}`, { method }), next, production);
      expect(response.status).toBe(308);
      expect(response.headers.get("location")).toBe(`${previewOrigin}${destination}`);
      expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
      expect(response.headers.get("cache-control")).toBe("no-store");
      expect(next.next).not.toHaveBeenCalled();
    }
  });

  it.each(["POST", "PUT", "PATCH", "DELETE", "OPTIONS"])("rejects %s on every public alias without redirecting or reading the body", async method => {
    for (const [path] of publicAliases) {
      const next = context();
      const request = new Request(`${canonicalOrigin}${path}?next=https://other.invalid`, { method, body: "synthetic-private-input" });
      const response = await handlePublicRequest(request, next, production);
      expect(response.status).toBe(405);
      expect(response.headers.get("allow")).toBe("GET, HEAD");
      expect(response.headers.has("location")).toBe(false);
      expect(response.headers.get("cache-control")).toBe("no-store");
      expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
      expect(response.headers.has("set-cookie")).toBe(false);
      expect(request.bodyUsed).toBe(false);
      expect(next.next).not.toHaveBeenCalled();
      for (const [key, value] of Object.entries(publicSecurityHeaders)) expect(response.headers.get(key)).toBe(value);
    }
  });

  it.each(movedPublicPages)("does not redirect children or lookalikes of %s", async oldPath => {
    for (const path of [`${oldPath}/missing`, `${oldPath}/index.html/extra`, `${oldPath}//`, `${oldPath}.txt`, `${oldPath}.html/`, `${oldPath}-other`, `${oldPath}%2Findex.html`, oldPath.replace("services", "%73ervices")]) {
      const next = context(new Response("Not found", { status: 404 }));
      const response = await handlePublicRequest(new Request(`${canonicalOrigin}${path}`), next, production);
      expect(response.status).toBe(404);
      expect(response.headers.has("location")).toBe(false);
      expect(next.next).toHaveBeenCalledTimes(1);
    }
  });
});

describe("retired application boundary", () => {
  it.each(retiredDestinations)("redirects GET and HEAD %s without forwarding input", async (path, destination) => {
    for (const method of ["GET", "HEAD"]) {
      const next = context();
      const response = await handlePublicRequest(new Request(`${canonicalOrigin}${path}?next=https://other.invalid&token=synthetic-test#private`, { method }), next, production);
      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toBe(`${canonicalOrigin}${destination}`);
      expect(response.headers.get("cache-control")).toBe("no-store");
      expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
      expect(response.headers.has("set-cookie")).toBe(false);
      expect(await response.text()).toBe("");
      expect(next.next).not.toHaveBeenCalled();
      for (const [key, value] of Object.entries(publicSecurityHeaders)) expect(response.headers.get(key)).toBe(value);
    }
  });
  it.each(["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"])("returns Gone for every old transaction family using %s", async method => {
    for (const path of ["/api/v1/sessions", "/checkout/old-payment", "/pay/old-link", "/payments/old-receipt"]) {
      const next = context();
      const request = new Request(`${canonicalOrigin}${path}`, { method, ...(!["GET", "HEAD"].includes(method) ? { body: "synthetic-private-input" } : {}) });
      const response = await handlePublicRequest(request, next, production);
      expect(response.status).toBe(410);
      expect(response.headers.has("location")).toBe(false);
      expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
      expect(await response.text()).toBe(method === "HEAD" ? "" : "This service link is no longer available. Visit /help for support.");
      expect(next.next).not.toHaveBeenCalled();
      expect(request.bodyUsed).toBe(false);
    }
  });
  it.each(["POST", "PUT", "PATCH", "DELETE", "OPTIONS"])("never redirects %s data from an old account bookmark", async method => {
    for (const [path] of retiredDestinations) {
      const next = context();
      const request = new Request(`${canonicalOrigin}${path}?next=https://other.invalid`, { method, body: "synthetic-private-input" });
      const response = await handlePublicRequest(request, next, production);
      expect(response.status).toBe(410);
      expect(response.headers.has("location")).toBe(false);
      expect(next.next).not.toHaveBeenCalled();
      expect(request.bodyUsed).toBe(false);
    }
  });
  it.each(["/", "/credit-card-services", "/payment-acceptance-service", "/help", "/privacy", "/terms", "/apiary", "/constructor", "/__proto__"])("does not capture public or unrelated route %s", path => {
    expect(retiredRoute(path)).toBeNull();
  });
});

describe("public Edge search and security policy", () => {
  it("matches all routes and methods and fails closed rather than bypassing policy", () => {
    expect(config).toEqual({ pattern: "^/.*$", onError: "fail" });
  });
  it("keeps the public response and security headers on the approved production site", async () => {
    const next = context(new Response("unchanged public HTML", { headers: { "Content-Type": "text/html", ETag: '"public"' } }));
    const response = await handlePublicRequest(new Request(`${canonicalOrigin}/payment-acceptance-service`), next, production);
    expect(await response.text()).toBe("unchanged public HTML");
    expect(next.next).toHaveBeenCalledTimes(1);
    expect(response.headers.get("etag")).toBe('"public"');
    expect(response.headers.has("x-robots-tag")).toBe(false);
    for (const [key, value] of Object.entries(publicSecurityHeaders)) expect(response.headers.get(key)).toBe(value);
  });
  it.each(["deploy-preview", "branch-deploy", "dev", undefined])("denies indexing in trusted %s context even with production environment claims", async deployContext => {
    const next = context(new Response("<meta name=robots content=index,follow>"), { deploy: { context: deployContext } });
    const response = await handlePublicRequest(new Request(`${canonicalOrigin}/?CONTEXT=production`, { headers: { "x-forwarded-host": new URL(canonicalOrigin).host } }), next, { ...production, CONTEXT: "production", SITE_ID: PUBLIC_INDEXING_APPROVAL.siteId });
    expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
    expect(await response.text()).toBe("<meta name=robots content=index,follow>");
  });
  it("requires the platform site identity and all reviewed environment flags", async () => {
    for (const id of [undefined, "another-site"]) {
      const response = await handlePublicRequest(new Request(`${canonicalOrigin}/`), context(undefined, { site: { id } }), { ...production, SITE_ID: PUBLIC_INDEXING_APPROVAL.siteId });
      expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
    }
    for (const key of Object.keys(production)) {
      const response = await handlePublicRequest(new Request(`${canonicalOrigin}/`), context(), { ...production, [key]: undefined });
      expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
    }
  });
  it.each(["/privacy", "/privacy/", "/privacy.html", "/terms", "/terms/index.html"])("keeps the legal page %s private in production", async path => {
    const response = await handlePublicRequest(new Request(`${canonicalOrigin}${path}`), context(), production);
    expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
  });
  it.each(["/privacy.txt", "/terms.txt", "/index.txt", "/payment-acceptance-service.txt"])("does not index the raw navigation payload %s", async path => {
    const response = await handlePublicRequest(new Request(`${canonicalOrigin}${path}`), context(), production);
    expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
  });
  it("keeps missing pages private and preserves their 404 status", async () => {
    const response = await handlePublicRequest(new Request(`${canonicalOrigin}/missing`), context(new Response("Not found", { status: 404 })), production);
    expect(response.status).toBe(404);
    expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
  });
  it.each(["GET", "HEAD"])("does not expose a production sitemap or sitemap invitation in a preview for %s", async method => {
    for (const path of ["/robots.txt", "/sitemap.xml"]) {
      const next = context(new Response("production sitemap"), { deploy: { context: "deploy-preview" } });
      const response = await handlePublicRequest(new Request(`${canonicalOrigin}${path}`, { method }), next, production);
      expect(response.status).toBe(200);
      expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
      expect(response.headers.get("cache-control")).toBe("no-store");
      expect(next.next).not.toHaveBeenCalled();
      const body = await response.text();
      if (method === "HEAD") expect(body).toBe("");
      else if (path === "/robots.txt") expect(body).toBe("User-Agent: *\nAllow: /\nDisallow: /api/\n");
      else { expect(body).toContain("<urlset"); expect(body).not.toContain("<loc>"); }
    }
  });
});

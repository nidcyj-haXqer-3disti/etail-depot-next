import { LEGAL_CENTER_PATHS } from "../../src/shared/site/legal-paths";
import { describe, expect, it, vi } from "vitest";
import { managedContentRoute, retiredRoute } from "../../src/shared/site/public-routes";
import { canonicalOrigin, defaultOrigin, PUBLIC_INDEXING_APPROVAL } from "../../src/shared/site/public-release";
import { config, handlePublicRequest, publicSecurityHeaders, type PublicBoundaryContext } from "../../netlify/edge-functions/public-boundary";

const production = {
  NODE_ENV: "production", APP_ENV: "production", ETAIL_SEARCH_CONTEXT: "production",
  ETAIL_PUBLIC_ORIGIN: canonicalOrigin,
};
const guidePaths = ["/resources/guides"] as const;
function context(response = new Response("public page"), changes: Partial<PublicBoundaryContext> = {}) {
  return { site: { id: PUBLIC_INDEXING_APPROVAL.siteId }, deploy: { context: "production" }, next: vi.fn(async () => response), ...changes };
}
const retiredDestinations = [
  ["/login", "/resources/help#access"], ["/cardholder-services/cards/old-id", "/services/card-services#main-content"],
  ["/cards/old-id", "/services/card-services#main-content"], ["/merchant-services/terminals/old-id", "/services/merchant-services#main-content"],
  ["/merchants/old-id", "/services/merchant-services#main-content"], ["/profile", "/resources/help#access"], ["/security", "/resources/help#access"],
  ["/shared-access/old-id", "/resources/help#access"], ["/invitations/old-id", "/resources/help#access"], ["/money-accounts/old-id", "/#main-content"],
  ["/accounts/old-id", "/#main-content"], ["/services", "/#main-content"], ["/operations", "/resources/help#main-content"],
] as const;

const movedPublicPages = [
  ["/docs", "/developers/getting-started"],
  ["/docs/checkout", "/developers/getting-started"],
  ["/docs/merchant-onboarding", "/resources/merchant-account-setup"],
  ["/card-services", "/services/card-services"],
  ["/payment-services", "/services/merchant-services"],
] as const;
const publicAliases = movedPublicPages.flatMap(([oldPath, destination]) =>
  [oldPath, `${oldPath}/`, `${oldPath}.html`, `${oldPath}/index.html`].map(path => [path, destination] as const),
);

describe.each(["use-cases/software-platforms", "resources/merchant-account-setup", "developers/getting-started", "use-cases/online-businesses"])("reviewed %s boundary", root => {
  it.each(["GET", "HEAD"])("serves approved %s documents and keeps aliases and payloads private", async method => {
    for (const suffix of ["", "/", ".html", "/index.html", ".txt", "/__next._tree.txt"]) {
      const path = `/${root}${suffix}`, next = context(new Response(method === "HEAD" ? null : "page"));
      const response = await handlePublicRequest(new Request(canonicalOrigin + path, { method }), next, production);
      expect(response.status).toBe(200);
      expect(response.headers.has("x-robots-tag")).toBe(suffix !== "" || root.startsWith("developers/"));
      expect(next.next).toHaveBeenCalledTimes(1);
    }
  });
  it("preserves noindex and no-store in preview and wrong-site contexts", async () => {
    for (const changes of [{ deploy: { context: "dev" } }, { deploy: { context: "deploy-preview" } }, { site: { id: "another-site" } }]) {
      const response = await handlePublicRequest(new Request(canonicalOrigin + "/" + root), context(undefined, changes), production);
      expect(response.status).toBe(200);
      expect(response.headers.get("x-robots-tag")).toContain("noindex");
      expect(response.headers.get("cache-control")).toBe("no-store");
    }
  });
  it("denies unknown paths and encoded variants before downstream access", async () => {
    for (const path of [`/${root}/private`, `/${root}/record.json`, `/${root}/__next.secret.txt`, `/${root.toUpperCase()}`, `/%${root.charCodeAt(0).toString(16)}${root.slice(1)}`]) {
      expect(managedContentRoute(path)).toBe(true);
      const next = context();
      const response = await handlePublicRequest(new Request(canonicalOrigin + path), next, production);
      expect(response.status).toBe(404); expect(next.next).not.toHaveBeenCalled();
      expect(response.headers.get("x-robots-tag")).toContain("noindex");
    }
  });
  it.each(["POST", "PUT", "PATCH", "DELETE", "OPTIONS"])("rejects %s without reading or forwarding a body", async method => {
    const request = new Request(canonicalOrigin + "/" + root, { method, body: "synthetic" }), next = context();
    const response = await handlePublicRequest(request, next, production);
    expect(response.status).toBe(405); expect(request.bodyUsed).toBe(false); expect(next.next).not.toHaveBeenCalled();
  });
});

describe("production domain migration", () => {
  it.each(["GET", "HEAD"])("redirects %s from the exact production subdomain without carrying query inputs", async method => {
    for (const path of ["/", "/services/card-services", "/services/merchant-services", "/resources/help", ...guidePaths, "/company/privacy", "/company/terms", "/robots.txt", "/sitemap.xml", "/brand/logo.png", "/missing"]) {
      const next = context();
      const response = await handlePublicRequest(new Request(`${defaultOrigin}${path}?token=private&next=https://other.invalid#fees`, { method }), next, production);
      expect(response.status).toBe(308);
      expect(response.headers.get("location")).toBe(`${canonicalOrigin}${path}`);
      expect(response.headers.get("cache-control")).toBe("no-store");
      expect(response.headers.has("x-robots-tag")).toBe(false);
      expect(response.headers.has("set-cookie")).toBe(false);
      expect(await response.text()).toBe("");
      expect(next.next).not.toHaveBeenCalled();
      for (const [key, value] of Object.entries(publicSecurityHeaders)) expect(response.headers.get(key)).toBe(value);
    }
  });

  it("combines an old public page and production-domain move in one redirect", async () => {
    for (const [path, destination] of publicAliases) {
      const response = await handlePublicRequest(new Request(`${defaultOrigin}${path}?token=private#wallets`), context(), production);
      expect(response.status).toBe(308);
      expect(response.headers.get("location")).toBe(`${canonicalOrigin}${destination}`);
      // Leaving the fragment unset preserves an existing public section bookmark in browsers.
      expect(new URL(response.headers.get("location")!).hash).toBe("");
    }
  });

  it.each(["POST", "PUT", "PATCH", "DELETE", "OPTIONS"])("does not redirect or read %s bodies during a domain move", async method => {
    const request = new Request(`${defaultOrigin}/?token=private`, { method, body: "synthetic-private-input" });
    const next = context(new Response("Method not allowed", { status: 405 }));
    const response = await handlePublicRequest(request, next, production);
    expect(response.status).toBe(405);
    expect(response.headers.has("location")).toBe(false);
    expect(request.bodyUsed).toBe(false);
    expect(next.next).toHaveBeenCalledTimes(1);

    for (const [path] of publicAliases) {
      const aliasRequest = new Request(`${defaultOrigin}${path}`, { method, body: "synthetic-private-input" });
      const aliasNext = context();
      const aliasResponse = await handlePublicRequest(aliasRequest, aliasNext, production);
      expect(aliasResponse.status).toBe(405);
      expect(aliasResponse.headers.has("location")).toBe(false);
      expect(aliasRequest.bodyUsed).toBe(false);
      expect(aliasNext.next).not.toHaveBeenCalled();
    }
  });

  it("keeps retired account bookmarks on their fixed local recovery route before moving domains", async () => {
    for (const [path, destination] of retiredDestinations) {
      const next = context();
      const response = await handlePublicRequest(new Request(`${defaultOrigin}${path}?token=private#private`), next, production);
      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toBe(`${defaultOrigin}${destination}`);
      expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
      expect(next.next).not.toHaveBeenCalled();
    }
  });

  it.each(["GET", "HEAD", "POST"])("preserves retired financial responses for %s instead of moving their input", async method => {
    for (const path of ["/api/v1/sessions", "/checkout/old-payment", "/pay/old-link", "/payments/old-receipt", ...(method === "POST" ? ["/login", "/accounts/old-id"] : [])]) {
      const request = new Request(`${defaultOrigin}${path}?token=private`, { method, ...(method === "POST" ? { body: "synthetic-private-input" } : {}) });
      const next = context();
      const response = await handlePublicRequest(request, next, production);
      expect(response.status).toBe(410);
      expect(response.headers.has("location")).toBe(false);
      expect(request.bodyUsed).toBe(false);
      expect(next.next).not.toHaveBeenCalled();
    }
  });

  it.each(["GET", "HEAD", "POST"])("leaves %s platform endpoints on their original host", async method => {
    for (const path of ["/.netlify", "/.netlify/functions/emails", "/.netlify/functions/emails/template", "/.netlify/identity/token"]) {
      const request = new Request(`${defaultOrigin}${path}?token=private`, { method, ...(method === "POST" ? { body: "synthetic-private-input" } : {}) });
      const next = context(new Response(null, { status: 404 }));
      const response = await handlePublicRequest(request, next, production);
      expect(response.status).toBe(404);
      expect(response.headers.has("location")).toBe(false);
      expect(request.bodyUsed).toBe(false);
      expect(next.next).toHaveBeenCalledTimes(1);
    }
  });

  it.each(["deploy-preview", "branch-deploy", "dev", undefined])("does not move the default host in trusted %s context", async deployContext => {
    const next = context(undefined, { deploy: { context: deployContext } });
    const response = await handlePublicRequest(new Request(`${defaultOrigin}/?CONTEXT=production`), next, production);
    expect(response.status).toBe(200);
    expect(response.headers.has("location")).toBe(false);
    expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
    expect(next.next).toHaveBeenCalledTimes(1);
  });

  it("requires the exact site identity and release environment before moving a host", async () => {
    for (const changes of [{ site: { id: "another-site" } }, { site: undefined }]) {
      const next = context(undefined, changes);
      const response = await handlePublicRequest(new Request(`${defaultOrigin}/`), next, production);
      expect(response.headers.has("location")).toBe(false);
      expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
    }
    for (const key of Object.keys(production)) {
      const response = await handlePublicRequest(new Request(`${defaultOrigin}/`), context(), { ...production, [key]: undefined });
      expect(response.headers.has("location")).toBe(false);
      expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
    }
  });

  it("does not match custom, local, preview, permalink or lookalike origins", async () => {
    for (const origin of [canonicalOrigin, "https://www.etaildepot.com", "http://127.0.0.1:3100", "http://etail-depot-next.netlify.app", "https://deploy-preview-215--etail-depot-next.netlify.app", "https://branch--etail-depot-next.netlify.app", "https://6acf12b74fe02b69c92bcc60--etail-depot-next.netlify.app", "https://etail-depot-next.netlify.app.other.invalid", "https://other.netlify.app"]) {
      const next = context();
      const response = await handlePublicRequest(new Request(`${origin}/`), next, production);
      expect(response.status).toBe(200);
      expect(response.headers.has("location")).toBe(false);
      expect(next.next).toHaveBeenCalledTimes(1);
    }
  });

  it("ignores forwarded hosts and cannot turn a path into a redirect authority", async () => {
    const response = await handlePublicRequest(new Request(`${canonicalOrigin}/`, { headers: { host: new URL(defaultOrigin).host, "x-forwarded-host": new URL(defaultOrigin).host } }), context(), production);
    expect(response.headers.has("location")).toBe(false);
    for (const path of ["//other.invalid/help", "/%2F%2Fother.invalid/help"]) {
      const redirected = await handlePublicRequest(new Request(`${defaultOrigin}${path}`, { headers: { "x-forwarded-host": "other.invalid" } }), context(), production);
      expect(redirected.status).toBe(308);
      expect(new URL(redirected.headers.get("location")!).origin).toBe(canonicalOrigin);
      expect(new URL(redirected.headers.get("location")!).pathname).toBe(path);
    }
  });
});

describe("renamed public product pages", () => {
  it.each(publicAliases)("permanently redirects GET and HEAD %s to its exact new path", async (path, destination) => {
    for (const method of ["GET", "HEAD"]) {
      const next = context();
      const response = await handlePublicRequest(new Request(`${canonicalOrigin}${path}?next=https://other.invalid&token=synthetic-test#fees`, { method }), next, production);
      expect(response.status).toBe(308);
      expect(response.headers.get("location")).toBe(`${canonicalOrigin}${destination}`);
      // No replacement fragment: the browser can retain an existing public section bookmark.
      expect(new URL(response.headers.get("location")!).hash).toBe("");
      expect(response.headers.has("x-robots-tag")).toBe(destination.startsWith("/developers/"));
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
    for (const path of [`${oldPath}/missing`, `${oldPath}/index.html/extra`, `${oldPath}//`, `${oldPath}.txt`, `${oldPath}.html/`, `${oldPath}-other`, `${oldPath}%2Findex.html`, oldPath.replace("/", "/%2F")]) {
      const next = context(new Response("Not found", { status: 404 }));
      const response = await handlePublicRequest(new Request(`${canonicalOrigin}${path}`), next, production);
      expect(response.status).toBe(404);
      expect(response.headers.has("location")).toBe(false);
      expect(next.next).toHaveBeenCalledTimes(managedContentRoute(path) ? 0 : 1);
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
      expect(await response.text()).toBe(method === "HEAD" ? "" : "This service link is no longer available. Visit /resources/help for support.");
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
  it.each(["/", "/services/card-services", "/services/merchant-services", "/resources/help", ...guidePaths, "/company/privacy", "/company/terms", "/apiary", "/constructor", "/__proto__"])("does not capture public or unrelated route %s", path => {
    expect(retiredRoute(path)).toBeNull();
  });
});

describe("public Edge search and security policy", () => {
  it("matches all routes and methods and fails closed rather than bypassing policy", () => {
    expect(config).toEqual({ pattern: "^/.*$", onError: "fail" });
  });
  it.each(["/services/merchant-services", ...guidePaths])("keeps the %s response and security headers on the approved production site", async path => {
    const next = context(new Response("unchanged public HTML", { headers: { "Content-Type": "text/html", ETag: '"public"' } }));
    const response = await handlePublicRequest(new Request(`${canonicalOrigin}${path}`), next, production);
    expect(await response.text()).toBe("unchanged public HTML");
    expect(next.next).toHaveBeenCalledTimes(1);
    expect(response.headers.get("etag")).toBe('"public"');
    expect(response.headers.has("x-robots-tag")).toBe(false);
    for (const [key, value] of Object.entries(publicSecurityHeaders)) expect(response.headers.get(key)).toBe(value);
  });
  it.each(["deploy-preview", "branch-deploy", "dev", undefined])("denies indexing in trusted %s context even with production environment claims", async deployContext => {
    for (const path of ["/", ...guidePaths]) {
      const next = context(new Response("<meta name=robots content=index,follow>"), { deploy: { context: deployContext } });
      const response = await handlePublicRequest(new Request(`${canonicalOrigin}${path}?CONTEXT=production`, { headers: { "x-forwarded-host": new URL(canonicalOrigin).host } }), next, { ...production, CONTEXT: "production", SITE_ID: PUBLIC_INDEXING_APPROVAL.siteId });
      expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
      expect(await response.text()).toBe("<meta name=robots content=index,follow>");
    }
  });
  it("requires the platform site identity and all reviewed environment flags", async () => {
    for (const path of ["/", ...guidePaths]) {
      for (const id of [undefined, "another-site"]) {
        const response = await handlePublicRequest(new Request(`${canonicalOrigin}${path}`), context(undefined, { site: { id } }), { ...production, SITE_ID: PUBLIC_INDEXING_APPROVAL.siteId });
        expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
      }
      for (const key of Object.keys(production)) {
        const response = await handlePublicRequest(new Request(`${canonicalOrigin}${path}`), context(), { ...production, [key]: undefined });
        expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
      }
    }
  });
  it.each(["/company/privacy", "/company/privacy/", "/company/privacy.html", "/company/terms", "/company/terms/index.html", ...LEGAL_CENTER_PATHS.flatMap(path => [path, `${path}/`, `${path}.html`, `${path}.txt`, `${path}/index.html`])])("keeps the legal page %s private in production", async path => {
    const response = await handlePublicRequest(new Request(`${canonicalOrigin}${path}`), context(), production);
    expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
  });
  it.each(["/company/privacy.txt", "/company/terms.txt", "/index.txt", "/services/merchant-services.txt", ...guidePaths.map(path => `${path}.txt`)])("does not index the raw navigation payload %s", async path => {
    const response = await handlePublicRequest(new Request(`${canonicalOrigin}${path}`), context(), production);
    expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
  });
  it.each(["/missing", "/resources/guides/unreviewed", "/resources/guides/payment-processing-fees", "/resources/guides/how-to-create-a-payment-link/unreviewed", "/resources/guides/booking-system-with-payment", "/resources/guides/countertop-payment-terminal", "/resources/guides/use-a-cash-register", "/resources/guides/charge-cards", "/resources/guides/sections/payment-processing-checkout", "/resources/guides/page/2", "/guide-search/pagefind.js", "/review/guides/manifest.json"])("keeps missing page %s private and preserves its 404 status", async path => {
    const response = await handlePublicRequest(new Request(`${canonicalOrigin}${path}`), context(new Response("Not found", { status: 404 })), production);
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

describe("public response revalidation", () => {
  const validators = { "If-None-Match": '"unchanged-public-file"' };
  const deliveryHeaders = {
    ETag: validators["If-None-Match"],
    "Cache-Control": "public, max-age=0, must-revalidate",
    Vary: "Accept-Encoding",
  };

  it.each(["GET", "HEAD"])("preserves body-free 304 responses and security policy for approved %s requests", async method => {
    for (const [path, noindex] of [
      ["/", false], ["/resources/shopify-gateway-integration", false],
      ["/resources/woocommerce-gateway-integration", false], ["/resources/merchant-account-setup", false],
      ["/_next/static/chunks/example.css", false], ["/_next/static/media/example.webp", false],
      ["/robots.txt", false], ["/sitemap.xml", false],
      ["/company/legal/merchant-services", true], ["/company/privacy", true], ["/company/terms", true],
      ["/developers/getting-started.html", true], ["/developers/getting-started.txt", true],
    ] as const) {
      const next = context(new Response(null, { status: 304, headers: deliveryHeaders }));
      const response = await handlePublicRequest(new Request(canonicalOrigin + path, { method, headers: validators }), next, production);
      expect(next.next).toHaveBeenCalledExactlyOnceWith({ sendConditionalRequest: true });
      expect(response.status).toBe(304);
      expect(response.body).toBeNull();
      for (const [key, value] of Object.entries({ ...deliveryHeaders, ...publicSecurityHeaders })) expect(response.headers.get(key)).toBe(value);
      expect(response.headers.has("x-robots-tag")).toBe(noindex);
      if (noindex) expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
    }
  });

  it("delivers changed content and its new validator without buffering or replacing the body", async () => {
    const upstream = new Response("new public content", { headers: { ...deliveryHeaders, ETag: '"new-public-file"' } });
    const stream = upstream.body;
    const next = context(upstream);
    const response = await handlePublicRequest(new Request(canonicalOrigin, { headers: validators }), next, production);
    expect(next.next).toHaveBeenCalledExactlyOnceWith({ sendConditionalRequest: true });
    expect(response.status).toBe(200);
    expect(response.body).toBe(stream);
    expect(upstream.bodyUsed).toBe(false);
    expect(response.headers.get("etag")).toBe('"new-public-file"');
    expect(await response.text()).toBe("new public content");
  });

  it("requests a full response when any trusted production condition is missing", async () => {
    const cases: [Partial<PublicBoundaryContext>, Record<string, string | undefined>][] = [
      ...["deploy-preview", "branch-deploy", "dev", undefined].map(value => [{ deploy: { context: value } }, production] as [Partial<PublicBoundaryContext>, typeof production]),
      [{ site: { id: "another-site" } }, production], [{ site: undefined }, production],
      ...Object.keys(production).map(key => [{}, { ...production, [key]: undefined }] as [Partial<PublicBoundaryContext>, Record<string, string | undefined>]),
    ];
    for (const [changes, environment] of cases) {
      const next = context(new Response("current page", { headers: deliveryHeaders }), changes);
      const response = await handlePublicRequest(new Request(canonicalOrigin, { headers: validators }), next, environment);
      expect(next.next).toHaveBeenCalledExactlyOnceWith({ sendConditionalRequest: false });
      expect(response.status).toBe(200);
      expect(response.headers.get("cache-control")).toBe("no-store");
      expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
      expect(await response.text()).toBe("current page");
    }
  });

  it.each(["GET", "HEAD", "POST"])("leaves platform endpoint behavior unchanged for %s", async method => {
    const request = new Request(canonicalOrigin + "/.netlify/functions/emails", {
      method, headers: validators, ...(method === "POST" ? { body: "synthetic-private-input" } : {}),
    });
    const next = context(new Response(null, { status: 401 }));
    const response = await handlePublicRequest(request, next, production);
    expect(next.next).toHaveBeenCalledExactlyOnceWith({ sendConditionalRequest: false });
    expect(response.status).toBe(401);
    expect(request.bodyUsed).toBe(false);
  });

  it("does not revalidate submitted requests or read their bodies", async () => {
    const request = new Request(canonicalOrigin, { method: "POST", headers: validators, body: "synthetic-private-input" });
    const next = context(new Response(null, { status: 405 }));
    const response = await handlePublicRequest(request, next, production);
    expect(next.next).toHaveBeenCalledExactlyOnceWith({ sendConditionalRequest: false });
    expect(response.status).toBe(405);
    expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
    expect(request.bodyUsed).toBe(false);
  });

  it("runs retirement, alias, unknown-route and preview metadata checks before revalidation", async () => {
    for (const [origin, path, changes, status] of [
      [canonicalOrigin, "/login", {}, 307],
      [canonicalOrigin, "/api/checkout", {}, 410],
      [canonicalOrigin, "/card-services", {}, 308],
      [canonicalOrigin, "/developers/getting-started/unreviewed", {}, 404],
      [defaultOrigin, "/", {}, 308],
      [canonicalOrigin, "/sitemap.xml", { deploy: { context: "deploy-preview" } }, 200],
      [canonicalOrigin, "/robots.txt", { deploy: { context: "deploy-preview" } }, 200],
    ] as const) {
      const next = context(new Response(null, { status: 304, headers: deliveryHeaders }), changes);
      const response = await handlePublicRequest(new Request(origin + path, { headers: validators }), next, production);
      expect(next.next).not.toHaveBeenCalled();
      expect(response.status).toBe(status);
      expect(response.headers.get("cache-control")).toBe("no-store");
      if (path === "/sitemap.xml") expect(await response.text()).not.toContain("<loc>");
      if (path === "/robots.txt") expect(await response.text()).not.toContain("Sitemap:");
    }
  });

  it("retains 404 and noindex when a previously cached file is no longer present", async () => {
    const next = context(new Response("Not found", { status: 404 }));
    const response = await handlePublicRequest(new Request(canonicalOrigin + "/_next/static/media/removed.webp", { headers: validators }), next, production);
    expect(next.next).toHaveBeenCalledExactlyOnceWith({ sendConditionalRequest: true });
    expect(response.status).toBe(404);
    expect(response.headers.get("x-robots-tag")).toBe("noindex, nofollow");
    expect(await response.text()).toBe("Not found");
  });
});

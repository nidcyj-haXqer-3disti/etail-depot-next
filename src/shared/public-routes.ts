export { publicDocumentPath, publicPayloadPath, isIndexablePath } from "./public-page-inventory.ts";
import { RETIRED_ARTICLE_PATHS } from "./retired-article-paths.ts";

/** Fixed local destinations for bookmarks from the retired account application. */
const retiredDestinations: Record<string, string> = {
  "cardholder-services": "/credit-card-services",
  cards: "/credit-card-services",
  "merchant-services": "/payment-acceptance-service",
  merchants: "/payment-acceptance-service",
  login: "/help#access",
  profile: "/help#access",
  security: "/help#access",
  "shared-access": "/help#access",
  invitations: "/help#access",
  operations: "/help",
  "money-accounts": "/",
  accounts: "/",
  services: "/",
};

export function retiredRoute(pathname: string): { destination?: string } | null {
  const root = pathname.split("/")[1] ?? "";
  if (["api", "checkout", "pay", "payments"].includes(root)) return {};
  return Object.hasOwn(retiredDestinations, root) ? { destination: retiredDestinations[root] } : null;
}

/** Former public-page URLs. Match only known HTML aliases, never a nested service path. */
export function publicPageRedirect(pathname: string): string | null {
  const match = /^\/(card-services|payment-services)(?:\/|\.html|\/index\.html)?$/.exec(pathname);
  if (!match) return null;
  return match[1] === "card-services" ? "/credit-card-services" : "/payment-acceptance-service";
}

/** Normalize managed paths consistently for both denial and bookmark handling. */
function normalizedPreviewPath(pathname: string): string | null {
  let decoded = pathname;
  try {
    // Export paths and framework payloads must not escape a managed route via encoding.
    for (let pass = 0; pass < 3; pass++) {
      const next = decodeURIComponent(decoded);
      if (next === decoded) break;
      decoded = next;
    }
  } catch { return null; }
  return decoded.replaceAll("\\", "/").replace(/\/{2,}/g, "/").toLowerCase();
}

/** Include old bookmarks, HTML aliases and navigation payloads in the exact inventory boundary. */
export function managedContentRoute(pathname: string): boolean {
  const normalized = normalizedPreviewPath(pathname);
  if (normalized === null) return false;
  if (/^\/(?:software-partners|docs|online-businesses|use-cases)(?:$|[/.])/.test(normalized)) return true;
  if (/^\/guides(?:$|[/.])/.test(normalized)) return true;
  return false;
}

/** HTML, old trailing-slash paths and framework payloads share the same retirement. */
export function retiredArticleRoute(pathname: string): boolean {
  const normalized = normalizedPreviewPath(pathname);
  if (normalized === null) return false;
  const root = /^(\/guides\/[^/.]+)(?:$|[/.])/.exec(normalized)?.[1];
  if (!root || !(RETIRED_ARTICLE_PATHS as readonly string[]).includes(root)) return false;
  const suffix = normalized.slice(root.length);
  return ["", "/", ".html", "/index.html", ".txt"].includes(suffix) || /^(?:\.|\/)__next(?:[./]|$)/.test(suffix);
}

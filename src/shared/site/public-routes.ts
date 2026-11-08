import { CORE_PAGE_MOVES } from "./page-url-migrations.ts";
import { isPublicContentPath, publicDocumentPath, publicPayloadPath } from "./public-page-inventory.ts";
import { DOCUMENTATION_REDIRECTS } from "./developer-paths.ts";
export { publicDocumentPath, publicPayloadPath, isIndexablePath } from "./public-page-inventory.ts";
import { COMMERCIAL_PATHS } from "./commercial-paths.ts";
import { RETIRED_ARTICLE_PATHS } from "./retired-article-paths.ts";

/** Fixed local destinations for bookmarks from the retired account application. */
const retiredDestinations: Record<string, string> = {
  "cardholder-services": "/services/card-services",
  cards: "/services/card-services",
  "merchant-services": "/services/merchant-services",
  merchants: "/services/merchant-services",
  login: "/resources/help#access",
  profile: "/resources/help#access",
  security: "/resources/help#access",
  "shared-access": "/resources/help#access",
  invitations: "/resources/help#access",
  operations: "/resources/help",
  "money-accounts": "/",
  accounts: "/",
  services: "/",
};

export function retiredRoute(pathname: string): { destination?: string } | null {
  // Only exact public service documents and their exported payloads leave retirement.
  if (pathname.startsWith("/services/") && (publicDocumentPath(pathname) || publicPayloadPath(pathname))) return null;
  const root = pathname.split("/")[1] ?? "";
  if (["api", "checkout", "pay", "payments"].includes(root)) return {};
  return Object.hasOwn(retiredDestinations, root) ? { destination: retiredDestinations[root] } : null;
}

/** Former public-page URLs. Match only known HTML aliases, never a nested service path. */
export function publicPageRedirect(pathname: string): string | null {
  const document = pathname.replace(/(?:\/index\.html|\.html|\/)$/, "");
  if (Object.hasOwn(CORE_PAGE_MOVES, document)) return CORE_PAGE_MOVES[document];
  if (/^\/guides\/iso-(?:20022|8583)(?:\/|$)/.test(document) && isPublicContentPath(`/resources${document}`)) return `/resources${document}`;
  if (Object.hasOwn(DOCUMENTATION_REDIRECTS, document)) return DOCUMENTATION_REDIRECTS[document];
  const match = /^\/(card-services|payment-services)(?:\/|\.html|\/index\.html)?$/.exec(pathname);
  if (!match) return null;
  return match[1] === "card-services" ? "/services/card-services" : "/services/merchant-services";
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
  if (/^\/(?:software-partners|docs|developers|online-businesses|use-cases|legal|resources|company|services)(?:$|[/.])/.test(normalized)) return true;
  if (Object.keys(CORE_PAGE_MOVES).some(path => path !== "/help" && (normalized === path || normalized.startsWith(path + "/") || normalized.startsWith(path + ".")))) return true;
  if (COMMERCIAL_PATHS.some(path => normalized === path || normalized.startsWith(path + "/") || normalized.startsWith(path + "."))) return true;
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

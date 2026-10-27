import { STANDARD_REFERENCE_PATHS } from "./standard-reference-paths.ts";

/** Frozen release candidate approved for preparation on 28 October 2026. */
export const CORE_PUBLIC_PATHS = [
  "/", "/credit-card-services", "/payment-acceptance-service", "/help", "/privacy", "/terms", "/guides",
  "/software-partners", "/online-businesses", "/docs", "/docs/merchant-onboarding", "/docs/integration-access",
  "/docs/checkout", "/docs/payment-requests", "/docs/payment-status", "/docs/refunds-and-disputes",
  "/docs/payouts", "/docs/webhooks", "/docs/testing-and-launch",
] as const;
export const PUBLIC_CONTENT_PATHS: readonly string[] = [...CORE_PUBLIC_PATHS, ...STANDARD_REFERENCE_PATHS];
export const INDEXABLE_PUBLIC_PATHS = PUBLIC_CONTENT_PATHS.filter(path => !["/privacy", "/terms"].includes(path));
const pages = new Set(PUBLIC_CONTENT_PATHS);
const indexable = new Set(INDEXABLE_PUBLIC_PATHS);
export function isPublicContentPath(path: string): boolean { return pages.has(path); }
export function isIndexablePath(path: string): boolean { return indexable.has(path); }
export function publicDocumentPath(path: string): string | null {
  if (pages.has(path)) return path;
  const candidate = path === "/index.html" ? "/" : path.replace(/(?:\/index\.html|\.html|\/)$/, "");
  return pages.has(candidate) ? candidate : null;
}
/** Only real exported navigation payloads may accompany a reviewed document. */
export function publicPayloadPath(path: string): string | null {
  if (!path.endsWith(".txt")) return null;
  const simple = path === "/index.txt" ? "/" : path.slice(0, -4);
  if (pages.has(simple)) return simple;
  const split = path.lastIndexOf("/__next.");
  if (split < 0) return null;
  const parent = path.slice(0, split) || "/";
  if (!pages.has(parent)) return null;
  let page = parent.slice(1).replaceAll("/", ".");
  if (parent.startsWith("/guides/iso-20022/")) page = "guides.iso-20022.$d$set" + (parent.split("/").length === 5 ? ".$d$code" : "");
  if (parent.startsWith("/guides/iso-8583/")) page = "guides.iso-8583.$d$table" + (parent.split("/").length === 5 ? ".$d$code" : "");
  const file = path.slice(split + 1);
  return ["__next._tree.txt", "__next._full.txt", `__next.${page}.__PAGE__.txt`].includes(file) ? parent : null;
}
export function publicExportFile(file: string): boolean {
  if (file === "index.html") return true;
  return file.endsWith(".html") ? pages.has("/" + file.slice(0, -5)) : publicPayloadPath("/" + file) !== null;
}

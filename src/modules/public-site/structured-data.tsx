import { publicPageJsonLd, type PublicPath } from "./metadata";

/** Exact catalog/core-page facts only; no draft payloads, customer data or inferred author credentials. */
export function PublicPageStructuredData({ path }: { path: PublicPath }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: publicPageJsonLd(path) }} />;
}

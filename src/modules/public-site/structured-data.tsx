import { publicPageJsonLd, type PublicPath } from "./metadata";

/** Public brand/page facts only. Never pass customer projections into search markup. */
export function PublicPageStructuredData({ path }: { path: PublicPath }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: publicPageJsonLd(path) }} />;
}

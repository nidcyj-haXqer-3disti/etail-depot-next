/** Render the reviewed JSON-LD supplied by the owning page feature. */
export function PublicPageStructuredData({ json }: { json: string }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

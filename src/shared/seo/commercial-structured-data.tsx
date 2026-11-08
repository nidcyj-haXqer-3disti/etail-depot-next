import { COMMERCIAL_PAGES, type CommercialPath } from "@/modules/public-site/commercial-content";
import { canonicalOrigin } from "@/shared/site/public-release";
import { publicPageModified } from "@/modules/public-site/metadata";
import { serviceBreadcrumb, type ServiceContextPath } from "./service-context";
import { companyBreadcrumbData, type CompanyContextPath } from "./resource-context";

export function CommercialStructuredData({ path }: { path: CommercialPath }) {
  const page = COMMERCIAL_PAGES[path];
  const url = canonicalOrigin + path;
  const refined = !["/company", "/trust", "/contact", "/payment-facilitator"].includes(path);
  const jsonLd = { "@context": "https://schema.org", "@graph": [
    { "@type": path === "/company" ? "AboutPage" : path === "/contact" ? "ContactPage" : "WebPage", "@id": `${url}#webpage`, url, name: page.title, description: page.description, inLanguage: "en-US", dateModified: publicPageModified(path), isPartOf: { "@id": `${canonicalOrigin}/#website` }, publisher: { "@id": `${canonicalOrigin}/#organization` }, breadcrumb: { "@id": `${url}#breadcrumb` } },
    ...(refined ? [serviceBreadcrumb(path as ServiceContextPath)] : [companyBreadcrumbData(path as CompanyContextPath)]),
  ] };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />;
}

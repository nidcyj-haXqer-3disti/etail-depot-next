import type { CommercialPage } from "@/shared/ui/page-content-types";
import { canonicalOrigin } from "@/shared/site/public-release";
import { publicPageModified } from "@/shared/seo/metadata";
import { serviceBreadcrumb, type ServiceContextPath } from "./service-context";
import { companyBreadcrumbData, type CompanyContextPath } from "./resource-context";

export function CommercialStructuredData({ path, page }: { path: string; page: Pick<CommercialPage, "title" | "description"> }) {
  const url = canonicalOrigin + path;
  const refined = !["/company/about", "/company/security", "/company/contact", "/services/payment-facilitator"].includes(path);
  const jsonLd = { "@context": "https://schema.org", "@graph": [
    { "@type": path === "/company/about" ? "AboutPage" : path === "/company/contact" ? "ContactPage" : "WebPage", "@id": `${url}#webpage`, url, name: page.title, description: page.description, inLanguage: "en-US", dateModified: publicPageModified(path), isPartOf: { "@id": `${canonicalOrigin}/#website` }, publisher: { "@id": `${canonicalOrigin}/#organization` }, breadcrumb: { "@id": `${url}#breadcrumb` } },
    ...(refined ? [serviceBreadcrumb(path as ServiceContextPath)] : [companyBreadcrumbData(path as CompanyContextPath)]),
  ] };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />;
}

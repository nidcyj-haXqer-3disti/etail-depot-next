import { servicePageMetadata,canonicalOrigin,publicPageModified } from "@/shared/seo/metadata";
import { DEVELOPER_PAGES,type DeveloperSlug } from "@/shared/site/developer-paths";
const descriptions = {
  "getting-started": "After merchant approval, access the Back Office Operations Portal and Cybersource, choose your store integration and prepare checkout for testing.",
  "api-reference": "Connect a custom website to Cybersource Unified Checkout with secure server sessions, hosted payment fields, verified results and payment operations.",
  "webhooks": "Set up Cybersource Unified Checkout notifications, verify encrypted deliveries and handle repeated, delayed or missing payment results.",
  "developer-tools": "Find official Cybersource SDKs, sandbox tools and transaction references, and use the right merchant portal for account support.",
  "testing": "Test Cybersource checkout, payment results, digital wallets and recovery in the sandbox, then prepare authorized live checks and support.",
  "sdks": "Etail SDKs, installation instructions and code examples will be available here.",
  "changelog": "Updates to Etail APIs and developer tools will be published here.",
  "api-status": "Availability and incident updates will appear here when Etail API services launch."
} as const;
export const developerPageDetails = Object.fromEntries(DEVELOPER_PAGES.map(page=>[page.href,{title:page.label,description:descriptions[page.slug]}])) as Record<`/developers/${DeveloperSlug}`,{title:string;description:string}>;
export function developerMetadata(slug:DeveloperSlug){return servicePageMetadata(`/developers/${slug}`,developerPageDetails[`/developers/${slug}`]);}
export function developerJsonLd(slug:DeveloperSlug){
 const path=`/developers/${slug}`;const details=developerPageDetails[path as keyof typeof developerPageDetails];const url=canonicalOrigin+path;
 return JSON.stringify({"@context":"https://schema.org","@type":"WebPage","@id":url+"#webpage",url,name:details.title,description:details.description,inLanguage:"en-US",dateModified:publicPageModified(path),isPartOf:{"@id":canonicalOrigin+"/#website"},publisher:{"@id":canonicalOrigin+"/#organization"}}).replace(/</g,"\\u003c");
}

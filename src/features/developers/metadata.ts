import { servicePageMetadata,canonicalOrigin,publicPageModified } from "@/shared/seo/metadata";
import { DEVELOPER_PAGES,type DeveloperSlug } from "@/shared/site/developer-paths";
const descriptions = {
  "getting-started": "Prepare your existing merchant integration: account access, checkout and payment results.",
  "api-reference": "Understand payment statuses, refunds, disputes and payouts for your existing merchant integration.",
  "webhooks": "Verify payment notifications and handle repeated, missing or delayed updates.",
  "developer-tools": "Create a payment request using the tools enabled for your merchant account.",
  "testing": "Check account access, checkout and reporting before accepting live payments.",
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

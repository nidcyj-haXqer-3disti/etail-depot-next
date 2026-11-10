import { servicePageMetadata,canonicalOrigin,publicPageModified } from "@/shared/seo/metadata";
export const pageDetails = {"title": "Merchant account setup", "description": "Set up your Trolleys merchant account with guidance on business details, sales estimates, owners, banking, application review and additional DBAs."};
const path="/resources/merchant-account-setup";
export const metadata=servicePageMetadata(path,pageDetails);
export function merchantAccountJsonLd(){return JSON.stringify({"@context":"https://schema.org","@type":"WebPage","@id":canonicalOrigin+path+"#webpage",url:canonicalOrigin+path,name:pageDetails.title,description:pageDetails.description,inLanguage:"en-US",dateModified:publicPageModified(path),isPartOf:{"@id":canonicalOrigin+"/#website"},publisher:{"@id":canonicalOrigin+"/#organization"}});}

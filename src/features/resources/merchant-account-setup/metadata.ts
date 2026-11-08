import { servicePageMetadata,canonicalOrigin,publicPageModified } from "@/shared/seo/metadata";
export const pageDetails = {"title": "Merchant account setup", "description": "Enter your email on Trolleys Welcome before choosing Register or Sign In. Follow the illustrated steps to create or access your merchant account."};
const path="/resources/merchant-account-setup";
export const metadata=servicePageMetadata(path,pageDetails);
export function merchantAccountJsonLd(){return JSON.stringify({"@context":"https://schema.org","@type":"WebPage","@id":canonicalOrigin+path+"#webpage",url:canonicalOrigin+path,name:pageDetails.title,description:pageDetails.description,inLanguage:"en-US",dateModified:publicPageModified(path),isPartOf:{"@id":canonicalOrigin+"/#website"},publisher:{"@id":canonicalOrigin+"/#organization"}});}

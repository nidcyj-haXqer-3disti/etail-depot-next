import { articleMetadata } from "@/features/company/blog/metadata";
import { addressPurposeArticle } from "@/features/company/blog/address-purpose-content";

export const metadata = articleMetadata(addressPurposeArticle);
export { AddressPurposePage as default } from "@/features/company/blog/address-purpose-page";

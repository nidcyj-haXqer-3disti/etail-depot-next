import { articleMetadata } from "@/features/company/blog/metadata";
import { addressHistoryArticle } from "@/features/company/blog/address-history-content";

export const metadata = articleMetadata(addressHistoryArticle);
export { AddressHistoryPage as default } from "@/features/company/blog/address-history-page";

import { articleMetadata } from "@/features/company/blog/metadata";
import { registeredAddressArticle } from "@/features/company/blog/registered-address-content";

export const metadata = articleMetadata(registeredAddressArticle);
export { RegisteredAddressPage as default } from "@/features/company/blog/registered-address-page";

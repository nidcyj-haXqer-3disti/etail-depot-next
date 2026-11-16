import { articleMetadata } from "@/features/company/blog/metadata";
import { gettingMerchantAccountArticle } from "@/features/company/blog/getting-merchant-account-content";

export const metadata = articleMetadata(gettingMerchantAccountArticle);
export { GettingMerchantAccountPage as default } from "@/features/company/blog/getting-merchant-account-page";

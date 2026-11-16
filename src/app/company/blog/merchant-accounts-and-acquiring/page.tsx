import { articleMetadata } from "@/features/company/blog/metadata";
import { merchantAccountsArticle } from "@/features/company/blog/merchant-accounts-content";

export const metadata = articleMetadata(merchantAccountsArticle);
export { MerchantAccountsPage as default } from "@/features/company/blog/merchant-accounts-page";

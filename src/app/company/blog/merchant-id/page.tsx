import { articleMetadata } from "@/features/company/blog/metadata";
import { merchantIdArticle } from "@/features/company/blog/merchant-id-content";

export const metadata = articleMetadata(merchantIdArticle);
export { MerchantIdPage as default } from "@/features/company/blog/merchant-id-page";

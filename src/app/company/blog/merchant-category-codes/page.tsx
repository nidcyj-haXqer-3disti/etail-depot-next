import { articleMetadata } from "@/features/company/blog/metadata";
import { merchantCategoryCodesArticle } from "@/features/company/blog/merchant-category-codes-content";

export const metadata = articleMetadata(merchantCategoryCodesArticle);
export { MerchantCategoryCodesPage as default } from "@/features/company/blog/merchant-category-codes-page";

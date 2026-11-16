import { articleMetadata } from "@/features/company/blog/metadata";
import { merchantDiscountArticle } from "@/features/company/blog/merchant-discount-rate-content";

export const metadata = articleMetadata(merchantDiscountArticle);
export { MerchantDiscountPage as default } from "@/features/company/blog/merchant-discount-rate-page";

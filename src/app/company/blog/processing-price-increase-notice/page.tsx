import { articleMetadata } from "@/features/company/blog/metadata";
import { pricingNoticeArticle } from "@/features/company/blog/pricing-notice-content";

export const metadata = articleMetadata(pricingNoticeArticle);
export { PricingNoticePage as default } from "@/features/company/blog/pricing-notice-page";

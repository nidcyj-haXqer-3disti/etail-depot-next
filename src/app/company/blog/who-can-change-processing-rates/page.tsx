import { articleMetadata } from "@/features/company/blog/metadata";
import { pricingAuthorityArticle } from "@/features/company/blog/pricing-authority-content";

export const metadata = articleMetadata(pricingAuthorityArticle);
export { PricingAuthorityPage as default } from "@/features/company/blog/pricing-authority-page";

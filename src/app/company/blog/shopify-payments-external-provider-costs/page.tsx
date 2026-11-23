import { articleMetadata } from "@/features/company/blog/metadata";
import { shopifyProcessingCostArticle } from "@/features/company/blog/shopify-processing-cost-content";

export const metadata = articleMetadata(shopifyProcessingCostArticle);
export { ShopifyProcessingCostPage as default } from "@/features/company/blog/shopify-processing-cost-page";

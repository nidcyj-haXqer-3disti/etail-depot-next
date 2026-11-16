import { articleMetadata } from "@/features/company/blog/metadata";
import { pricingModelsArticle } from "@/features/company/blog/pricing-models-content";

export const metadata = articleMetadata(pricingModelsArticle);
export { PricingModelsPage as default } from "@/features/company/blog/pricing-models-page";

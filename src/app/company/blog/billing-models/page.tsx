import { articleMetadata } from "@/features/company/blog/metadata";
import { billingModelsArticle } from "@/features/company/blog/billing-models-content";

export const metadata = articleMetadata(billingModelsArticle);
export { BillingModelsPage as default } from "@/features/company/blog/billing-models-page";

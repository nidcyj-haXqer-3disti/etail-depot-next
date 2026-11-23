import { articleMetadata } from "@/features/company/blog/metadata";
import { sampleBillingArticle } from "@/features/company/blog/sample-billing-content";

export const metadata = articleMetadata(sampleBillingArticle);
export { SampleBillingPage as default } from "@/features/company/blog/sample-billing-page";

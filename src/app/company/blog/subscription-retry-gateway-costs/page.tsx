import { articleMetadata } from "@/features/company/blog/metadata";
import { retryBillingArticle } from "@/features/company/blog/retry-billing-content";

export const metadata = articleMetadata(retryBillingArticle);
export { RetryBillingPage as default } from "@/features/company/blog/retry-billing-page";

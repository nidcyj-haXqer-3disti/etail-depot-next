import { articleMetadata } from "@/features/company/blog/metadata";
import { platformBillingCostsArticle } from "@/features/company/blog/platform-billing-costs-content";

export const metadata = articleMetadata(platformBillingCostsArticle);
export { PlatformBillingCostsPage as default } from "@/features/company/blog/platform-billing-costs-page";

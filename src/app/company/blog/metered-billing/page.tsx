import { articleMetadata } from "@/features/company/blog/metadata";
import { meteredBillingArticle } from "@/features/company/blog/metered-billing-content";

export const metadata = articleMetadata(meteredBillingArticle);
export { MeteredBillingPage as default } from "@/features/company/blog/metered-billing-page";

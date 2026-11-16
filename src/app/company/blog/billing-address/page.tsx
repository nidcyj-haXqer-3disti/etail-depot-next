import { articleMetadata } from "@/features/company/blog/metadata";
import { billingAddressArticle } from "@/features/company/blog/billing-address-content";

export const metadata = articleMetadata(billingAddressArticle);
export { BillingAddressPage as default } from "@/features/company/blog/billing-address-page";

import { articleMetadata } from "@/features/company/blog/metadata";
import { checkoutAbandonmentArticle } from "@/features/company/blog/checkout-abandonment-content";

export const metadata = articleMetadata(checkoutAbandonmentArticle);
export { CheckoutAbandonmentPage as default } from "@/features/company/blog/checkout-abandonment-page";

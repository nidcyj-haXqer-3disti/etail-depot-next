import { articleMetadata } from "@/features/company/blog/metadata";
import { checkoutExpiryArticle } from "@/features/company/blog/checkout-expiry-content";

export const metadata = articleMetadata(checkoutExpiryArticle);
export { CheckoutExpiryPage as default } from "@/features/company/blog/checkout-expiry-page";

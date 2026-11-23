import { articleMetadata } from "@/features/company/blog/metadata";
import { checkoutEmailArticle } from "@/features/company/blog/checkout-email-content";

export const metadata = articleMetadata(checkoutEmailArticle);
export { CheckoutEmailPage as default } from "@/features/company/blog/checkout-email-page";

import { articleMetadata } from "@/features/company/blog/metadata";
import { checkoutLoginArticle } from "@/features/company/blog/checkout-login-content";

export const metadata = articleMetadata(checkoutLoginArticle);
export { CheckoutLoginPage as default } from "@/features/company/blog/checkout-login-page";

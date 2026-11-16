import { articleMetadata } from "@/features/company/blog/metadata";
import { paymentLinkArticle } from "@/features/company/blog/payment-link-content";

export const metadata = articleMetadata(paymentLinkArticle);
export { PaymentLinkPage as default } from "@/features/company/blog/payment-link-page";

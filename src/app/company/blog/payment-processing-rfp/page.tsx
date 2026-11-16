import { articleMetadata } from "@/features/company/blog/metadata";
import { paymentRfpArticle } from "@/features/company/blog/payment-rfp-content";

export const metadata = articleMetadata(paymentRfpArticle);
export { PaymentRfpPage as default } from "@/features/company/blog/payment-rfp-page";

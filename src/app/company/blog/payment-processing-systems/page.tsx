import { articleMetadata } from "@/features/company/blog/metadata";
import { paymentProcessingArticle } from "@/features/company/blog/payment-processing-content";

export const metadata = articleMetadata(paymentProcessingArticle);
export { PaymentProcessingPage as default } from "@/features/company/blog/payment-processing-page";

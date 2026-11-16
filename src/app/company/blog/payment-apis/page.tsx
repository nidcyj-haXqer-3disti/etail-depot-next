import { articleMetadata } from "@/features/company/blog/metadata";
import { paymentApiArticle } from "@/features/company/blog/payment-api-content";
export const metadata = articleMetadata(paymentApiArticle);
export { PaymentApiPage as default } from "@/features/company/blog/payment-api-page";

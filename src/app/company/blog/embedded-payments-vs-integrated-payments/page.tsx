import { articleMetadata } from "@/features/company/blog/metadata";
import { paymentIntegrationArticle } from "@/features/company/blog/payment-integration-content";

export const metadata = articleMetadata(paymentIntegrationArticle);
export { PaymentIntegrationPage as default } from "@/features/company/blog/payment-integration-page";

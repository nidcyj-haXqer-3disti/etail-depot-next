import { articleMetadata } from "@/features/company/blog/metadata";
import { paymentServiceProvidersArticle } from "@/features/company/blog/payment-service-providers-content";

export const metadata = articleMetadata(paymentServiceProvidersArticle);
export { PaymentServiceProvidersPage as default } from "@/features/company/blog/payment-service-providers-page";

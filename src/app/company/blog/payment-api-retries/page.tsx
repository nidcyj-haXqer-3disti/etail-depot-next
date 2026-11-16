import { articleMetadata } from "@/features/company/blog/metadata";
import { paymentRetriesArticle } from "@/features/company/blog/payment-retries-content";

export const metadata = articleMetadata(paymentRetriesArticle);
export { PaymentRetriesPage as default } from "@/features/company/blog/payment-retries-page";

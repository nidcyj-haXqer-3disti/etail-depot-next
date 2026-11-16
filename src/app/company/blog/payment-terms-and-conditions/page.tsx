import { articleMetadata } from "@/features/company/blog/metadata";
import { paymentTermsArticle } from "@/features/company/blog/payment-terms-content";

export const metadata = articleMetadata(paymentTermsArticle);
export { PaymentTermsPage as default } from "@/features/company/blog/payment-terms-page";

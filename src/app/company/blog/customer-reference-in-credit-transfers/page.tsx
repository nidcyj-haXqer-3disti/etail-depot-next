import { articleMetadata } from "@/features/company/blog/metadata";
import { paymentReferencesArticle } from "@/features/company/blog/payment-references-content";

export const metadata = articleMetadata(paymentReferencesArticle);
export { PaymentReferencesPage as default } from "@/features/company/blog/payment-references-page";

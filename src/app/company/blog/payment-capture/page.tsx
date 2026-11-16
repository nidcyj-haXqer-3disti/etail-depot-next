import { articleMetadata } from "@/features/company/blog/metadata";
import { paymentCaptureArticle } from "@/features/company/blog/payment-capture-content";

export const metadata = articleMetadata(paymentCaptureArticle);
export { PaymentCapturePage as default } from "@/features/company/blog/payment-capture-page";

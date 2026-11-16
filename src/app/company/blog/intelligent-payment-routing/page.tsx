import { articleMetadata } from "@/features/company/blog/metadata";
import { paymentRoutingArticle } from "@/features/company/blog/payment-routing-content";

export const metadata = articleMetadata(paymentRoutingArticle);
export { PaymentRoutingPage as default } from "@/features/company/blog/payment-routing-page";

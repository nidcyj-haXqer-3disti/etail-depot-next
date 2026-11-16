import { articleMetadata } from "@/features/company/blog/metadata";
import { paymentAnalyticsArticle } from "@/features/company/blog/payment-analytics-content";

export const metadata = articleMetadata(paymentAnalyticsArticle);
export { PaymentAnalyticsPage as default } from "@/features/company/blog/payment-analytics-page";

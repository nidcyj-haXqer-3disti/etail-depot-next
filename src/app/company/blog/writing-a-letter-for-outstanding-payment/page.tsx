import { articleMetadata } from "@/features/company/blog/metadata";
import { paymentReminderArticle } from "@/features/company/blog/payment-reminder-content";

export const metadata = articleMetadata(paymentReminderArticle);
export { PaymentReminderPage as default } from "@/features/company/blog/payment-reminder-page";

import { articleMetadata } from "@/features/company/blog/metadata";
import { invoiceCardPaymentArticle } from "@/features/company/blog/invoice-card-payment-content";

export const metadata = articleMetadata(invoiceCardPaymentArticle);
export { InvoiceCardPaymentPage as default } from "@/features/company/blog/invoice-card-payment-page";

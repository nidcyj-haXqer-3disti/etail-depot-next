import { articleMetadata } from "@/features/company/blog/metadata";
import { invoiceEmailArticle } from "@/features/company/blog/invoice-email-content";

export const metadata = articleMetadata(invoiceEmailArticle);
export { InvoiceEmailPage as default } from "@/features/company/blog/invoice-email-page";

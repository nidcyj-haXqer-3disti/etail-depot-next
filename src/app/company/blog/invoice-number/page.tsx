import { articleMetadata } from "@/features/company/blog/metadata";
import { invoiceNumberArticle } from "@/features/company/blog/invoice-number-content";

export const metadata = articleMetadata(invoiceNumberArticle);
export { InvoiceNumberPage as default } from "@/features/company/blog/invoice-number-page";

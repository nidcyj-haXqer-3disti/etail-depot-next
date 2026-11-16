import { articleMetadata } from "@/features/company/blog/metadata";
import { invoiceDiscrepanciesArticle } from "@/features/company/blog/invoice-discrepancies-content";

export const metadata = articleMetadata(invoiceDiscrepanciesArticle);
export { InvoiceDiscrepanciesPage as default } from "@/features/company/blog/invoice-discrepancies-page";

import { articleMetadata } from "@/features/company/blog/metadata";
import { invoiceReceiptArticle } from "@/features/company/blog/invoice-receipt-content";

export const metadata = articleMetadata(invoiceReceiptArticle);
export { InvoiceReceiptPage as default } from "@/features/company/blog/invoice-receipt-page";

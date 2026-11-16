import { articleMetadata } from "@/features/company/blog/metadata";
import { invoiceReconciliationArticle } from "@/features/company/blog/invoice-reconciliation-content";

export const metadata = articleMetadata(invoiceReconciliationArticle);
export { InvoiceReconciliationPage as default } from "@/features/company/blog/invoice-reconciliation-page";

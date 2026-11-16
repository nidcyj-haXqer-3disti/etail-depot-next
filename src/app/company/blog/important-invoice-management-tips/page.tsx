import { articleMetadata } from "@/features/company/blog/metadata";
import { invoiceManagementArticle } from "@/features/company/blog/invoice-management-content";

export const metadata = articleMetadata(invoiceManagementArticle);
export { InvoiceManagementPage as default } from "@/features/company/blog/invoice-management-page";

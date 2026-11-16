import { articleMetadata } from "@/features/company/blog/metadata";
import { createInvoiceArticle } from "@/features/company/blog/create-invoice-content";

export const metadata = articleMetadata(createInvoiceArticle);
export { CreateInvoicePage as default } from "@/features/company/blog/create-invoice-page";

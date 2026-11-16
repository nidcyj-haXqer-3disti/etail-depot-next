import { articleMetadata } from "@/features/company/blog/metadata";
import { estimateInvoiceArticle } from "@/features/company/blog/estimate-invoice-content";

export const metadata = articleMetadata(estimateInvoiceArticle);
export { EstimateInvoicePage as default } from "@/features/company/blog/estimate-invoice-page";

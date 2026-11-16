import { articleMetadata } from "@/features/company/blog/metadata";
import { contractInvoicesArticle } from "@/features/company/blog/contract-invoices-content";

export const metadata = articleMetadata(contractInvoicesArticle);
export { ContractInvoicesPage as default } from "@/features/company/blog/contract-invoices-page";

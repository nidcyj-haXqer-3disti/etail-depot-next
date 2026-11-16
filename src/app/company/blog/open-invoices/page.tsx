import { articleMetadata } from "@/features/company/blog/metadata";
import { openInvoicesArticle } from "@/features/company/blog/open-invoices-content";

export const metadata = articleMetadata(openInvoicesArticle);
export { OpenInvoicesPage as default } from "@/features/company/blog/open-invoices-page";

import { articleMetadata } from "@/features/company/blog/metadata";
import { recurringInvoicesArticle } from "@/features/company/blog/recurring-invoices-content";

export const metadata = articleMetadata(recurringInvoicesArticle);
export { RecurringInvoicesPage as default } from "@/features/company/blog/recurring-invoices-page";

import { articleMetadata } from "@/features/company/blog/metadata";
import { statementInvoiceArticle } from "@/features/company/blog/statement-invoice-content";

export const metadata = articleMetadata(statementInvoiceArticle);
export { StatementInvoicePage as default } from "@/features/company/blog/statement-invoice-page";

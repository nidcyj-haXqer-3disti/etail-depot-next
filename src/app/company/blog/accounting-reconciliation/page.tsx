import { articleMetadata } from "@/features/company/blog/metadata";
import { accountingReconciliationArticle } from "@/features/company/blog/accounting-reconciliation-content";

export const metadata = articleMetadata(accountingReconciliationArticle);
export { AccountingReconciliationPage as default } from "@/features/company/blog/accounting-reconciliation-page";

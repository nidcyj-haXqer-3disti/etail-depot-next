import { articleMetadata } from "@/features/company/blog/metadata";
import { bankReconciliationArticle } from "@/features/company/blog/bank-reconciliation-content";

export const metadata = articleMetadata(bankReconciliationArticle);
export { BankReconciliationPage as default } from "@/features/company/blog/bank-reconciliation-page";

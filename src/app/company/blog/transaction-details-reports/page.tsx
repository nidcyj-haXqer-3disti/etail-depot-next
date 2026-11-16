import { articleMetadata } from "@/features/company/blog/metadata";
import { transactionReportsArticle } from "@/features/company/blog/transaction-reports-content";

export const metadata = articleMetadata(transactionReportsArticle);
export { TransactionReportsPage as default } from "@/features/company/blog/transaction-reports-page";

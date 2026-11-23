import { articleMetadata } from "@/features/company/blog/metadata";
import { transactionMinimumArticle } from "@/features/company/blog/transaction-minimum-content";

export const metadata = articleMetadata(transactionMinimumArticle);
export { TransactionMinimumPage as default } from "@/features/company/blog/transaction-minimum-page";

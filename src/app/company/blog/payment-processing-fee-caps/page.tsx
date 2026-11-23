import { articleMetadata } from "@/features/company/blog/metadata";
import { transactionFeeCapsArticle } from "@/features/company/blog/transaction-fee-caps-content";

export const metadata = articleMetadata(transactionFeeCapsArticle);
export { TransactionFeeCapsPage as default } from "@/features/company/blog/transaction-fee-caps-page";

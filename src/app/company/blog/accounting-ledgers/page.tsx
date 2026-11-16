import { articleMetadata } from "@/features/company/blog/metadata";
import { accountingLedgersArticle } from "@/features/company/blog/accounting-ledgers-content";

export const metadata = articleMetadata(accountingLedgersArticle);
export { AccountingLedgersPage as default } from "@/features/company/blog/accounting-ledgers-page";

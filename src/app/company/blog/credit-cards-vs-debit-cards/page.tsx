import { articleMetadata } from "@/features/company/blog/metadata";
import { creditDebitArticle } from "@/features/company/blog/credit-debit-content";

export const metadata = articleMetadata(creditDebitArticle);
export { CreditDebitPage as default } from "@/features/company/blog/credit-debit-page";

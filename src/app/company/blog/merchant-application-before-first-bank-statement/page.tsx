import { articleMetadata } from "@/features/company/blog/metadata";
import { firstBankStatementArticle } from "@/features/company/blog/first-bank-statement-content";

export const metadata = articleMetadata(firstBankStatementArticle);
export { FirstBankStatementPage as default } from "@/features/company/blog/first-bank-statement-page";

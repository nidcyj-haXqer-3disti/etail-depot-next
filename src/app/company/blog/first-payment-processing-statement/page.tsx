import { articleMetadata } from "@/features/company/blog/metadata";
import { firstStatementArticle } from "@/features/company/blog/first-statement-content";

export const metadata = articleMetadata(firstStatementArticle);
export { FirstStatementPage as default } from "@/features/company/blog/first-statement-page";

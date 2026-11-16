import { articleMetadata } from "@/features/company/blog/metadata";
import { embeddedFinanceArticle } from "@/features/company/blog/embedded-finance-content";

export const metadata = articleMetadata(embeddedFinanceArticle);
export { EmbeddedFinancePage as default } from "@/features/company/blog/embedded-finance-page";

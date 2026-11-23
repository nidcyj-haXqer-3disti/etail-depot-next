import { articleMetadata } from "@/features/company/blog/metadata";
import { financialRefreshArticle } from "@/features/company/blog/financial-refresh-content";

export const metadata = articleMetadata(financialRefreshArticle);
export { FinancialRefreshPage as default } from "@/features/company/blog/financial-refresh-page";

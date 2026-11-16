import { articleMetadata } from "@/features/company/blog/metadata";
import { highRiskAccountsArticle } from "@/features/company/blog/high-risk-accounts-content";
export const metadata = articleMetadata(highRiskAccountsArticle);
export { HighRiskAccountsPage as default } from "@/features/company/blog/high-risk-accounts-page";

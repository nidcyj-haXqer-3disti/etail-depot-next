import { articleMetadata } from "@/features/company/blog/metadata";
import { riskQuestionsArticle } from "@/features/company/blog/risk-questions-content";

export const metadata = articleMetadata(riskQuestionsArticle);
export { RiskQuestionsPage as default } from "@/features/company/blog/risk-questions-page";

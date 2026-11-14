import { articleMetadata } from "@/features/company/blog/metadata";
import { riskCommunicationArticle } from "@/features/company/blog/content";

export const metadata = articleMetadata(riskCommunicationArticle);
export { RiskCommunicationPage as default } from "@/features/company/blog/risk-communication-page";

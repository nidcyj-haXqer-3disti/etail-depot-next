import { articleMetadata } from "@/features/company/blog/metadata";
import { applicationCorrectionArticle } from "@/features/company/blog/application-correction-content";

export const metadata = articleMetadata(applicationCorrectionArticle);
export { ApplicationCorrectionPage as default } from "@/features/company/blog/application-correction-page";

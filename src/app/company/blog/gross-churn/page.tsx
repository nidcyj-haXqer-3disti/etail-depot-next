import { articleMetadata } from "@/features/company/blog/metadata";
import { grossChurnArticle } from "@/features/company/blog/gross-churn-content";

export const metadata = articleMetadata(grossChurnArticle);
export { GrossChurnPage as default } from "@/features/company/blog/gross-churn-page";

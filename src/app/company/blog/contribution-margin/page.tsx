import { articleMetadata } from "@/features/company/blog/metadata";
import { contributionMarginArticle } from "@/features/company/blog/contribution-margin-content";

export const metadata = articleMetadata(contributionMarginArticle);
export { ContributionMarginPage as default } from "@/features/company/blog/contribution-margin-page";

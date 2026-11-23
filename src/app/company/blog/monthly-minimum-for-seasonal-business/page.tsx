import { articleMetadata } from "@/features/company/blog/metadata";
import { seasonalMinimumArticle } from "@/features/company/blog/seasonal-minimum-content";

export const metadata = articleMetadata(seasonalMinimumArticle);
export { SeasonalMinimumPage as default } from "@/features/company/blog/seasonal-minimum-page";

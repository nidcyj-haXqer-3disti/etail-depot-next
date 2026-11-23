import { articleMetadata } from "@/features/company/blog/metadata";
import { seasonalCapacityArticle } from "@/features/company/blog/seasonal-capacity-content";

export const metadata = articleMetadata(seasonalCapacityArticle);
export { SeasonalCapacityPage as default } from "@/features/company/blog/seasonal-capacity-page";

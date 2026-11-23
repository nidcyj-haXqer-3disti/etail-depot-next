import { articleMetadata } from "@/features/company/blog/metadata";
import { costPeriodArticle } from "@/features/company/blog/cost-period-content";

export const metadata = articleMetadata(costPeriodArticle);
export { CostPeriodPage as default } from "@/features/company/blog/cost-period-page";

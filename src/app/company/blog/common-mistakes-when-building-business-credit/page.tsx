import { articleMetadata } from "@/features/company/blog/metadata";
import { buildingBusinessCreditArticle } from "@/features/company/blog/building-business-credit-content";

export const metadata = articleMetadata(buildingBusinessCreditArticle);
export { BuildingBusinessCreditPage as default } from "@/features/company/blog/building-business-credit-page";

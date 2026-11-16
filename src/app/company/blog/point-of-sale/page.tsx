import { articleMetadata } from "@/features/company/blog/metadata";
import { pointOfSaleArticle } from "@/features/company/blog/point-of-sale-content";

export const metadata = articleMetadata(pointOfSaleArticle);
export { PointOfSalePage as default } from "@/features/company/blog/point-of-sale-page";

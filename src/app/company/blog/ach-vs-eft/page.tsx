import { articleMetadata } from "@/features/company/blog/metadata";
import { achEftArticle } from "@/features/company/blog/ach-eft-content";

export const metadata = articleMetadata(achEftArticle);
export { AchEftPage as default } from "@/features/company/blog/ach-eft-page";

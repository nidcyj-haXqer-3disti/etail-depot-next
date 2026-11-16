import { articleMetadata } from "@/features/company/blog/metadata";
import { achFailuresArticle } from "@/features/company/blog/ach-failures-content";

export const metadata = articleMetadata(achFailuresArticle);
export { AchFailuresPage as default } from "@/features/company/blog/ach-failures-page";

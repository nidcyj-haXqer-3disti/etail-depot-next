import { articleMetadata } from "@/features/company/blog/metadata";
import { instantAchArticle } from "@/features/company/blog/instant-ach-content";

export const metadata = articleMetadata(instantAchArticle);
export { InstantAchPage as default } from "@/features/company/blog/instant-ach-page";

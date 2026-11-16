import { articleMetadata } from "@/features/company/blog/metadata";
import { cardAchArticle } from "@/features/company/blog/card-ach-content";

export const metadata = articleMetadata(cardAchArticle);
export { CardAchPage as default } from "@/features/company/blog/card-ach-page";

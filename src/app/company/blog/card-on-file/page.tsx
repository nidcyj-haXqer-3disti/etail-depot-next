import { articleMetadata } from "@/features/company/blog/metadata";
import { cardOnFileArticle } from "@/features/company/blog/card-on-file-content";

export const metadata = articleMetadata(cardOnFileArticle);
export { CardOnFilePage as default } from "@/features/company/blog/card-on-file-page";

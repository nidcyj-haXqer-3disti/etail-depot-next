import { articleMetadata } from "@/features/company/blog/metadata";
import { cardChoiceArticle } from "@/features/company/blog/card-choice-content";

export const metadata = articleMetadata(cardChoiceArticle);
export { CardChoicePage as default } from "@/features/company/blog/card-choice-page";

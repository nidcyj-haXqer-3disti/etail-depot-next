import { articleMetadata } from "@/features/company/blog/metadata";
import { cardDeclinesArticle } from "@/features/company/blog/card-declines-content";

export const metadata = articleMetadata(cardDeclinesArticle);
export { CardDeclinesPage as default } from "@/features/company/blog/card-declines-page";

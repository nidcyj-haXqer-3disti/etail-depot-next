import { articleMetadata } from "@/features/company/blog/metadata";
import { singleUseCardsArticle } from "@/features/company/blog/single-use-cards-content";

export const metadata = articleMetadata(singleUseCardsArticle);
export { SingleUseCardsPage as default } from "@/features/company/blog/single-use-cards-page";

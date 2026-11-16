import { articleMetadata } from "@/features/company/blog/metadata";
import { expiredCardsArticle } from "@/features/company/blog/expired-cards-content";

export const metadata = articleMetadata(expiredCardsArticle);
export { ExpiredCardsPage as default } from "@/features/company/blog/expired-cards-page";

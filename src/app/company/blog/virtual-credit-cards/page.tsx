import { articleMetadata } from "@/features/company/blog/metadata";
import { virtualCardsArticle } from "@/features/company/blog/virtual-cards-content";

export const metadata = articleMetadata(virtualCardsArticle);
export { VirtualCardsPage as default } from "@/features/company/blog/virtual-cards-page";

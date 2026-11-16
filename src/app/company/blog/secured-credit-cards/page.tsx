import { articleMetadata } from "@/features/company/blog/metadata";
import { securedCardsArticle } from "@/features/company/blog/secured-cards-content";

export const metadata = articleMetadata(securedCardsArticle);
export { SecuredCardsPage as default } from "@/features/company/blog/secured-cards-page";

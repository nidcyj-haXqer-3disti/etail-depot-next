import { articleMetadata } from "@/features/company/blog/metadata";
import { sharedCompanyCardsArticle } from "@/features/company/blog/shared-company-cards-content";

export const metadata = articleMetadata(sharedCompanyCardsArticle);
export { SharedCompanyCardsPage as default } from "@/features/company/blog/shared-company-cards-page";

import { articleMetadata } from "@/features/company/blog/metadata";
import { cardAuthorizationArticle } from "@/features/company/blog/card-authorization-content";

export const metadata = articleMetadata(cardAuthorizationArticle);
export { CardAuthorizationPage as default } from "@/features/company/blog/card-authorization-page";

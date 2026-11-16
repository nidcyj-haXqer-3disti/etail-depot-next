import { articleMetadata } from "@/features/company/blog/metadata";
import { cardVerificationArticle } from "@/features/company/blog/card-verification-content";

export const metadata = articleMetadata(cardVerificationArticle);
export { CardVerificationPage as default } from "@/features/company/blog/card-verification-page";

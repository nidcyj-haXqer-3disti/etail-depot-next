import { articleMetadata } from "@/features/company/blog/metadata";
import { returnHeavyQuotesArticle } from "@/features/company/blog/return-heavy-quotes-content";

export const metadata = articleMetadata(returnHeavyQuotesArticle);
export { ReturnHeavyQuotesPage as default } from "@/features/company/blog/return-heavy-quotes-page";

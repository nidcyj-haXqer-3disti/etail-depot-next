import { articleMetadata } from "@/features/company/blog/metadata";
import { quoteCardMixArticle } from "@/features/company/blog/quote-card-mix-content";

export const metadata = articleMetadata(quoteCardMixArticle);
export { QuoteCardMixPage as default } from "@/features/company/blog/quote-card-mix-page";

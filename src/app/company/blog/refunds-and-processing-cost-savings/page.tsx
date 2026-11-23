import { articleMetadata } from "@/features/company/blog/metadata";
import { quoteRefundsArticle } from "@/features/company/blog/quote-refunds-content";

export const metadata = articleMetadata(quoteRefundsArticle);
export { QuoteRefundsPage as default } from "@/features/company/blog/quote-refunds-page";

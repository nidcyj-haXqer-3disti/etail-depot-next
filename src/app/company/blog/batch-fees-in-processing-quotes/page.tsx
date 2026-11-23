import { articleMetadata } from "@/features/company/blog/metadata";
import { batchFeeQuotesArticle } from "@/features/company/blog/batch-fee-quotes-content";

export const metadata = articleMetadata(batchFeeQuotesArticle);
export { BatchFeeQuotesPage as default } from "@/features/company/blog/batch-fee-quotes-page";

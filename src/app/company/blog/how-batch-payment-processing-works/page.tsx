import { articleMetadata } from "@/features/company/blog/metadata";
import { batchProcessingArticle } from "@/features/company/blog/batch-processing-content";

export const metadata = articleMetadata(batchProcessingArticle);
export { BatchProcessingPage as default } from "@/features/company/blog/batch-processing-page";

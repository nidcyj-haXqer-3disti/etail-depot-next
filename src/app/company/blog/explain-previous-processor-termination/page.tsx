import { articleMetadata } from "@/features/company/blog/metadata";
import { previousProcessorArticle } from "@/features/company/blog/previous-processor-content";

export const metadata = articleMetadata(previousProcessorArticle);
export { PreviousProcessorPage as default } from "@/features/company/blog/previous-processor-page";

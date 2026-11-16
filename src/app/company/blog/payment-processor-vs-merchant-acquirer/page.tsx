import { articleMetadata } from "@/features/company/blog/metadata";
import { processorAcquirerArticle } from "@/features/company/blog/processor-acquirer-content";

export const metadata = articleMetadata(processorAcquirerArticle);
export { ProcessorAcquirerPage as default } from "@/features/company/blog/processor-acquirer-page";

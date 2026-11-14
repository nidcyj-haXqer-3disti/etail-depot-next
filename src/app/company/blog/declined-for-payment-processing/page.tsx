import { articleMetadata } from "@/features/company/blog/metadata";
import { declinedProcessingArticle } from "@/features/company/blog/content";

export const metadata = articleMetadata(declinedProcessingArticle);
export { DeclinedProcessingPage as default } from "@/features/company/blog/declined-processing-page";

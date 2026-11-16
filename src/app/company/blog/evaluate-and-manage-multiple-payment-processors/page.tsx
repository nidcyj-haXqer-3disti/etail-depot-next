import { articleMetadata } from "@/features/company/blog/metadata";
import { multipleProcessorsArticle } from "@/features/company/blog/multiple-processors-content";

export const metadata = articleMetadata(multipleProcessorsArticle);
export { MultipleProcessorsPage as default } from "@/features/company/blog/multiple-processors-page";

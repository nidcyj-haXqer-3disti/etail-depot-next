import { articleMetadata } from "@/features/company/blog/metadata";
import { processorsIsosArticle } from "@/features/company/blog/processors-isos-content";

export const metadata = articleMetadata(processorsIsosArticle);
export { ProcessorsIsosPage as default } from "@/features/company/blog/processors-isos-page";

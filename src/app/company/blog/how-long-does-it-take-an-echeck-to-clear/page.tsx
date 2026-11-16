import { articleMetadata } from "@/features/company/blog/metadata";
import { echeckClearingArticle } from "@/features/company/blog/echeck-clearing-content";

export const metadata = articleMetadata(echeckClearingArticle);
export { EcheckClearingPage as default } from "@/features/company/blog/echeck-clearing-page";

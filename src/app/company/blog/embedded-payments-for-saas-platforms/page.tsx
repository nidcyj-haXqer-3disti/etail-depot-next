import { articleMetadata } from "@/features/company/blog/metadata";
import { saasEmbeddedArticle } from "@/features/company/blog/saas-embedded-content";

export const metadata = articleMetadata(saasEmbeddedArticle);
export { SaasEmbeddedPage as default } from "@/features/company/blog/saas-embedded-page";

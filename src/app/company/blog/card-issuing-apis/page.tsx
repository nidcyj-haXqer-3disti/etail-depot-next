import { articleMetadata } from "@/features/company/blog/metadata";
import { issuingApisArticle } from "@/features/company/blog/issuing-apis-content";

export const metadata = articleMetadata(issuingApisArticle);
export { IssuingApisPage as default } from "@/features/company/blog/issuing-apis-page";

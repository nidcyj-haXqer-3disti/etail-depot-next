import { articleMetadata } from "@/features/company/blog/metadata";
import { licenseScopeArticle } from "@/features/company/blog/license-scope-content";

export const metadata = articleMetadata(licenseScopeArticle);
export { LicenseScopePage as default } from "@/features/company/blog/license-scope-page";

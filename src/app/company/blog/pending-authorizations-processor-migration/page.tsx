import { articleMetadata } from "@/features/company/blog/metadata";
import { unfinishedAuthorizationsArticle } from "@/features/company/blog/unfinished-authorizations-content";

export const metadata = articleMetadata(unfinishedAuthorizationsArticle);
export { UnfinishedAuthorizationsPage as default } from "@/features/company/blog/unfinished-authorizations-page";

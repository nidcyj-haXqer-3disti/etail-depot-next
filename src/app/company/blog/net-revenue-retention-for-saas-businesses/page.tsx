import { articleMetadata } from "@/features/company/blog/metadata";
import { netRetentionArticle } from "@/features/company/blog/net-retention-content";

export const metadata = articleMetadata(netRetentionArticle);
export { NetRetentionPage as default } from "@/features/company/blog/net-retention-page";

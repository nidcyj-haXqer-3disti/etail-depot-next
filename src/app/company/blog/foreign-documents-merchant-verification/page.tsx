import { articleMetadata } from "@/features/company/blog/metadata";
import { foreignRecordsArticle } from "@/features/company/blog/foreign-records-content";

export const metadata = articleMetadata(foreignRecordsArticle);
export { ForeignRecordsPage as default } from "@/features/company/blog/foreign-records-page";

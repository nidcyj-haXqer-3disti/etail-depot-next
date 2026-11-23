import { articleMetadata } from "@/features/company/blog/metadata";
import { reorganizationRecordsArticle } from "@/features/company/blog/reorganization-records-content";

export const metadata = articleMetadata(reorganizationRecordsArticle);
export { ReorganizationRecordsPage as default } from "@/features/company/blog/reorganization-records-page";

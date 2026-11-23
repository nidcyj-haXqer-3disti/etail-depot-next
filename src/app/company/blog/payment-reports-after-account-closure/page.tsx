import { articleMetadata } from "@/features/company/blog/metadata";
import { postContractRecordsArticle } from "@/features/company/blog/post-contract-records-content";

export const metadata = articleMetadata(postContractRecordsArticle);
export { PostContractRecordsPage as default } from "@/features/company/blog/post-contract-records-page";

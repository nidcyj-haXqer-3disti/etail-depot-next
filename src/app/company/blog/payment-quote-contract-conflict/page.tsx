import { articleMetadata } from "@/features/company/blog/metadata";
import { contractPriorityArticle } from "@/features/company/blog/contract-priority-content";

export const metadata = articleMetadata(contractPriorityArticle);
export { ContractPriorityPage as default } from "@/features/company/blog/contract-priority-page";

import { articleMetadata } from "@/features/company/blog/metadata";
import { contractAssignmentArticle } from "@/features/company/blog/contract-assignment-content";

export const metadata = articleMetadata(contractAssignmentArticle);
export { ContractAssignmentPage as default } from "@/features/company/blog/contract-assignment-page";

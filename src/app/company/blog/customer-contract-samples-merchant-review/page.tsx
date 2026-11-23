import { articleMetadata } from "@/features/company/blog/metadata";
import { contractEvidenceArticle } from "@/features/company/blog/contract-evidence-content";

export const metadata = articleMetadata(contractEvidenceArticle);
export { ContractEvidencePage as default } from "@/features/company/blog/contract-evidence-page";

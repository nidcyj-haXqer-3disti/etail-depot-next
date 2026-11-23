import { articleMetadata } from "@/features/company/blog/metadata";
import { ownershipEvidenceArticle } from "@/features/company/blog/ownership-evidence-content";

export const metadata = articleMetadata(ownershipEvidenceArticle);
export { OwnershipEvidencePage as default } from "@/features/company/blog/ownership-evidence-page";

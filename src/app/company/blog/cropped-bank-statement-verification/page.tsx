import { articleMetadata } from "@/features/company/blog/metadata";
import { completeBankEvidenceArticle } from "@/features/company/blog/complete-bank-evidence-content";

export const metadata = articleMetadata(completeBankEvidenceArticle);
export { CompleteBankEvidencePage as default } from "@/features/company/blog/complete-bank-evidence-page";

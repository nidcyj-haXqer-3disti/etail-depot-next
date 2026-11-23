import { articleMetadata } from "@/features/company/blog/metadata";
import { supplyEvidenceArticle } from "@/features/company/blog/supply-evidence-content";

export const metadata = articleMetadata(supplyEvidenceArticle);
export { SupplyEvidencePage as default } from "@/features/company/blog/supply-evidence-page";

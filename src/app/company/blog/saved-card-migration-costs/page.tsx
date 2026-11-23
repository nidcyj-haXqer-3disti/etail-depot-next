import { articleMetadata } from "@/features/company/blog/metadata";
import { transferProjectCostArticle } from "@/features/company/blog/transfer-project-cost-content";

export const metadata = articleMetadata(transferProjectCostArticle);
export { TransferProjectCostPage as default } from "@/features/company/blog/transfer-project-cost-page";

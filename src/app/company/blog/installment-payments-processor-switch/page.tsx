import { articleMetadata } from "@/features/company/blog/metadata";
import { installmentContinuityArticle } from "@/features/company/blog/installment-continuity-content";

export const metadata = articleMetadata(installmentContinuityArticle);
export { InstallmentContinuityPage as default } from "@/features/company/blog/installment-continuity-page";

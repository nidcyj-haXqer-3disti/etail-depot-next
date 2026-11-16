import { articleMetadata } from "@/features/company/blog/metadata";
import { accruedPayableArticle } from "@/features/company/blog/accrued-payable-content";

export const metadata = articleMetadata(accruedPayableArticle);
export { AccruedPayablePage as default } from "@/features/company/blog/accrued-payable-page";

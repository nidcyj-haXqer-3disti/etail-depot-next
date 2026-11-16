import { articleMetadata } from "@/features/company/blog/metadata";
import { erpPaymentsArticle } from "@/features/company/blog/erp-payments-content";

export const metadata = articleMetadata(erpPaymentsArticle);
export { ErpPaymentsPage as default } from "@/features/company/blog/erp-payments-page";

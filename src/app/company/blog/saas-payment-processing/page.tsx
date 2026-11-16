import { articleMetadata } from "@/features/company/blog/metadata";
import { saasPaymentsArticle } from "@/features/company/blog/saas-payments-content";

export const metadata = articleMetadata(saasPaymentsArticle);
export { SaasPaymentsPage as default } from "@/features/company/blog/saas-payments-page";

import { articleMetadata } from "@/features/company/blog/metadata";
import { crmPaymentsArticle } from "@/features/company/blog/crm-payments-content";

export const metadata = articleMetadata(crmPaymentsArticle);
export { CrmPaymentsPage as default } from "@/features/company/blog/crm-payments-page";

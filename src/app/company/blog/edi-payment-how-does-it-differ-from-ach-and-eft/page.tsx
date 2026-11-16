import { articleMetadata } from "@/features/company/blog/metadata";
import { ediPaymentsArticle } from "@/features/company/blog/edi-payments-content";

export const metadata = articleMetadata(ediPaymentsArticle);
export { EdiPaymentsPage as default } from "@/features/company/blog/edi-payments-page";

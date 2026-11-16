import { articleMetadata } from "@/features/company/blog/metadata";
import { isvPaymentsArticle } from "@/features/company/blog/isv-payments-content";

export const metadata = articleMetadata(isvPaymentsArticle);
export { IsvPaymentsPage as default } from "@/features/company/blog/isv-payments-page";

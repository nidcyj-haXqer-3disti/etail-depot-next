import { articleMetadata } from "@/features/company/blog/metadata";
import { achPaymentsArticle } from "@/features/company/blog/ach-payments-content";

export const metadata = articleMetadata(achPaymentsArticle);
export { AchPaymentsPage as default } from "@/features/company/blog/ach-payments-page";

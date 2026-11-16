import { articleMetadata } from "@/features/company/blog/metadata";
import { achCreditArticle } from "@/features/company/blog/ach-credit-content";

export const metadata = articleMetadata(achCreditArticle);
export { AchCreditPage as default } from "@/features/company/blog/ach-credit-page";

import { articleMetadata } from "@/features/company/blog/metadata";
import { achDebitArticle } from "@/features/company/blog/ach-debit-content";

export const metadata = articleMetadata(achDebitArticle);
export { AchDebitPage as default } from "@/features/company/blog/ach-debit-page";

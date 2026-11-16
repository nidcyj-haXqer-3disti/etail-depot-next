import { articleMetadata } from "@/features/company/blog/metadata";
import { recurringAchArticle } from "@/features/company/blog/recurring-ach-content";

export const metadata = articleMetadata(recurringAchArticle);
export { RecurringAchPage as default } from "@/features/company/blog/recurring-ach-page";

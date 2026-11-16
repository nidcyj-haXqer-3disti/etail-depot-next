import { articleMetadata } from "@/features/company/blog/metadata";
import { personalBusinessExpensesArticle } from "@/features/company/blog/personal-business-expenses-content";

export const metadata = articleMetadata(personalBusinessExpensesArticle);
export { PersonalBusinessExpensesPage as default } from "@/features/company/blog/personal-business-expenses-page";

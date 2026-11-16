import { articleMetadata } from "@/features/company/blog/metadata";
import { cogsExpensesArticle } from "@/features/company/blog/cogs-expenses-content";

export const metadata = articleMetadata(cogsExpensesArticle);
export { CogsExpensesPage as default } from "@/features/company/blog/cogs-expenses-page";

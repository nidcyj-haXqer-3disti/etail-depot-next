import { articleMetadata } from "@/features/company/blog/metadata";
import { expenseReceiptsArticle } from "@/features/company/blog/expense-receipts-content";

export const metadata = articleMetadata(expenseReceiptsArticle);
export { ExpenseReceiptsPage as default } from "@/features/company/blog/expense-receipts-page";

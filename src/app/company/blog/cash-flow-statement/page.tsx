import { articleMetadata } from "@/features/company/blog/metadata";
import { cashFlowStatementArticle } from "@/features/company/blog/cash-flow-statement-content";

export const metadata = articleMetadata(cashFlowStatementArticle);
export { CashFlowStatementPage as default } from "@/features/company/blog/cash-flow-statement-page";

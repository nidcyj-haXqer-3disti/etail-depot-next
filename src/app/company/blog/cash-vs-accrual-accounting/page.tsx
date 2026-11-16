import { articleMetadata } from "@/features/company/blog/metadata";
import { cashAccrualArticle } from "@/features/company/blog/cash-accrual-content";

export const metadata = articleMetadata(cashAccrualArticle);
export { CashAccrualPage as default } from "@/features/company/blog/cash-accrual-page";

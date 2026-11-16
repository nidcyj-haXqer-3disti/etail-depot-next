import { articleMetadata } from "@/features/company/blog/metadata";
import { monthlyRecurringRevenueArticle } from "@/features/company/blog/monthly-recurring-revenue-content";

export const metadata = articleMetadata(monthlyRecurringRevenueArticle);
export { MonthlyRecurringRevenuePage as default } from "@/features/company/blog/monthly-recurring-revenue-page";

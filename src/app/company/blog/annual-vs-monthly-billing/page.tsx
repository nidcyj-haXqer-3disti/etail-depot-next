import { articleMetadata } from "@/features/company/blog/metadata";
import { annualMonthlyBillingArticle } from "@/features/company/blog/annual-monthly-billing-content";

export const metadata = articleMetadata(annualMonthlyBillingArticle);
export { AnnualMonthlyBillingPage as default } from "@/features/company/blog/annual-monthly-billing-page";

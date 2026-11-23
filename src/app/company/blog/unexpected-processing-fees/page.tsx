import { articleMetadata } from "@/features/company/blog/metadata";
import { billingQuestionsArticle } from "@/features/company/blog/billing-questions-content";

export const metadata = articleMetadata(billingQuestionsArticle);
export { BillingQuestionsPage as default } from "@/features/company/blog/billing-questions-page";

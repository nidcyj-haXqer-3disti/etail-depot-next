import { articleMetadata } from "@/features/company/blog/metadata";
import { recurringSubscriptionArticle } from "@/features/company/blog/recurring-subscription-content";

export const metadata = articleMetadata(recurringSubscriptionArticle);
export { RecurringSubscriptionPage as default } from "@/features/company/blog/recurring-subscription-page";

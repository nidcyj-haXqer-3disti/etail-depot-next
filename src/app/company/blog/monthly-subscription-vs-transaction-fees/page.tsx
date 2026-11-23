import { articleMetadata } from "@/features/company/blog/metadata";
import { subscriptionTransactionCostsArticle } from "@/features/company/blog/subscription-transaction-costs-content";

export const metadata = articleMetadata(subscriptionTransactionCostsArticle);
export { SubscriptionTransactionCostsPage as default } from "@/features/company/blog/subscription-transaction-costs-page";

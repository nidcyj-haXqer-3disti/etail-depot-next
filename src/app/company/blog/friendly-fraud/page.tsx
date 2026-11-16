import { articleMetadata } from "@/features/company/blog/metadata";
import { friendlyFraudArticle } from "@/features/company/blog/friendly-fraud-content";
export const metadata = articleMetadata(friendlyFraudArticle);
export { FriendlyFraudPage as default } from "@/features/company/blog/friendly-fraud-page";

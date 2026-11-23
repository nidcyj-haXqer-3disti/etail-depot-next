import { articleMetadata } from "@/features/company/blog/metadata";
import { failedAttemptCostsArticle } from "@/features/company/blog/failed-attempt-costs-content";

export const metadata = articleMetadata(failedAttemptCostsArticle);
export { FailedAttemptCostsPage as default } from "@/features/company/blog/failed-attempt-costs-page";

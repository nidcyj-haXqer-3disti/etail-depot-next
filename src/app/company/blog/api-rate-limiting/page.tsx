import { articleMetadata } from "@/features/company/blog/metadata";
import { apiRateLimitsArticle } from "@/features/company/blog/api-rate-limits-content";
export const metadata = articleMetadata(apiRateLimitsArticle);
export { ApiRateLimitsPage as default } from "@/features/company/blog/api-rate-limits-page";

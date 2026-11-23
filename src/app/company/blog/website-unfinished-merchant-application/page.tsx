import { articleMetadata } from "@/features/company/blog/metadata";
import { prelaunchReviewArticle } from "@/features/company/blog/prelaunch-review-content";

export const metadata = articleMetadata(prelaunchReviewArticle);
export { PrelaunchReviewPage as default } from "@/features/company/blog/prelaunch-review-page";

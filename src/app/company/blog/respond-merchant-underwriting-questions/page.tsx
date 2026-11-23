import { articleMetadata } from "@/features/company/blog/metadata";
import { reviewResponseArticle } from "@/features/company/blog/review-response-content";

export const metadata = articleMetadata(reviewResponseArticle);
export { ReviewResponsePage as default } from "@/features/company/blog/review-response-page";

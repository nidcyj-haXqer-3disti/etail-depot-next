import { articleMetadata } from "@/features/company/blog/metadata";
import { privateStoreReviewArticle } from "@/features/company/blog/private-store-review-content";

export const metadata = articleMetadata(privateStoreReviewArticle);
export { PrivateStoreReviewPage as default } from "@/features/company/blog/private-store-review-page";

import { articleMetadata } from "@/features/company/blog/metadata";
import { missingVerificationArticle } from "@/features/company/blog/missing-verification-content";

export const metadata = articleMetadata(missingVerificationArticle);
export { MissingVerificationPage as default } from "@/features/company/blog/missing-verification-page";

import { articleMetadata } from "@/features/company/blog/metadata";
import { achVerificationArticle } from "@/features/company/blog/ach-verification-content";

export const metadata = articleMetadata(achVerificationArticle);
export { AchVerificationPage as default } from "@/features/company/blog/ach-verification-page";

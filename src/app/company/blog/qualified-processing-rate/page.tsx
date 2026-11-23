import { articleMetadata } from "@/features/company/blog/metadata";
import { qualifiedRateArticle } from "@/features/company/blog/qualified-rate-content";

export const metadata = articleMetadata(qualifiedRateArticle);
export { QualifiedRatePage as default } from "@/features/company/blog/qualified-rate-page";

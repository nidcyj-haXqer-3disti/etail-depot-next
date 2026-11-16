import { articleMetadata } from "@/features/company/blog/metadata";
import { businessCardCountArticle } from "@/features/company/blog/business-card-count-content";

export const metadata = articleMetadata(businessCardCountArticle);
export { BusinessCardCountPage as default } from "@/features/company/blog/business-card-count-page";

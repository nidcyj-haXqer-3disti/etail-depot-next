import { articleMetadata } from "@/features/company/blog/metadata";
import { applicationRepresentativeArticle } from "@/features/company/blog/application-representative-content";

export const metadata = articleMetadata(applicationRepresentativeArticle);
export { ApplicationRepresentativePage as default } from "@/features/company/blog/application-representative-page";

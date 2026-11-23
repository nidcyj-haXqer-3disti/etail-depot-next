import { articleMetadata } from "@/features/company/blog/metadata";
import { einAssignmentArticle } from "@/features/company/blog/ein-assignment-content";

export const metadata = articleMetadata(einAssignmentArticle);
export { EinAssignmentPage as default } from "@/features/company/blog/ein-assignment-page";

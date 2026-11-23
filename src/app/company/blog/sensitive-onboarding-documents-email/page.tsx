import { articleMetadata } from "@/features/company/blog/metadata";
import { privateApplicationFilesArticle } from "@/features/company/blog/private-application-files-content";

export const metadata = articleMetadata(privateApplicationFilesArticle);
export { PrivateApplicationFilesPage as default } from "@/features/company/blog/private-application-files-page";

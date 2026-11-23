import { articleMetadata } from "@/features/company/blog/metadata";
import { supportCoverageArticle } from "@/features/company/blog/support-coverage-content";

export const metadata = articleMetadata(supportCoverageArticle);
export { SupportCoveragePage as default } from "@/features/company/blog/support-coverage-page";

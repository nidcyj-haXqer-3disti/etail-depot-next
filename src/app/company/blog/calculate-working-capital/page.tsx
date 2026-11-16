import { articleMetadata } from "@/features/company/blog/metadata";
import { workingCapitalArticle } from "@/features/company/blog/working-capital-content";

export const metadata = articleMetadata(workingCapitalArticle);
export { WorkingCapitalPage as default } from "@/features/company/blog/working-capital-page";

import { articleMetadata } from "@/features/company/blog/metadata";
import { fixedVariableArticle } from "@/features/company/blog/fixed-variable-content";

export const metadata = articleMetadata(fixedVariableArticle);
export { FixedVariablePage as default } from "@/features/company/blog/fixed-variable-page";

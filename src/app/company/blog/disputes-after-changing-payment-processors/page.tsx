import { articleMetadata } from "@/features/company/blog/metadata";
import { legacyDisputesArticle } from "@/features/company/blog/legacy-disputes-content";

export const metadata = articleMetadata(legacyDisputesArticle);
export { LegacyDisputesPage as default } from "@/features/company/blog/legacy-disputes-page";

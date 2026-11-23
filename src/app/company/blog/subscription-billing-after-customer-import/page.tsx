import { articleMetadata } from "@/features/company/blog/metadata";
import { renewalImportArticle } from "@/features/company/blog/renewal-import-content";

export const metadata = articleMetadata(renewalImportArticle);
export { RenewalImportPage as default } from "@/features/company/blog/renewal-import-page";

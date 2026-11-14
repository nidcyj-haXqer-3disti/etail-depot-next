import { articleMetadata } from "@/features/company/blog/metadata";
import { payfacOperationsArticle } from "@/features/company/blog/content";

export const metadata = articleMetadata(payfacOperationsArticle);
export { PayfacOperationsPage as default } from "@/features/company/blog/payfac-operations-page";

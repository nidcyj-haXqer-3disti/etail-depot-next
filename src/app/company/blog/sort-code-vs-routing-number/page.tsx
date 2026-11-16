import { articleMetadata } from "@/features/company/blog/metadata";
import { sortCodeRoutingArticle } from "@/features/company/blog/sort-code-routing-content";

export const metadata = articleMetadata(sortCodeRoutingArticle);
export { SortCodeRoutingPage as default } from "@/features/company/blog/sort-code-routing-page";

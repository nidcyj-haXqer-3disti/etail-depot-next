import { articleMetadata } from "@/features/company/blog/metadata";
import { multivendorArticle } from "@/features/company/blog/multivendor-content";

export const metadata = articleMetadata(multivendorArticle);
export { MultivendorPage as default } from "@/features/company/blog/multivendor-page";

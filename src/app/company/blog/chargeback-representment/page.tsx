import { articleMetadata } from "@/features/company/blog/metadata";
import { representmentArticle } from "@/features/company/blog/representment-content";
export const metadata = articleMetadata(representmentArticle);
export { RepresentmentPage as default } from "@/features/company/blog/representment-page";

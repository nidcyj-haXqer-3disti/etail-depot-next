import { articleMetadata } from "@/features/company/blog/metadata";
import { preorderExposureArticle } from "@/features/company/blog/preorder-exposure-content";

export const metadata = articleMetadata(preorderExposureArticle);
export { PreorderExposurePage as default } from "@/features/company/blog/preorder-exposure-page";

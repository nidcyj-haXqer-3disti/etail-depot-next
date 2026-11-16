import { articleMetadata } from "@/features/company/blog/metadata";
import { threeDSecureArticle } from "@/features/company/blog/three-d-secure-content";
export const metadata = articleMetadata(threeDSecureArticle);
export { ThreeDSecurePage as default } from "@/features/company/blog/three-d-secure-page";

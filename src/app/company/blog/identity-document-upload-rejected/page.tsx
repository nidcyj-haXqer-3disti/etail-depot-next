import { articleMetadata } from "@/features/company/blog/metadata";
import { identityCaptureArticle } from "@/features/company/blog/identity-capture-content";

export const metadata = articleMetadata(identityCaptureArticle);
export { IdentityCapturePage as default } from "@/features/company/blog/identity-capture-page";

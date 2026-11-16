import { articleMetadata } from "@/features/company/blog/metadata";
import { embeddedSoftwareArticle } from "@/features/company/blog/embedded-software-content";

export const metadata = articleMetadata(embeddedSoftwareArticle);
export { EmbeddedSoftwarePage as default } from "@/features/company/blog/embedded-software-page";

import { articleMetadata } from "@/features/company/blog/metadata";
import { crossChannelArticle } from "@/features/company/blog/cross-channel-content";

export const metadata = articleMetadata(crossChannelArticle);
export { CrossChannelPage as default } from "@/features/company/blog/cross-channel-page";

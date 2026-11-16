import { articleMetadata } from "@/features/company/blog/metadata";
import { nachaNetworkArticle } from "@/features/company/blog/nacha-network-content";

export const metadata = articleMetadata(nachaNetworkArticle);
export { NachaNetworkPage as default } from "@/features/company/blog/nacha-network-page";

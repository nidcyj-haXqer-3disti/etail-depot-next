import { articleMetadata } from "@/features/company/blog/metadata";
import { platformProviderMoveArticle } from "@/features/company/blog/platform-provider-move-content";

export const metadata = articleMetadata(platformProviderMoveArticle);
export { PlatformProviderMovePage as default } from "@/features/company/blog/platform-provider-move-page";

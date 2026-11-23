import { articleMetadata } from "@/features/company/blog/metadata";
import { conditionalLaunchArticle } from "@/features/company/blog/conditional-launch-content";

export const metadata = articleMetadata(conditionalLaunchArticle);
export { ConditionalLaunchPage as default } from "@/features/company/blog/conditional-launch-page";

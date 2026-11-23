import { articleMetadata } from "@/features/company/blog/metadata";
import { setupFeeScopeArticle } from "@/features/company/blog/setup-fee-scope-content";

export const metadata = articleMetadata(setupFeeScopeArticle);
export { SetupFeeScopePage as default } from "@/features/company/blog/setup-fee-scope-page";

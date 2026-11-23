import { articleMetadata } from "@/features/company/blog/metadata";
import { providerExclusivityArticle } from "@/features/company/blog/provider-exclusivity-content";

export const metadata = articleMetadata(providerExclusivityArticle);
export { ProviderExclusivityPage as default } from "@/features/company/blog/provider-exclusivity-page";

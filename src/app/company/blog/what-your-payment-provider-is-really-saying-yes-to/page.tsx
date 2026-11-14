import { articleMetadata } from "@/features/company/blog/metadata";
import { providerApprovalArticle } from "@/features/company/blog/content";

export const metadata = articleMetadata(providerApprovalArticle);
export { ProviderApprovalPage as default } from "@/features/company/blog/provider-approval-page";

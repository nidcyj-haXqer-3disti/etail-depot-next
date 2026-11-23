import { articleMetadata } from "@/features/company/blog/metadata";
import { additionalDomainArticle } from "@/features/company/blog/additional-domain-content";

export const metadata = articleMetadata(additionalDomainArticle);
export { AdditionalDomainPage as default } from "@/features/company/blog/additional-domain-page";

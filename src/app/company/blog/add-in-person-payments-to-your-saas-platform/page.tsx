import { articleMetadata } from "@/features/company/blog/metadata";
import { saasInPersonArticle } from "@/features/company/blog/saas-in-person-content";

export const metadata = articleMetadata(saasInPersonArticle);
export { SaasInPersonPage as default } from "@/features/company/blog/saas-in-person-page";

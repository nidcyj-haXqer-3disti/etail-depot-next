import { articleMetadata } from "@/features/company/blog/metadata";
import { inactiveAccountCostsArticle } from "@/features/company/blog/inactive-account-costs-content";

export const metadata = articleMetadata(inactiveAccountCostsArticle);
export { InactiveAccountCostsPage as default } from "@/features/company/blog/inactive-account-costs-page";

import { articleMetadata } from "@/features/company/blog/metadata";
import { customerMixCostsArticle } from "@/features/company/blog/customer-mix-costs-content";

export const metadata = articleMetadata(customerMixCostsArticle);
export { CustomerMixCostsPage as default } from "@/features/company/blog/customer-mix-costs-page";

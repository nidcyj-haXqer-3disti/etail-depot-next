import { articleMetadata } from "@/features/company/blog/metadata";
import { customerNameArticle } from "@/features/company/blog/customer-name-content";

export const metadata = articleMetadata(customerNameArticle);
export { CustomerNamePage as default } from "@/features/company/blog/customer-name-page";

import { articleMetadata } from "@/features/company/blog/metadata";
import { customerReentryArticle } from "@/features/company/blog/customer-reentry-content";

export const metadata = articleMetadata(customerReentryArticle);
export { CustomerReentryPage as default } from "@/features/company/blog/customer-reentry-page";

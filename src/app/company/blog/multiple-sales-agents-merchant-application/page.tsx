import { articleMetadata } from "@/features/company/blog/metadata";
import { applicationRoutingArticle } from "@/features/company/blog/application-routing-content";

export const metadata = articleMetadata(applicationRoutingArticle);
export { ApplicationRoutingPage as default } from "@/features/company/blog/application-routing-page";

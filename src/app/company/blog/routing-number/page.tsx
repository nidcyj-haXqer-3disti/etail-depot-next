import { articleMetadata } from "@/features/company/blog/metadata";
import { routingNumberArticle } from "@/features/company/blog/routing-number-content";

export const metadata = articleMetadata(routingNumberArticle);
export { RoutingNumberPage as default } from "@/features/company/blog/routing-number-page";

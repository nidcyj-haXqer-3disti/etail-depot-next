import { articleMetadata } from "@/features/company/blog/metadata";
import { retainedGatewayArticle } from "@/features/company/blog/retained-gateway-content";

export const metadata = articleMetadata(retainedGatewayArticle);
export { RetainedGatewayPage as default } from "@/features/company/blog/retained-gateway-page";

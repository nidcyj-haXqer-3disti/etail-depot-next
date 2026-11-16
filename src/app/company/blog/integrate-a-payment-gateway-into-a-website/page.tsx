import { articleMetadata } from "@/features/company/blog/metadata";
import { websiteGatewayArticle } from "@/features/company/blog/website-gateway-content";

export const metadata = articleMetadata(websiteGatewayArticle);
export { WebsiteGatewayPage as default } from "@/features/company/blog/website-gateway-page";

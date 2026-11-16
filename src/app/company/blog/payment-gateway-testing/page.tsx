import { articleMetadata } from "@/features/company/blog/metadata";
import { gatewayTestingArticle } from "@/features/company/blog/gateway-testing-content";

export const metadata = articleMetadata(gatewayTestingArticle);
export { GatewayTestingPage as default } from "@/features/company/blog/gateway-testing-page";

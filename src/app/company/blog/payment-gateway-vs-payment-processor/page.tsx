import { articleMetadata } from "@/features/company/blog/metadata";
import { gatewayProcessorArticle } from "@/features/company/blog/gateway-processor-content";

export const metadata = articleMetadata(gatewayProcessorArticle);
export { GatewayProcessorPage as default } from "@/features/company/blog/gateway-processor-page";

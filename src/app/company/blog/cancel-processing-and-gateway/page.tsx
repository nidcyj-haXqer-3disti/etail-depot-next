import { articleMetadata } from "@/features/company/blog/metadata";
import { gatewayExitArticle } from "@/features/company/blog/gateway-exit-content";

export const metadata = articleMetadata(gatewayExitArticle);
export { GatewayExitPage as default } from "@/features/company/blog/gateway-exit-page";

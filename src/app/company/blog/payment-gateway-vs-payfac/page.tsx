import { articleMetadata } from "@/features/company/blog/metadata";
import { gatewayPayfacArticle } from "@/features/company/blog/gateway-payfac-content";

export const metadata = articleMetadata(gatewayPayfacArticle);
export { GatewayPayfacPage as default } from "@/features/company/blog/gateway-payfac-page";

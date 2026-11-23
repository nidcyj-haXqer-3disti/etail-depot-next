import { articleMetadata } from "@/features/company/blog/metadata";
import { gatewayQuoteCostsArticle } from "@/features/company/blog/gateway-quote-costs-content";

export const metadata = articleMetadata(gatewayQuoteCostsArticle);
export { GatewayQuoteCostsPage as default } from "@/features/company/blog/gateway-quote-costs-page";

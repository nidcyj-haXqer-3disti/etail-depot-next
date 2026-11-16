import { articleMetadata } from "@/features/company/blog/metadata";
import { netCashFlowArticle } from "@/features/company/blog/net-cash-flow-content";

export const metadata = articleMetadata(netCashFlowArticle);
export { NetCashFlowPage as default } from "@/features/company/blog/net-cash-flow-page";

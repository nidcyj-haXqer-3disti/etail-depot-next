import { articleMetadata } from "@/features/company/blog/metadata";
import { processingHistoryBridgeArticle } from "@/features/company/blog/processing-history-bridge-content";

export const metadata = articleMetadata(processingHistoryBridgeArticle);
export { ProcessingHistoryBridgePage as default } from "@/features/company/blog/processing-history-bridge-page";

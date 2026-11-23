import { reviewResponseArticle } from "./review-response-content";
import { previousProcessorArticle } from "./previous-processor-content";
import { conditionalLaunchArticle } from "./conditional-launch-content";
import { applicationCorrectionArticle } from "./application-correction-content";
import { processingHistoryBridgeArticle } from "./processing-history-bridge-content";
import { financialRefreshArticle } from "./financial-refresh-content";
import { businessClosureHistoryArticle } from "./business-closure-history-content";
import { applicationRoutingArticle } from "./application-routing-content";
import { licenseScopeArticle } from "./license-scope-content";
import { approvalRecordArticle } from "./approval-record-content";

/** Eighth local expansion batch. These articles remain in the single Blog collection. */
export const reviewReadinessArticles = [
  reviewResponseArticle,
  previousProcessorArticle,
  conditionalLaunchArticle,
  applicationCorrectionArticle,
  processingHistoryBridgeArticle,
  financialRefreshArticle,
  businessClosureHistoryArticle,
  applicationRoutingArticle,
  licenseScopeArticle,
  approvalRecordArticle,
] as const;

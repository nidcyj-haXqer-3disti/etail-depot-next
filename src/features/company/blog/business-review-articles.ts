import { fulfillmentStoryArticle } from "./fulfillment-story-content";
import { honestProcessingForecastArticle } from "./honest-processing-forecast-content";
import { advanceObligationsArticle } from "./advance-obligations-content";
import { supplyEvidenceArticle } from "./supply-evidence-content";
import { customOrderClockArticle } from "./custom-order-clock-content";
import { preorderExposureArticle } from "./preorder-exposure-content";
import { seasonalCapacityArticle } from "./seasonal-capacity-content";
import { mixedOfferArticle } from "./mixed-offer-content";
import { warehouseAccountabilityArticle } from "./warehouse-accountability-content";
import { privateStoreReviewArticle } from "./private-store-review-content";
import { prelaunchReviewArticle } from "./prelaunch-review-content";
import { trialCommercialFlowArticle } from "./trial-commercial-flow-content";
import { flowAccountabilityArticle } from "./flow-accountability-content";
import { bookingDateChangeArticle } from "./booking-date-change-content";
import { contractEvidenceArticle } from "./contract-evidence-content";
import { supportHandoffArticle } from "./support-handoff-content";
import { channelHistoryArticle } from "./channel-history-content";

/** Sixth local expansion batch. These articles remain in the single Blog collection. */
export const businessReviewArticles = [
  fulfillmentStoryArticle,
  honestProcessingForecastArticle,
  advanceObligationsArticle,
  supplyEvidenceArticle,
  customOrderClockArticle,
  preorderExposureArticle,
  seasonalCapacityArticle,
  mixedOfferArticle,
  warehouseAccountabilityArticle,
  privateStoreReviewArticle,
  prelaunchReviewArticle,
  trialCommercialFlowArticle,
  flowAccountabilityArticle,
  bookingDateChangeArticle,
  contractEvidenceArticle,
  supportHandoffArticle,
  channelHistoryArticle,
] as const;

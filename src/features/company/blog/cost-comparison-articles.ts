import { costPeriodArticle } from "./cost-period-content";
import { quoteCardMixArticle } from "./quote-card-mix-content";
import { quoteRefundsArticle } from "./quote-refunds-content";
import { ratePerOrderArticle } from "./rate-per-order-content";
import { seasonalMinimumArticle } from "./seasonal-minimum-content";
import { canceledOrderFeesArticle } from "./canceled-order-fees-content";
import { failedAttemptCostsArticle } from "./failed-attempt-costs-content";
import { batchFeeQuotesArticle } from "./batch-fee-quotes-content";
import { inactiveAccountCostsArticle } from "./inactive-account-costs-content";
import { gatewayQuoteCostsArticle } from "./gateway-quote-costs-content";
import { internationalCardQuotesArticle } from "./international-card-quotes-content";
import { introductoryRateCostsArticle } from "./introductory-rate-costs-content";
import { smallerOrderFeesArticle } from "./smaller-order-fees-content";
import { volumeDiscountTermsArticle } from "./volume-discount-terms-content";
import { shippingTaxProcessingArticle } from "./shipping-tax-processing-content";
import { advertisedStatementRateArticle } from "./advertised-statement-rate-content";
import { setupFeeScopeArticle } from "./setup-fee-scope-content";
import { subscriptionTransactionCostsArticle } from "./subscription-transaction-costs-content";
import { disputeFeeQuotesArticle } from "./dispute-fee-quotes-content";
import { paymentFeatureSubscriptionsArticle } from "./payment-feature-subscriptions-content";
import { bundleProcessingCostsArticle } from "./bundle-processing-costs-content";
import { annualRenewalCostsArticle } from "./annual-renewal-costs-content";
import { customerMixCostsArticle } from "./customer-mix-costs-content";
import { returnHeavyQuotesArticle } from "./return-heavy-quotes-content";
import { switchingBreakEvenArticle } from "./switching-break-even-content";

/** First locally prepared expansion batch. Individual routes retain draft indexing. */
export const costComparisonArticles = [
  costPeriodArticle,
  quoteCardMixArticle,
  quoteRefundsArticle,
  ratePerOrderArticle,
  seasonalMinimumArticle,
  canceledOrderFeesArticle,
  failedAttemptCostsArticle,
  batchFeeQuotesArticle,
  inactiveAccountCostsArticle,
  gatewayQuoteCostsArticle,
  internationalCardQuotesArticle,
  introductoryRateCostsArticle,
  smallerOrderFeesArticle,
  volumeDiscountTermsArticle,
  shippingTaxProcessingArticle,
  advertisedStatementRateArticle,
  setupFeeScopeArticle,
  subscriptionTransactionCostsArticle,
  disputeFeeQuotesArticle,
  paymentFeatureSubscriptionsArticle,
  bundleProcessingCostsArticle,
  annualRenewalCostsArticle,
  customerMixCostsArticle,
  returnHeavyQuotesArticle,
  switchingBreakEvenArticle,
] as const;

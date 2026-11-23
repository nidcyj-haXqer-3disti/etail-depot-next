import { fundingPremiumArticle } from "./funding-premium-content";
import { retryBillingArticle } from "./retry-billing-content";
import { transactionMinimumArticle } from "./transaction-minimum-content";
import { accountGroupPricingArticle } from "./account-group-pricing-content";
import { platformBillingCostsArticle } from "./platform-billing-costs-content";
import { networkFeeNoticesArticle } from "./network-fee-notices-content";
import { qualifiedRateArticle } from "./qualified-rate-content";
import { billingQuestionsArticle } from "./billing-questions-content";
import { firstStatementArticle } from "./first-statement-content";
import { annualAccountFeesArticle } from "./annual-account-fees-content";
import { transactionFeeCapsArticle } from "./transaction-fee-caps-content";
import { sampleBillingArticle } from "./sample-billing-content";
import { contractPriorityArticle } from "./contract-priority-content";
import { cancellationDeliveryArticle } from "./cancellation-delivery-content";
import { contractRenewalArticle } from "./contract-renewal-content";
import { contractStartArticle } from "./contract-start-content";
import { exitFeeCalculationArticle } from "./exit-fee-calculation-content";
import { gatewayExitArticle } from "./gateway-exit-content";
import { writtenSalesTermsArticle } from "./written-sales-terms-content";
import { pricingAuthorityArticle } from "./pricing-authority-content";
import { pricingNoticeArticle } from "./pricing-notice-content";
import { volumeCommitmentArticle } from "./volume-commitment-content";

/** Second local expansion batch. These articles remain in the single Blog collection. */
export const commercialTermsArticles = [
  fundingPremiumArticle,
  retryBillingArticle,
  transactionMinimumArticle,
  accountGroupPricingArticle,
  platformBillingCostsArticle,
  networkFeeNoticesArticle,
  qualifiedRateArticle,
  billingQuestionsArticle,
  firstStatementArticle,
  annualAccountFeesArticle,
  transactionFeeCapsArticle,
  sampleBillingArticle,
  contractPriorityArticle,
  cancellationDeliveryArticle,
  contractRenewalArticle,
  contractStartArticle,
  exitFeeCalculationArticle,
  gatewayExitArticle,
  writtenSalesTermsArticle,
  pricingAuthorityArticle,
  pricingNoticeArticle,
  volumeCommitmentArticle,
] as const;

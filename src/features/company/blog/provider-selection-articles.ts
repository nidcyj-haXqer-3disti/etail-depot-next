import { featureContractTermArticle } from "./feature-contract-term-content";
import { providerExclusivityArticle } from "./provider-exclusivity-content";
import { contractAssignmentArticle } from "./contract-assignment-content";
import { merchantGuaranteeArticle } from "./merchant-guarantee-content";
import { postContractRecordsArticle } from "./post-contract-records-content";
import { savingsGuaranteeArticle } from "./savings-guarantee-content";
import { terminalObligationArticle } from "./terminal-obligation-content";
import { resellerContinuityArticle } from "./reseller-continuity-content";
import { paypalTrolleysFitArticle } from "./paypal-trolleys-fit-content";
import { supportCoverageArticle } from "./support-coverage-content";
import { crossVendorSupportArticle } from "./cross-vendor-support-content";
import { shopifyProcessingCostArticle } from "./shopify-processing-cost-content";
import { accountHandoffArticle } from "./account-handoff-content";
import { woopaymentsAccountArticle } from "./woopayments-account-content";
import { reportingDemonstrationArticle } from "./reporting-demonstration-content";
import { enterprisePlatformChoiceArticle } from "./enterprise-platform-choice-content";
import { brandAccountRecordsArticle } from "./brand-account-records-content";
import { shopifyRenewalFitArticle } from "./shopify-renewal-fit-content";
import { contractorPaymentAccessArticle } from "./contractor-payment-access-content";
import { planDependenciesArticle } from "./plan-dependencies-content";

/** Third local expansion batch. These articles remain in the single Blog collection. */
export const providerSelectionArticles = [
  featureContractTermArticle,
  providerExclusivityArticle,
  contractAssignmentArticle,
  merchantGuaranteeArticle,
  postContractRecordsArticle,
  savingsGuaranteeArticle,
  terminalObligationArticle,
  resellerContinuityArticle,
  paypalTrolleysFitArticle,
  supportCoverageArticle,
  crossVendorSupportArticle,
  shopifyProcessingCostArticle,
  accountHandoffArticle,
  woopaymentsAccountArticle,
  reportingDemonstrationArticle,
  enterprisePlatformChoiceArticle,
  brandAccountRecordsArticle,
  shopifyRenewalFitArticle,
  contractorPaymentAccessArticle,
  planDependenciesArticle,
] as const;

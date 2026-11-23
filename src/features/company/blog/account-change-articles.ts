import { entityTransitionArticle } from "./entity-transition-content";
import { saleAccountContinuityArticle } from "./sale-account-continuity-content";
import { reorganizationRecordsArticle } from "./reorganization-records-content";
import { ownershipTransitionArticle } from "./ownership-transition-content";
import { additionalDomainArticle } from "./additional-domain-content";
import { reopeningAccountArticle } from "./reopening-account-content";
import { pricingPaymentProfileArticle } from "./pricing-payment-profile-content";
import { marketplaceIndependenceArticle } from "./marketplace-independence-content";
import { representativeSuccessionArticle } from "./representative-succession-content";
import { telephoneChannelArticle } from "./telephone-channel-content";
import { charityChangeArticle } from "./charity-change-content";
import { stateRegistrationChangeArticle } from "./state-registration-change-content";

/** Seventh local expansion batch. These articles remain in the single Blog collection. */
export const accountChangeArticles = [
  entityTransitionArticle,
  saleAccountContinuityArticle,
  reorganizationRecordsArticle,
  ownershipTransitionArticle,
  additionalDomainArticle,
  reopeningAccountArticle,
  pricingPaymentProfileArticle,
  marketplaceIndependenceArticle,
  representativeSuccessionArticle,
  telephoneChannelArticle,
  charityChangeArticle,
  stateRegistrationChangeArticle,
] as const;

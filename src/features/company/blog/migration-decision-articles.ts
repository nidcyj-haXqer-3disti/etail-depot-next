import { retainedGatewayArticle } from "./retained-gateway-content";
import { checkoutPlacementArticle } from "./checkout-placement-content";
import { helcimTrolleysFitArticle } from "./helcim-trolleys-fit-content";
import { oldPaymentLinksArticle } from "./old-payment-links-content";
import { switchingCreditArticle } from "./switching-credit-content";
import { reportingContinuityArticle } from "./reporting-continuity-content";
import { transferProjectCostArticle } from "./transfer-project-cost-content";
import { customerReentryArticle } from "./customer-reentry-content";
import { renewalImportArticle } from "./renewal-import-content";
import { legacyDisputesArticle } from "./legacy-disputes-content";
import { unfinishedAuthorizationsArticle } from "./unfinished-authorizations-content";
import { retainedShoppingCartArticle } from "./retained-shopping-cart-content";
import { retirePaymentAccessArticle } from "./retire-payment-access-content";
import { postSwitchStatementArticle } from "./post-switch-statement-content";
import { walletContinuityArticle } from "./wallet-continuity-content";
import { platformProviderMoveArticle } from "./platform-provider-move-content";
import { migrationRollbackArticle } from "./migration-rollback-content";
import { installmentContinuityArticle } from "./installment-continuity-content";

/** Fourth local expansion batch. These articles remain in the single Blog collection. */
export const migrationDecisionArticles = [
  retainedGatewayArticle,
  checkoutPlacementArticle,
  helcimTrolleysFitArticle,
  oldPaymentLinksArticle,
  switchingCreditArticle,
  reportingContinuityArticle,
  transferProjectCostArticle,
  customerReentryArticle,
  renewalImportArticle,
  legacyDisputesArticle,
  unfinishedAuthorizationsArticle,
  retainedShoppingCartArticle,
  retirePaymentAccessArticle,
  postSwitchStatementArticle,
  walletContinuityArticle,
  platformProviderMoveArticle,
  migrationRollbackArticle,
  installmentContinuityArticle,
] as const;

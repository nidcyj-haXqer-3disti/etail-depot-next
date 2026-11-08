/** Composition registry for cross-page checks. Pages import their own feature content. */
import { merchantOnboardingContent } from "@/features/services/merchant-onboarding/content";
import { paymentMethodsContent } from "@/features/services/payment-methods/content";
import { payoutsContent } from "@/features/services/payouts/content";
import { refundsContent } from "@/features/services/refunds/content";
import { pricingContent } from "@/features/pricing/content";
import { partnershipsContent } from "@/features/use-cases/software-platforms/partnerships/content";
import { serviceModelContent } from "@/features/services/service-model/content";
import { aboutContent } from "@/features/company/about/content";
import { trustContent } from "@/features/company/trust/content";
import { contactContent } from "@/features/company/contact/content";
import { achPaymentsContent } from "@/features/services/ach-payments/content";
import { switchMerchantServicesContent } from "@/features/use-cases/switch-merchant-services/content";
import { paymentModelsContent } from "@/features/use-cases/software-platforms/payment-models/content";
import { reconciliationContent } from "@/features/services/reconciliation/content";
import { disputesContent } from "@/features/services/disputes/content";

export const COMMERCIAL_PAGES = {
  "/services/merchant-onboarding": merchantOnboardingContent,
  "/services/payment-methods": paymentMethodsContent,
  "/services/payouts": payoutsContent,
  "/services/refunds": refundsContent,
  "/pricing": pricingContent,
  "/use-cases/software-platforms/partnerships": partnershipsContent,
  "/services/payment-facilitator": serviceModelContent,
  "/company/about": aboutContent,
  "/company/security": trustContent,
  "/company/contact": contactContent,
  "/services/ach-payments": achPaymentsContent,
  "/use-cases/switch-merchant-services": switchMerchantServicesContent,
  "/use-cases/software-platforms/payment-models": paymentModelsContent,
  "/services/reconciliation": reconciliationContent,
  "/services/disputes": disputesContent,
} as const;

export type CommercialPath = keyof typeof COMMERCIAL_PAGES;
export type { CommercialPage } from "@/shared/ui/page-content-types";

/** Composition registry for cross-page checks. Pages import their own feature content. */
import { merchantOnboardingContent } from "@/features/services/merchant-onboarding/content";
import { paymentMethodsContent } from "@/features/services/payment-methods/content";
import { achPaymentsContent } from "@/features/services/ach-payments/content";
import { payoutsContent } from "@/features/services/payouts/content";
import { reconciliationContent } from "@/features/services/reconciliation/content";
import { refundsContent } from "@/features/services/refunds/content";
import { disputesContent } from "@/features/services/disputes/content";

export const SERVICE_DETAIL_PAGES = {
  "/merchant-onboarding": merchantOnboardingContent,
  "/payment-methods": paymentMethodsContent,
  "/ach-payments": achPaymentsContent,
  "/payouts-and-reconciliation": payoutsContent,
  "/reconciliation": reconciliationContent,
  "/refunds-and-disputes": refundsContent,
  "/disputes": disputesContent,
} as const;

export type ServiceDetailPath = keyof typeof SERVICE_DETAIL_PAGES;
export type { ServiceKind, ServiceDetailContent } from "./shared/content-types";
export function isServiceDetailPath(path: string): path is ServiceDetailPath { return Object.hasOwn(SERVICE_DETAIL_PAGES, path); }

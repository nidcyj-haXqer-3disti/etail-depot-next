import type { CommercialPage } from "@/shared/ui/page-content-types";

export type ServiceKind = "onboarding" | "methods" | "ach" | "payouts" | "reconciliation" | "refunds" | "disputes";
export interface ServiceDetailContent extends CommercialPage {
  kind: ServiceKind;
  workflow: { title: string; intro: string; steps: readonly { title: string; detail: string }[]; note: string };
}

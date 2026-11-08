import { publicPageMetadata as buildPublicMetadata, servicePageMetadata as buildServiceMetadata } from "@/shared/seo/metadata";
import type { Metadata } from "next";
import { CORE_PAGE_MODIFIED } from "@/shared/site/public-page-revisions";
import { canonicalOrigin } from "@/shared/site/public-release";
export * from "@/shared/seo/metadata";
export { rootMetadata } from "./home/metadata";
export { documentationJsonLd } from "./resources/documentation/metadata";
export { platformPageJsonLd } from "./use-cases/software-platforms/metadata";
import { pageDetails as details0, pageJsonLd as json0 } from "@/features/home/metadata";
import { pageDetails as details1, pageJsonLd as json1 } from "@/features/services/card-services/metadata";
import { pageDetails as details2, pageJsonLd as json2 } from "@/features/services/overview/metadata";
import { pageDetails as details3, pageJsonLd as json3 } from "@/features/resources/help/metadata";
import { pageDetails as details4, pageJsonLd as json4 } from "@/features/resources/guides/metadata";
import { pageDetails as details5 } from "@/features/resources/integrations/woocommerce/metadata";
import { pageDetails as details6 } from "@/features/resources/integrations/shopify/metadata";
import { pageDetails as details7 } from "@/features/use-cases/online-businesses/metadata";
import { pageDetails as details8 } from "@/features/resources/documentation/metadata";
import { pageDetails as details9 } from "@/features/use-cases/software-platforms/metadata";
import { pageDetails as details10 } from "@/features/services/merchant-onboarding/metadata";
import { pageDetails as details11 } from "@/features/services/payment-methods/metadata";
import { pageDetails as details12 } from "@/features/services/payouts/metadata";
import { pageDetails as details13 } from "@/features/services/refunds/metadata";
import { pageDetails as details14 } from "@/features/pricing/metadata";
import { pageDetails as details15 } from "@/features/use-cases/software-platforms/partnerships/metadata";
import { pageDetails as details16 } from "@/features/services/service-model/metadata";
import { pageDetails as details17 } from "@/features/company/about/metadata";
import { pageDetails as details18 } from "@/features/company/trust/metadata";
import { pageDetails as details19 } from "@/features/company/contact/metadata";
import { pageDetails as details20 } from "@/features/services/ach-payments/metadata";
import { pageDetails as details21 } from "@/features/use-cases/switch-merchant-services/metadata";
import { pageDetails as details22 } from "@/features/use-cases/software-platforms/payment-models/metadata";
import { pageDetails as details23 } from "@/features/services/reconciliation/metadata";
import { pageDetails as details24 } from "@/features/services/disputes/metadata";
import { pageDetails as details25 } from "@/features/resources/merchant-account-setup/metadata";
import { pageDetails as details26 } from "@/features/resources/documentation/integration-access/metadata";
import { pageDetails as details27 } from "@/features/resources/documentation/checkout/metadata";
import { pageDetails as details28 } from "@/features/resources/documentation/payment-requests/metadata";
import { pageDetails as details29 } from "@/features/resources/documentation/payment-status/metadata";
import { pageDetails as details30 } from "@/features/resources/documentation/refunds-and-disputes/metadata";
import { pageDetails as details31 } from "@/features/resources/documentation/payouts/metadata";
import { pageDetails as details32 } from "@/features/resources/documentation/webhooks/metadata";
import { pageDetails as details33 } from "@/features/resources/documentation/testing-and-launch/metadata";

export const PUBLIC_PAGES = {
  "/": details0,
  "/credit-card-services": details1,
  "/payment-acceptance-service": details2,
  "/help": details3,
  "/guides": details4,
} as const;
export type PublicPath = keyof typeof PUBLIC_PAGES;
export const SERVICE_PAGES = {
  "/resources/woocommerce-gateway-integration": details5,
  "/resources/shopify-gateway-integration": details6,
  "/online-businesses": details7,
  "/docs": details8,
  "/software-partners": details9,
  "/merchant-onboarding": details10,
  "/payment-methods": details11,
  "/payouts-and-reconciliation": details12,
  "/refunds-and-disputes": details13,
  "/pricing": details14,
  "/payment-partnerships": details15,
  "/payment-facilitator": details16,
  "/company": details17,
  "/trust": details18,
  "/contact": details19,
  "/ach-payments": details20,
  "/switch-payment-providers": details21,
  "/platform-payment-models": details22,
  "/reconciliation": details23,
  "/disputes": details24,
  "/docs/merchant-onboarding": details25,
  "/docs/integration-access": details26,
  "/docs/checkout": details27,
  "/docs/payment-requests": details28,
  "/docs/payment-status": details29,
  "/docs/refunds-and-disputes": details30,
  "/docs/payouts": details31,
  "/docs/webhooks": details32,
  "/docs/testing-and-launch": details33,
} as const;
export const PUBLIC_PAGE_MODIFIED = {
  "/": CORE_PAGE_MODIFIED["/"],
  "/credit-card-services": CORE_PAGE_MODIFIED["/credit-card-services"],
  "/payment-acceptance-service": CORE_PAGE_MODIFIED["/payment-acceptance-service"],
  "/help": CORE_PAGE_MODIFIED["/help"],
  "/guides": CORE_PAGE_MODIFIED["/guides"],
} as const satisfies Record<PublicPath, string>;
const jsonByPath = {
  "/": json0,
  "/credit-card-services": json1,
  "/payment-acceptance-service": json2,
  "/help": json3,
  "/guides": json4,
};
export function publicPageUrl(path: PublicPath): string {
  if (!Object.hasOwn(PUBLIC_PAGES, path)) throw new Error("Only reviewed public information pages can publish search metadata.");
  return new URL(path, canonicalOrigin).href;
}
export function publicPageMetadata(path: PublicPath): Metadata { publicPageUrl(path); return buildPublicMetadata(path, PUBLIC_PAGES[path]); }
export function servicePageMetadata(path: keyof typeof SERVICE_PAGES): Metadata { if (!Object.hasOwn(SERVICE_PAGES, path)) throw new Error("Only the exact reviewed service page may use service metadata."); return buildServiceMetadata(path, SERVICE_PAGES[path]); }
export function publicPageJsonLd(path: PublicPath): string { publicPageUrl(path); return jsonByPath[path](); }

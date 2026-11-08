import { developerPageDetails } from "./developers/metadata";
import { publicPageMetadata as buildPublicMetadata, servicePageMetadata as buildServiceMetadata } from "@/shared/seo/metadata";
import type { Metadata } from "next";
import { CORE_PAGE_MODIFIED } from "@/shared/site/public-page-revisions";
import { canonicalOrigin } from "@/shared/site/public-release";
export * from "@/shared/seo/metadata";
export { rootMetadata } from "./home/metadata";
export { platformPageJsonLd } from "./use-cases/software-platforms/metadata";
import { pageDetails as details0, pageJsonLd as json0 } from "@/features/home/metadata";
import { pageDetails as details1, pageJsonLd as json1 } from "@/features/services/card-services/metadata";
import { pageDetails as details2, pageJsonLd as json2 } from "@/features/services/overview/metadata";
import { pageDetails as details3, pageJsonLd as json3 } from "@/features/resources/help/metadata";
import { pageDetails as details4, pageJsonLd as json4 } from "@/features/resources/guides/metadata";
import { pageDetails as details5 } from "@/features/resources/integrations/woocommerce/metadata";
import { pageDetails as details6 } from "@/features/resources/integrations/shopify/metadata";
import { pageDetails as details7 } from "@/features/use-cases/online-businesses/metadata";
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

export const PUBLIC_PAGES = {
  "/": details0,
  "/services/card-services": details1,
  "/services/merchant-services": details2,
  "/resources/help": details3,
  "/resources/guides": details4,
} as const;
export type PublicPath = keyof typeof PUBLIC_PAGES;
export const SERVICE_PAGES = {
  ...developerPageDetails,
  "/resources/merchant-account-setup": details25,
  "/resources/woocommerce-gateway-integration": details5,
  "/resources/shopify-gateway-integration": details6,
  "/use-cases/online-businesses": details7,
  "/use-cases/software-platforms": details9,
  "/services/merchant-onboarding": details10,
  "/services/payment-methods": details11,
  "/services/payouts": details12,
  "/services/refunds": details13,
  "/pricing": details14,
  "/use-cases/software-platforms/partnerships": details15,
  "/services/payment-facilitator": details16,
  "/company/about": details17,
  "/company/security": details18,
  "/company/contact": details19,
  "/services/ach-payments": details20,
  "/use-cases/switch-merchant-services": details21,
  "/use-cases/software-platforms/payment-models": details22,
  "/services/reconciliation": details23,
  "/services/disputes": details24,
} as const;
export const PUBLIC_PAGE_MODIFIED = {
  "/": CORE_PAGE_MODIFIED["/"],
  "/services/card-services": CORE_PAGE_MODIFIED["/services/card-services"],
  "/services/merchant-services": CORE_PAGE_MODIFIED["/services/merchant-services"],
  "/resources/help": CORE_PAGE_MODIFIED["/resources/help"],
  "/resources/guides": CORE_PAGE_MODIFIED["/resources/guides"],
} as const satisfies Record<PublicPath, string>;
const jsonByPath = {
  "/": json0,
  "/services/card-services": json1,
  "/services/merchant-services": json2,
  "/resources/help": json3,
  "/resources/guides": json4,
};
export function publicPageUrl(path: PublicPath): string {
  if (!Object.hasOwn(PUBLIC_PAGES, path)) throw new Error("Only reviewed public information pages can publish search metadata.");
  return new URL(path, canonicalOrigin).href;
}
export function publicPageMetadata(path: PublicPath): Metadata { publicPageUrl(path); return buildPublicMetadata(path, PUBLIC_PAGES[path]); }
export function servicePageMetadata(path: keyof typeof SERVICE_PAGES): Metadata { if (!Object.hasOwn(SERVICE_PAGES, path)) throw new Error("Only the exact reviewed service page may use service metadata."); return buildServiceMetadata(path, SERVICE_PAGES[path]); }
export function publicPageJsonLd(path: PublicPath): string { publicPageUrl(path); return jsonByPath[path](); }

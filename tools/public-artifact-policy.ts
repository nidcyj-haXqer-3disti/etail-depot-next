import { DEVELOPER_PATHS } from "../src/shared/site/developer-paths.ts";
import { sourceOnlyStaticFile } from "./file-publication-policy.ts";
/** Pure deployment-boundary detectors, shared by packaging checks and adversarial tests. */
import { LEGAL_CENTER_PATHS } from "../src/shared/site/legal-paths.ts";
import { RESOURCE_PATHS } from "../src/shared/site/resource-paths.ts";
import { COMMERCIAL_PATHS } from "../src/shared/site/commercial-paths.ts";
import { PUBLIC_CONTENT_PATHS, publicExportFile } from "../src/shared/site/public-page-inventory.ts";
import { managedContentRoute, retiredArticleRoute } from "../src/shared/site/public-routes.ts";

export const retiredFamilies = ["api", "checkout", "pay", "payments", "cardholder-services", "cards", "merchant-services", "merchants", "login", "profile", "security", "shared-access", "invitations", "operations", "money-accounts", "accounts", "services"] as const;
export const boundarySource = "netlify/edge-functions/public-boundary.ts";
export const edgeHandler = "public-boundary";

/** Exact reviewed pages: adding a guide never opens the rest of its route family. */
const retainedCorePageSources = [
  "page.tsx",
  "services/card-services/page.tsx",
  "services/merchant-services/page.tsx",
  "resources/help/page.tsx",
  "company/privacy/page.tsx",
  "company/terms/page.tsx",
  "resources/guides/page.tsx",
] as const;
export const publicHtmlFiles = PUBLIC_CONTENT_PATHS.map(path => path === "/" ? "index.html" : `${path.slice(1)}.html`);
/** Local source/export permission is separate from the published-page allowlist. */
export const localCorePreviewPageSources = ["use-cases/software-platforms/page.tsx", "use-cases/online-businesses/page.tsx", ...DEVELOPER_PATHS.map(path=>`${path.slice(1)}/page.tsx`)] as const;
export const localStandardPageSources = [
  "resources/guides/iso-20022/page.tsx", "resources/guides/iso-20022/[set]/page.tsx", "resources/guides/iso-20022/[set]/[code]/page.tsx",
  "resources/guides/iso-8583/page.tsx", "resources/guides/iso-8583/[table]/page.tsx", "resources/guides/iso-8583/[table]/[code]/page.tsx",
] as const;
export const commercialPageSources = COMMERCIAL_PATHS.map(path => `${path.slice(1)}/page.tsx`);
export const publicPageSources = [...RESOURCE_PATHS.map(path => `${path.slice(1)}/page.tsx`), ...LEGAL_CENTER_PATHS.map(path => `${path.slice(1)}/page.tsx`), ...commercialPageSources, ...retainedCorePageSources, ...localCorePreviewPageSources, ...localStandardPageSources];
/** Customer facing publication scope authorized on 5 November 2026. Account acceptance remains separate. */
export const reviewedLegalPageSources: readonly string[] = [
  "company/legal/page.tsx", "company/legal/merchant-services/page.tsx", "company/legal/fees/page.tsx",
  "company/legal/payouts-and-reserves/page.tsx", "company/legal/acceptable-use/page.tsx",
  "company/legal/software-platforms/page.tsx", "company/legal/acquirer-disclosure/page.tsx",
  "company/legal/merchant-privacy/page.tsx", "company/legal/data-processing/page.tsx", "company/legal/security-policy/page.tsx",
];
/** A future legal page is not approved merely because it joins the route inventory. */
export function pendingLegalPageSources(sources: readonly string[]): string[] {
  return sources.filter(source => !reviewedLegalPageSources.includes(source));
}
export const localPreviewPageSources: readonly string[] = pendingLegalPageSources(LEGAL_CENTER_PATHS.map(path => `${path.slice(1)}/page.tsx`));
export const builtPageSources = publicPageSources;
const publicAppModules = new Set<string>([
  ...builtPageSources,
  "layout.tsx", "not-found.tsx", "error.tsx", "global-error.tsx", "robots.ts", "sitemap.ts", "opengraph-image.tsx",
]);

export function reviewedPublicAppModule(appPath: string): boolean {
  return publicAppModules.has(appPath);
}

const reviewedFeatureSources = new Set<string>([
  "src/features/services/components/service-art-motion.tsx",
  "src/features/services/components/service-art-motion.module.css",
  "src/features/developers/guidance/checkout.ts",
  "src/features/developers/guidance/integration-access.ts",
  "src/features/developers/guidance/payment-requests.ts",
  "src/features/developers/guidance/payment-status.ts",
  "src/features/developers/guidance/payouts.ts",
  "src/features/developers/guidance/refunds-and-disputes.ts",
  "src/features/developers/guidance/testing-and-launch.ts",
  "src/features/developers/guidance/webhooks.ts",
  "src/features/developers/metadata.ts",
  "src/features/developers/navigation.tsx",
  "src/features/developers/page-content.tsx",
  "src/features/resources/merchant-account-setup/page-content.tsx",

  "src/features/commercial-catalog.ts",
  "src/features/company/about/about-page.module.css",
  "src/features/company/about/about-page.tsx",
  "src/features/company/about/content.ts",
  "src/features/company/about/metadata.ts",
  "src/features/company/contact/contact-enquiries.module.css",
  "src/features/company/contact/contact-hero.module.css",
  "src/features/company/contact/contact-hero.tsx",
  "src/features/company/contact/contact-page.tsx",
  "src/features/company/contact/content.ts",
  "src/features/company/contact/metadata.ts",
  "src/features/company/legal/components/legal-document.css",
  "src/features/company/legal/components/legal-document.tsx",
  "src/features/company/legal/components/legal-service-document.tsx",
  "src/features/company/legal/legal-center/content.ts",
  "src/features/company/legal/legal-center/metadata.ts",
  "src/features/company/legal/legal-center/page-content.tsx",
  "src/features/company/legal/merchant-legal-content.json",
  "src/features/company/legal/metadata.ts",
  "src/features/company/legal/website-privacy/metadata.ts",
  "src/features/company/legal/website-privacy/page-content.tsx",
  "src/features/company/legal/website-terms/metadata.ts",
  "src/features/company/legal/website-terms/page-content.tsx",
  "src/features/company/trust/content.ts",
  "src/features/company/trust/metadata.ts",
  "src/features/company/trust/page-content.tsx",
  "src/features/home/home-art-motion.tsx",
  "src/features/home/home-company-art.tsx",
  "src/features/home/home-overview.module.css",
  "src/features/home/metadata.ts",
  "src/features/home/page-content.tsx",
  "src/features/metadata.ts",
  "src/features/pricing/content.ts",
  "src/features/pricing/fee-estimate.ts",
  "src/features/pricing/metadata.ts",
  "src/features/pricing/page-content.tsx",
  "src/features/pricing/payment-fee-estimate.tsx",
  "src/features/pricing/payment-offer.tsx",
  "src/features/pricing/site-artwork-polish-pricing.css",
  "src/features/resources/components/guide-preview-image.tsx",
  "src/features/resources/components/integration-guide-step-state.tsx",
  "src/features/resources/components/integration-guide.module.css",
  "src/features/resources/guides/connected-resources-guides.css",
  "src/features/resources/guides/enterprise-support-guides.css",
  "src/features/resources/guides/guide-directory.css",
  "src/features/resources/guides/guide-directory.tsx",
  "src/features/resources/guides/metadata.ts",
  "src/features/resources/help/connected-resources-help.css",
  "src/features/resources/help/enterprise-support-help.css",
  "src/features/resources/help/metadata.ts",
  "src/features/resources/help/page-content.tsx",
  "src/features/resources/integrations/shopify/assets/activate.webp",
  "src/features/resources/integrations/shopify/assets/active.webp",
  "src/features/resources/integrations/shopify/assets/agreement.webp",
  "src/features/resources/integrations/shopify/assets/business-center.webp",
  "src/features/resources/integrations/shopify/assets/choose-cybersource.webp",
  "src/features/resources/integrations/shopify/assets/install.webp",
  "src/features/resources/integrations/shopify/assets/other-providers.webp",
  "src/features/resources/integrations/shopify/assets/payments.webp",
  "src/features/resources/integrations/shopify/assets/permissions.webp",
  "src/features/resources/integrations/shopify/assets/previews/activate-preview-activate-webp-640.webp",
  "src/features/resources/integrations/shopify/assets/previews/active-preview-active-webp-640.webp",
  "src/features/resources/integrations/shopify/assets/previews/agreement-preview-agreement-webp-640.webp",
  "src/features/resources/integrations/shopify/assets/previews/install-preview-install-webp-640.webp",
  "src/features/resources/integrations/shopify/assets/previews/other-providers-preview-other-providers-webp-640.webp",
  "src/features/resources/integrations/shopify/assets/settings.webp",
  "src/features/resources/integrations/shopify/assets/shopify-preview-assets.ts",
  "src/features/resources/integrations/shopify/metadata.ts",
  "src/features/resources/integrations/shopify/shopify-content.ts",
  "src/features/resources/integrations/shopify/shopify-credentials-email-art.module.css",
  "src/features/resources/integrations/shopify/shopify-credentials-email-art.tsx",
  "src/features/resources/integrations/shopify/shopify-gateway-guide.module.css",
  "src/features/resources/integrations/shopify/shopify-gateway-guide.tsx",
  "src/features/resources/integrations/shopify/shopify-guide-screenshot.tsx",
  "src/features/resources/integrations/shopify/shopify-screenshot-assets.ts",
  "src/features/resources/integrations/shopify/shopify-verification-art.module.css",
  "src/features/resources/integrations/shopify/shopify-verification-art.tsx",
  "src/features/resources/integrations/woocommerce/assets/previews/woo-certificate-preview-certificateDownload-640.webp",
  "src/features/resources/integrations/woocommerce/assets/previews/woo-certificate-preview-certificateDownload.webp",
  "src/features/resources/integrations/woocommerce/assets/previews/woo-certificate-preview-certificatePassword.webp",
  "src/features/resources/integrations/woocommerce/assets/previews/woo-checkout-preview-checkout-1040.webp",
  "src/features/resources/integrations/woocommerce/assets/previews/woo-checkout-preview-checkout-640.webp",
  "src/features/resources/integrations/woocommerce/assets/previews/woo-credentials-preview-apiFields.webp",
  "src/features/resources/integrations/woocommerce/assets/previews/woo-credentials-preview-certificateFields.webp",
  "src/features/resources/integrations/woocommerce/assets/previews/woo-cyberduck-complete-preview-duckComplete-640.webp",
  "src/features/resources/integrations/woocommerce/assets/previews/woo-cyberduck-connect-preview-duckConnect-640.webp",
  "src/features/resources/integrations/woocommerce/assets/previews/woo-cyberduck-download-preview-duckDownload-640.webp",
  "src/features/resources/integrations/woocommerce/assets/previews/woo-cyberduck-file-permissions-preview-duckFilePermissions-640.webp",
  "src/features/resources/integrations/woocommerce/assets/previews/woo-cyberduck-folders-preview-duckFolders-1040.webp",
  "src/features/resources/integrations/woocommerce/assets/previews/woo-cyberduck-folders-preview-duckFolders-640.webp",
  "src/features/resources/integrations/woocommerce/assets/previews/woo-cyberduck-select-file-preview-duckSelectFile-1.webp",
  "src/features/resources/integrations/woocommerce/assets/previews/woo-cyberduck-select-file-preview-duckSelectFile-2.webp",
  "src/features/resources/integrations/woocommerce/assets/previews/woo-keys-preview-apiValues.webp",
  "src/features/resources/integrations/woocommerce/assets/previews/woo-payments-preview-payments-640.webp",
  "src/features/resources/integrations/woocommerce/assets/previews/woo-payments-preview-payments.webp",
  "src/features/resources/integrations/woocommerce/assets/previews/woo-plugin-preview-plugin-640.webp",
  "src/features/resources/integrations/woocommerce/assets/previews/woo-plugin-preview-plugin.webp",
  "src/features/resources/integrations/woocommerce/assets/previews/woo-records-preview-records-1040.webp",
  "src/features/resources/integrations/woocommerce/assets/previews/woo-records-preview-records-640.webp",
  "src/features/resources/integrations/woocommerce/assets/previews/woo-refund-preview-refund.webp",
  "src/features/resources/integrations/woocommerce/assets/previews/woo-settings-preview-settings-1040.webp",
  "src/features/resources/integrations/woocommerce/assets/previews/woo-settings-preview-settings-640.webp",
  "src/features/resources/integrations/woocommerce/assets/previews/woo-storage-preview-storage.webp",
  "src/features/resources/integrations/woocommerce/assets/previews/woo-store-preview-store-640.webp",
  "src/features/resources/integrations/woocommerce/assets/previews/woo-store-preview-store.webp",
  "src/features/resources/integrations/woocommerce/assets/woo-certificate.webp",
  "src/features/resources/integrations/woocommerce/assets/woo-checkout.webp",
  "src/features/resources/integrations/woocommerce/assets/woo-credentials.webp",
  "src/features/resources/integrations/woocommerce/assets/woo-cyberduck-complete.webp",
  "src/features/resources/integrations/woocommerce/assets/woo-cyberduck-connect.webp",
  "src/features/resources/integrations/woocommerce/assets/woo-cyberduck-download.webp",
  "src/features/resources/integrations/woocommerce/assets/woo-cyberduck-file-permissions.webp",
  "src/features/resources/integrations/woocommerce/assets/woo-cyberduck-folder-permissions.webp",
  "src/features/resources/integrations/woocommerce/assets/woo-cyberduck-folders.webp",
  "src/features/resources/integrations/woocommerce/assets/woo-cyberduck-select-file.webp",
  "src/features/resources/integrations/woocommerce/assets/woo-keys.webp",
  "src/features/resources/integrations/woocommerce/assets/woo-login-detail.webp",
  "src/features/resources/integrations/woocommerce/assets/woo-login.webp",
  "src/features/resources/integrations/woocommerce/assets/woo-payments.webp",
  "src/features/resources/integrations/woocommerce/assets/woo-plugin.webp",
  "src/features/resources/integrations/woocommerce/assets/woo-records.webp",
  "src/features/resources/integrations/woocommerce/assets/woo-refund.webp",
  "src/features/resources/integrations/woocommerce/assets/woo-settings.webp",
  "src/features/resources/integrations/woocommerce/assets/woo-storage.webp",
  "src/features/resources/integrations/woocommerce/assets/woo-store.webp",
  "src/features/resources/integrations/woocommerce/assets/woocommerce-preview-assets.ts",
  "src/features/resources/integrations/woocommerce/metadata.ts",
  "src/features/resources/integrations/woocommerce/woocommerce-connection-walkthrough.tsx",
  "src/features/resources/integrations/woocommerce/woocommerce-content.ts",
  "src/features/resources/integrations/woocommerce/woocommerce-file-transfer.tsx",
  "src/features/resources/integrations/woocommerce/woocommerce-gateway-guide.tsx",
  "src/features/resources/integrations/woocommerce/woocommerce-guide-panels.tsx",
  "src/features/resources/integrations/woocommerce/woocommerce-guide-screenshot.tsx",
  "src/features/resources/merchant-account-setup/application-guide-steps.module.css",
  "src/features/resources/merchant-account-setup/application-guide-steps.tsx",
  "src/features/resources/merchant-account-setup/assets/blank-registration.jpg",
  "src/features/resources/merchant-account-setup/assets/registration.jpg",
  "src/features/resources/merchant-account-setup/assets/welcome.jpg",
  "src/features/resources/merchant-account-setup/content.ts",
  "src/features/resources/merchant-account-setup/merchant-account-guide.module.css",
  "src/features/resources/merchant-account-setup/merchant-account-guide.tsx",
  "src/features/resources/merchant-account-setup/metadata.ts",
  "src/features/resources/references/components/connected-resources-reference.css",
  "src/features/resources/references/components/enterprise-support-reference.css",
  "src/features/resources/references/components/reference-index.tsx",
  "src/features/resources/references/components/reference-table-filter.module.css",
  "src/features/resources/references/components/reference-table-filter.tsx",
  "src/features/resources/references/components/standards-collections.css",
  "src/features/resources/references/components/standards-collections.tsx",
  "src/features/resources/references/components/standards-reference.css",
  "src/features/resources/references/iso-20022/data/iso20022-data.json",
  "src/features/resources/references/iso-20022/iso20022-reference.css",
  "src/features/resources/references/iso-20022/iso20022-reference.tsx",
  "src/features/resources/references/iso-20022/iso20022-status-context.tsx",
  "src/features/resources/references/iso-20022/reference.ts",
  "src/features/resources/references/iso-8583/data/iso8583-independent-data.json",
  "src/features/resources/references/iso-8583/iso8583-reference.css",
  "src/features/resources/references/iso-8583/iso8583-reference.tsx",
  "src/features/resources/references/iso-8583/reference.ts",
  "src/features/services/ach-payments/artwork.tsx",
  "src/features/services/ach-payments/content.ts",
  "src/features/services/ach-payments/metadata.ts",
  "src/features/services/ach-payments/page-content.tsx",
  "src/features/services/card-services/artwork.tsx",
  "src/features/services/card-services/card-services.css",
  "src/features/services/card-services/metadata.ts",
  "src/features/services/card-services/page-content.tsx",
  "src/features/services/card-services/secured-credit-art.css",
  "src/features/services/card-services/secured-credit-art.tsx",
  "src/features/services/card-services/wallet-card-art.css",
  "src/features/services/card-services/wallet-card-art.tsx",
  "src/features/services/card-services/wallet-guide.tsx",
  "src/features/services/catalog.ts",
  "src/features/services/components/merchant-record-art.module.css",
  "src/features/services/components/merchant-record-art.tsx",
  "src/features/services/components/payment-artwork-header.tsx",
  "src/features/services/components/service-operation-art.module.css",
  "src/features/services/components/service-product-art.module.css",
  "src/features/services/components/service-product-art.tsx",
  "src/features/services/components/service-workflow-art.tsx",
  "src/features/services/disputes/artwork.tsx",
  "src/features/services/disputes/dispute-artwork.module.css",
  "src/features/services/disputes/content.ts",
  "src/features/services/disputes/metadata.ts",
  "src/features/services/disputes/page-content.tsx",
  "src/features/services/merchant-onboarding/account-setup-art.tsx",
  "src/features/services/merchant-onboarding/artwork.tsx",
  "src/features/services/merchant-onboarding/content.ts",
  "src/features/services/merchant-onboarding/merchant-application-art.module.css",
  "src/features/services/merchant-onboarding/merchant-application-art.tsx",
  "src/features/services/merchant-onboarding/metadata.ts",
  "src/features/services/merchant-onboarding/page-content.tsx",
  "src/features/services/overview/commerce-product-art.css",
  "src/features/services/overview/commerce-product-art.tsx",
  "src/features/services/overview/connected-payment-art.tsx",
  "src/features/services/overview/merchant-journey-art.css",
  "src/features/services/overview/merchant-journey-art.tsx",
  "src/features/services/overview/metadata.ts",
  "src/features/services/overview/page-content.tsx",
  "src/features/services/overview/payment-artwork.css",
  "src/features/services/overview/payment-page.css",
  "src/features/services/overview/payment-service-explorer.css",
  "src/features/services/overview/payment-service-explorer.tsx",
  "src/features/services/overview/unified-checkout-preview.css",
  "src/features/services/overview/unified-checkout-preview.tsx",
  "src/features/services/payment-methods/artwork.tsx",
  "src/features/services/payment-methods/content.ts",
  "src/features/services/payment-methods/metadata.ts",
  "src/features/services/payment-methods/page-content.tsx",
  "src/features/services/payouts/artwork.tsx",
  "src/features/services/payouts/payout-artwork.module.css",
  "src/features/services/payouts/content.ts",
  "src/features/services/payouts/metadata.ts",
  "src/features/services/payouts/page-content.tsx",
  "src/features/services/payouts/payout-record-art.tsx",
  "src/features/services/reconciliation/artwork.tsx",
  "src/features/services/reconciliation/reconciliation-artwork.module.css",
  "src/features/services/reconciliation/content.ts",
  "src/features/services/reconciliation/metadata.ts",
  "src/features/services/reconciliation/page-content.tsx",
  "src/features/services/refunds/artwork.tsx",
  "src/features/services/refunds/refund-artwork.module.css",
  "src/features/services/refunds/content.ts",
  "src/features/services/refunds/metadata.ts",
  "src/features/services/refunds/page-content.tsx",
  "src/features/services/service-model/content.ts",
  "src/features/services/service-model/metadata.ts",
  "src/features/services/service-model/page-content.tsx",
  "src/features/services/shared/artwork-primitives.tsx",
  "src/features/services/shared/content-types.ts",
  "src/features/services/shared/service-detail-layout.tsx",
  "src/features/services/shared/service-detail.module.css",
  "src/features/use-cases/online-businesses/metadata.ts",
  "src/features/use-cases/online-businesses/online-business-page.css",
  "src/features/use-cases/online-businesses/page-content.tsx",
  "src/features/use-cases/online-businesses/payment-link-art.css",
  "src/features/use-cases/online-businesses/payment-link-art.tsx",
  "src/features/use-cases/online-businesses/site-artwork-polish-online.css",
  "src/features/use-cases/software-platforms/industries.ts",
  "src/features/use-cases/software-platforms/industry-workflow.tsx",
  "src/features/use-cases/software-platforms/platform-art-motion.tsx",
  "src/features/use-cases/software-platforms/platform-use-cases.tsx",
  "src/features/use-cases/software-platforms/platform-use-cases.module.css",
  "src/features/use-cases/software-platforms/metadata.ts",
  "src/features/use-cases/software-platforms/page-content.tsx",
  "src/features/use-cases/software-platforms/partnerships/content.ts",
  "src/features/use-cases/software-platforms/partnerships/metadata.ts",
  "src/features/use-cases/software-platforms/partnerships/page-content.tsx",
  "src/features/use-cases/software-platforms/payment-models/content.ts",
  "src/features/use-cases/software-platforms/payment-models/metadata.ts",
  "src/features/use-cases/software-platforms/payment-models/page-content.tsx",
  "src/features/use-cases/software-platforms/payment-models/platform-account-art.module.css",
  "src/features/use-cases/software-platforms/payment-models/platform-account-art.tsx",
  "src/features/use-cases/software-platforms/platform-journey-art.module.css",
  "src/features/use-cases/software-platforms/platform-accounts-art.tsx",
  "src/features/use-cases/software-platforms/platform-accounts-art.module.css",
  "src/features/use-cases/software-platforms/platform-journey-art.tsx",
  "src/features/use-cases/switch-merchant-services/content.ts",
  "src/features/use-cases/switch-merchant-services/metadata.ts",
  "src/features/use-cases/switch-merchant-services/page-content.tsx",
  "src/features/use-cases/switch-merchant-services/payment-decision-art.css",
  "src/features/use-cases/switch-merchant-services/payment-decision-art.tsx"
]);

export function publicSourcePath(filename: string): boolean {
  return reviewedFeatureSources.has(filename) || reviewedFeatureSources.has(`${filename}.ts`) || reviewedFeatureSources.has(`${filename}.tsx`) || filename === boundarySource || filename.startsWith("src/app/") ||
    filename.startsWith("src/shared/");
}

export function forbiddenArtifact(filename: string): boolean {
  const normalized = filename.replaceAll("\\", "/");
  return /(?:^|\/)(?:\.env(?:\.[^/]*)?|\.local|\.git)(?:\/|$)/.test(normalized) ||
    /(?:^|\/)archive(?:\/|$)/.test(normalized) || /(?:^|\/)netlify\/database(?:\/|$)/.test(normalized) ||
    /(?:^|\/)src\/platform(?:\/|$)/.test(normalized) ||
    /(?:^|\/)src\/modules\/(?!public-site(?:\/|$))/.test(normalized) ||
    /(?:^|\/)node_modules\/(?:pg|drizzle-orm|node-forge|braces|micromatch|fast-glob|netlify-cli|@netlify\/(?:database|identity|plugin-nextjs))(?:\/|$)/.test(normalized) ||
    /(?:^|\/)node_modules\/\.pnpm\/(?:pg|drizzle-orm|node-forge|braces|micromatch|fast-glob|netlify-cli|@netlify\+(?:database|identity|plugin-nextjs))@/.test(normalized);
}

export function forbiddenStatic(filename: string): boolean {
  const normalized = filename.replaceAll("\\", "/");
  return sourceOnlyStaticFile(normalized) || forbiddenArtifact(normalized) || /(?:^|\/)(?:src|review|artifacts|content|outputs|tools|node_modules|\.next|functions|functions-internal)(?:\/|$)/.test(normalized) ||
    (managedContentRoute(`/${normalized}`) && (!publicExportFile(normalized) || normalized !== filename)) || retiredArticleRoute(`/${normalized}`) ||
    /\.(?:sql|sqlite|sqlite3|db|dump|zip|eszip)$/i.test(normalized) ||
    retiredFamilies.some(family => (normalized === family || normalized.startsWith(`${family}/`) || normalized === `${family}.html` || normalized === `${family}.txt`) && !(family === "services" && publicExportFile(normalized)));
}

/** All requests pass the single public boundary so deployment-context search protection cannot be bypassed. */
export function edgeEntryFindings(entries: unknown): string[] {
  if (!Array.isArray(entries)) return ["INVALID_EDGE_ENTRIES"];
  const issues: string[] = [];
  if (entries.length !== 1) issues.push("UNEXPECTED_EDGE_ENTRY_COUNT");
  for (const entry of entries) {
    if (!entry || typeof entry !== "object") { issues.push("INVALID_EDGE_ENTRY"); continue; }
    if (entry.function !== edgeHandler) issues.push("UNEXPECTED_EDGE_HANDLER");
    if (entry.pattern !== "^/.*$") issues.push("UNEXPECTED_EDGE_PATTERN");
    if ((entry.excluded_patterns !== undefined && (!Array.isArray(entry.excluded_patterns) || entry.excluded_patterns.length)) ||
        entry.excludedPattern !== undefined || entry.methods !== undefined || entry.method !== undefined || entry.path !== undefined) {
      issues.push("RESTRICTED_BOUNDARY_COVERAGE");
    }
  }
  return [...new Set(issues)];
}

/** Review packaging uses the same content with preview search protection. */
export const localReviewHtmlFiles = publicHtmlFiles;
export const forbiddenLocalReviewStatic = forbiddenStatic;

export function publicationBlockers(pendingPageSources: readonly string[], hasIso8583: boolean): string[] {
  const blockers: string[] = [];
  if (hasIso8583) blockers.push("ISO_8583_PERMISSION_UNCONFIRMED: written permission for website republication and public source distribution has not been recorded. The user chose to retain the full collection and wait for permission.");
  if (pendingPageSources.length) blockers.push(`EXPANDED_RELEASE_SCOPE_HELD: ${pendingPageSources.length} page sources remain approved for local review only. Full scope production routing, metadata and release approval remain pending.`);
  return blockers;
}

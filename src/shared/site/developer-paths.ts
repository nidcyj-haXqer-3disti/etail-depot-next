/** Public information pages only. Etail APIs and developer products are not available. */
export const DEVELOPER_NAVIGATION = [
  {slug:"getting-started",label:"Getting started",href:"/developers/getting-started"},
  {slug:"api-reference",label:"API reference",href:"/developers/api-reference"},
  {slug:"sdks",label:"SDKs",href:"/developers/sdks"},
  {slug:"webhooks",label:"Webhooks",href:"/developers/webhooks"},
  {slug:"testing",label:"Testing",href:"/developers/testing"},
  {slug:"developer-tools",label:"Developer tools",href:"/developers/developer-tools"},
  {slug:"changelog",label:"Changelog",href:"/developers/changelog"},
  {slug:"api-status",label:"API status",href:"/developers/api-status"},
] as const;
export type DeveloperSlug = typeof DEVELOPER_NAVIGATION[number]["slug"];
export const DEVELOPER_PATHS = DEVELOPER_NAVIGATION.map(page=>page.href);

/** Path-only redirects preserve incoming section bookmarks; no request input is forwarded. */
export const DOCUMENTATION_REDIRECTS: Readonly<Record<string,string>> = {
 "/docs":"/developers/getting-started",
 "/docs/merchant-onboarding":"/resources/merchant-account-setup",
 "/docs/integration-access":"/developers/getting-started",
 "/docs/checkout":"/developers/getting-started",
 "/docs/payment-status":"/developers/api-reference",
 "/docs/refunds-and-disputes":"/developers/api-reference",
 "/docs/payouts":"/developers/api-reference",
 "/docs/webhooks":"/developers/webhooks",
 "/docs/testing-and-launch":"/developers/testing",
 "/docs/payment-requests":"/developers/developer-tools",
};

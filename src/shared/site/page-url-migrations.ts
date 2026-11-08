/** Exact former public page addresses, approved for local migration on 8 November 2026. */
export const CORE_PAGE_MOVES: Readonly<Record<string,string>> = {
  "/merchant-onboarding": "/services/merchant-onboarding",
  "/payment-methods": "/services/payment-methods",
  "/ach-payments": "/services/ach-payments",
  "/payouts-and-reconciliation": "/services/payouts",
  "/reconciliation": "/services/reconciliation",
  "/refunds-and-disputes": "/services/refunds",
  "/disputes": "/services/disputes",
  "/credit-card-services": "/services/card-services",
  "/payment-acceptance-service": "/services/merchant-services",
  "/payment-facilitator": "/services/payment-facilitator",
  "/online-businesses": "/use-cases/online-businesses",
  "/software-partners": "/use-cases/software-platforms",
  "/switch-payment-providers": "/use-cases/switch-merchant-services",
  "/payment-partnerships": "/use-cases/software-platforms/partnerships",
  "/platform-payment-models": "/use-cases/software-platforms/payment-models",
  "/help": "/resources/help",
  "/guides": "/resources/guides",
  "/company": "/company/about",
  "/contact": "/company/contact",
  "/trust": "/company/security",
  "/privacy": "/company/privacy",
  "/terms": "/company/terms",
  "/legal": "/company/legal",
  "/legal/merchant-services": "/company/legal/merchant-services",
  "/legal/fees": "/company/legal/fees",
  "/legal/payouts-and-reserves": "/company/legal/payouts-and-reserves",
  "/legal/acceptable-use": "/company/legal/acceptable-use",
  "/legal/software-platforms": "/company/legal/software-platforms",
  "/legal/acquirer-disclosure": "/company/legal/acquirer-disclosure",
  "/legal/merchant-privacy": "/company/legal/merchant-privacy",
  "/legal/data-processing": "/company/legal/data-processing",
  "/legal/security-policy": "/company/legal/security-policy"
};

/** Map trusted content links while retaining section references. External URLs are unchanged. */
export function currentPublicHref(href:string):string {
  const split=href.search(/[?#]/);
  const path=split<0?href:href.slice(0,split);
  const suffix=split<0?"":href.slice(split);
  const reference=/^\/guides\/iso-(?:20022|8583)(?:\/|$)/.test(path);
  return (CORE_PAGE_MOVES[path] ?? (reference?`/resources${path}`:path))+suffix;
}

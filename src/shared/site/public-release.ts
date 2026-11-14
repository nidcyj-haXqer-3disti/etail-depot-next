import targets from "../../../project-targets.json" with { type: "json" };

function boundCanonicalOrigin(): string {
  const raw = targets.netlify.canonical_origin;
  const parsed = new URL(raw);
  if (targets.project_key !== "ETAIL_DEPOT_NEXT_GREENFIELD_2026" || !targets.netlify.site_id ||
      parsed.protocol !== "https:" || parsed.origin !== raw || parsed.username || parsed.password ||
      targets.denied.netlify_site_ids.includes(targets.netlify.site_id) || targets.denied.domains.includes(parsed.hostname)) {
    throw new Error("Public metadata requires the recorded, isolated canonical site binding.");
  }
  return parsed.origin;
}
export const canonicalOrigin = boundCanonicalOrigin();
/** Only the recorded production subdomain redirects; preview/deploy URLs stay independent. */
export const defaultOrigin = targets.netlify.default_origin;
if (defaultOrigin !== `https://${targets.netlify.site_name}.netlify.app` || defaultOrigin === canonicalOrigin) {
  throw new Error("The public domain redirect requires the recorded production subdomain.");
}

export interface SearchReleaseApproval {
  siteId: string;
  canonicalOrigin: string;
  reviewReference: string;
}
/** Exact candidate preparation approval; publication still requires a separate release action. */
export const PUBLIC_INDEXING_APPROVAL: SearchReleaseApproval = {
  siteId: "cbbb6c24-9dbc-43a2-9234-e4357b5b5280",
  canonicalOrigin: "https://etaildepot.com",
  reviewReference: "2026-11-05: the user authorizes targeted merchant legal corrections and removal of the ten page local publication hold. The user also requested the Shopify gateway integration resource on 5 November 2026. The user requested a local WooCommerce integration guide on 7 November 2026. On 8 November 2026 the user authorized consolidating documentation within the planned Developers pages and moving Merchant account setup into Resources. All eight Developers pages remain noindex while Etail APIs and tools are coming soon. The local candidate contains 3764 content pages and 3731 search eligible URLs. All twelve legal and website policy pages remain noindex. On 14 November 2026 the user requested the saved No code checkout experience draft under Use cases. It remains noindex while provider setup is pending. On 14 November 2026 the user supplied the first Etail Depot Blog article. The user then supplied ten further articles, including the Riverside Payments article with its comparison table and source links, the payment processing decline article, the payment provider approval article, the PayFac operations article and the merchant cancellation article. These five supplied documents are dated 12 November. The Company Blog and all eleven articles remain noindex pending publication review of the restored original copy and separately recorded editorial concerns; the earlier six articles still lack confirmed publication dates. Exact legal sources and their content hashes are recorded in tools/reference-release.json. Account agreement acceptance, provider approval and activation remain separate from website publication. Reference data and the exact production indexing guard are unchanged. This authorizes local release preparation, not a push, merge or deployment.",
};
export type Environment = Readonly<Record<string, string | undefined>>;

/** Pure guard for release review/tests; request URLs, forwarded hosts and search parameters are never inputs. */
export function isApprovedSearchRelease(approval: SearchReleaseApproval | null, env: Environment): boolean {
  return Boolean(approval && approval.siteId === targets.netlify.site_id && approval.canonicalOrigin === canonicalOrigin &&
    approval.reviewReference.trim() && env.NODE_ENV === "production" && env.APP_ENV === "production" &&
    env.ETAIL_SEARCH_CONTEXT === "production" && (!env.CONTEXT || env.CONTEXT === "production") &&
    env.SITE_ID === targets.netlify.site_id && env.ETAIL_PUBLIC_ORIGIN === canonicalOrigin);
}

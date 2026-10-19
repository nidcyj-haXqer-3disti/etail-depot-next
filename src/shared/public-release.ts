import targets from "../../project-targets.json" with { type: "json" };

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
/** D215 binds the D122 search release; D228/D250 prepare the exact approved merchant guide routes. */
export const PUBLIC_INDEXING_APPROVAL: SearchReleaseApproval = {
  siteId: "cbbb6c24-9dbc-43a2-9234-e4357b5b5280",
  canonicalOrigin: "https://etaildepot.com",
  reviewReference: "D215 — user authorization to move the public website to etaildepot.com, 2026-10-14; preserves D122 safeguards. D228 — user-approved local preparation of Stripe alternatives, payment processing systems and chargeback guides, 2026-10-19; D250 adds the approved payment-link guide locally; publication and search submissions remain separate",
};
export type Environment = Readonly<Record<string, string | undefined>>;

/** Pure guard for release review/tests; request URLs, forwarded hosts and search parameters are never inputs. */
export function isApprovedSearchRelease(approval: SearchReleaseApproval | null, env: Environment): boolean {
  return Boolean(approval && approval.siteId === targets.netlify.site_id && approval.canonicalOrigin === canonicalOrigin &&
    approval.reviewReference.trim() && env.NODE_ENV === "production" && env.APP_ENV === "production" &&
    env.ETAIL_SEARCH_CONTEXT === "production" && (!env.CONTEXT || env.CONTEXT === "production") &&
    env.SITE_ID === targets.netlify.site_id && env.ETAIL_PUBLIC_ORIGIN === canonicalOrigin);
}

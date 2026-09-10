import targets from "../../../project-targets.json" with { type: "json" };
import { getRuntimeConfig } from "../../platform/config";
import { SecurityError } from "../../platform/security/origin";
import type { NetlifyIdentityConfiguration } from "./adapters/netlify";

type Environment = Readonly<Record<string, string | undefined>>;
export function getPasswordIdentityConfiguration(env: Environment = process.env): NetlifyIdentityConfiguration {
  const config = getRuntimeConfig(env);
  const providerOrigin = targets.netlify.canonical_origin;
  if (!targets.netlify.site_id || !providerOrigin || targets.denied.netlify_site_ids.includes(targets.netlify.site_id) || targets.denied.domains.includes(new URL(providerOrigin).hostname)) throw new SecurityError("IDENTITY_NOT_CONFIGURED", 503);
  const common = { appEnv: config.appEnv, publicOrigin: config.publicOrigin, identityEndpoint: `${providerOrigin}/.netlify/identity`, expectedSiteId: targets.netlify.site_id, providerOrigin };
  if (env.APP_ENV === "local" && env.ETAIL_PUBLIC_ORIGIN && config.appEnv === "local" && (!env.CI || env.CI === "false") && !env.NETLIFY && !env.SITE_ID && !env.CONTEXT) {
    return { ...common, runtimeSiteId: null, localRemoteProvider: true };
  }
  // Only the approved canonical deployment can use production Identity. Branch and
  // deploy-preview functions must not borrow its credentials or session database.
  if (env.APP_ENV !== "production" || config.appEnv !== "production" || env.NETLIFY !== "true" || env.CONTEXT !== "production" || env.SITE_ID !== targets.netlify.site_id || env.ETAIL_PUBLIC_ORIGIN !== providerOrigin || env.ENABLE_REAL_MONEY !== "false" || env.ENABLE_LOCAL_FIXTURE_IDENTITY !== "false" || (env.CI && env.CI !== "false")) {
    throw new SecurityError("HOSTED_IDENTITY_NOT_READY", 503);
  }
  return { ...common, runtimeSiteId: env.SITE_ID, localRemoteProvider: false };
}

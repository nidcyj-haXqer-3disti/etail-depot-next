import targets from "../../../project-targets.json" with { type: "json" };
import { getContext } from "@netlify/functions";
import { getRuntimeConfig } from "../../platform/config";
import { SecurityError } from "../../platform/security/origin";
import type { NetlifyIdentityConfiguration } from "./adapters/netlify";

type Environment = Readonly<Record<string, string | undefined>>;
type HostedRequestContext = { site: { id?: string }; deploy: { context: string } };
export function getPasswordIdentityConfiguration(env: Environment = process.env, runtimeContext: () => HostedRequestContext = getContext): NetlifyIdentityConfiguration {
  const config = getRuntimeConfig(env);
  const providerOrigin = targets.netlify.canonical_origin;
  if (!targets.netlify.site_id || !providerOrigin || targets.denied.netlify_site_ids.includes(targets.netlify.site_id) || targets.denied.domains.includes(new URL(providerOrigin).hostname)) throw new SecurityError("IDENTITY_NOT_CONFIGURED", 503);
  const common = { appEnv: config.appEnv, publicOrigin: config.publicOrigin, identityEndpoint: `${providerOrigin}/.netlify/identity`, expectedSiteId: targets.netlify.site_id, providerOrigin };
  if (env.APP_ENV === "local" && env.ETAIL_PUBLIC_ORIGIN && config.appEnv === "local" && (!env.CI || env.CI === "false") && !env.NETLIFY && !env.SITE_ID && !env.CONTEXT) {
    return { ...common, runtimeSiteId: null, localRemoteProvider: true };
  }
  // NETLIFY and CONTEXT are build variables, not function-runtime guarantees.
  // Verify the actual request's deployment context instead of copying those flags.
  if (env.APP_ENV !== "production" || config.appEnv !== "production" || env.SITE_ID !== targets.netlify.site_id || env.ETAIL_PUBLIC_ORIGIN !== providerOrigin || env.ENABLE_REAL_MONEY !== "false" || env.ENABLE_LOCAL_FIXTURE_IDENTITY !== "false" || (env.CI && env.CI !== "false")) {
    throw new SecurityError("HOSTED_IDENTITY_NOT_READY", 503);
  }
  let context: HostedRequestContext;
  try { context = runtimeContext(); }
  catch { throw new SecurityError("HOSTED_IDENTITY_NOT_READY", 503); }
  // Branch and deploy-preview functions must not borrow production credentials,
  // even if someone supplied matching environment values to those deployments.
  if (context.site?.id !== targets.netlify.site_id || context.deploy?.context !== "production") throw new SecurityError("HOSTED_IDENTITY_NOT_READY", 503);
  return { ...common, runtimeSiteId: context.site.id, localRemoteProvider: false };
}

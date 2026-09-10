import targets from "../../../project-targets.json" with { type: "json" };
import { getRuntimeConfig } from "../../platform/config";
import { SecurityError } from "../../platform/security/origin";
import type { NetlifyIdentityConfiguration } from "./adapters/netlify";

type Environment = Readonly<Record<string, string | undefined>>;
export function getPasswordIdentityConfiguration(env: Environment = process.env): NetlifyIdentityConfiguration {
  const config = getRuntimeConfig(env);
  const providerOrigin = targets.netlify.canonical_origin;
  if (!targets.netlify.site_id || !providerOrigin || targets.denied.netlify_site_ids.includes(targets.netlify.site_id) || targets.denied.domains.includes(new URL(providerOrigin).hostname)) throw new SecurityError("IDENTITY_NOT_CONFIGURED", 503);
  // This change enables real remote-provider credentials from the isolated local app.
  // Hosted release and CI remain separate; neither can adopt local fixture privileges.
  if (env.APP_ENV !== "local" || !env.ETAIL_PUBLIC_ORIGIN || config.appEnv !== "local" || (env.CI && env.CI !== "false") || env.NETLIFY || env.SITE_ID || env.CONTEXT) throw new SecurityError("HOSTED_IDENTITY_NOT_READY", 503);
  return { appEnv: config.appEnv, publicOrigin: config.publicOrigin, identityEndpoint: `${providerOrigin}/.netlify/identity`, expectedSiteId: targets.netlify.site_id, runtimeSiteId: null, providerOrigin, localRemoteProvider: true };
}

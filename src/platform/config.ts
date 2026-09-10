import targets from "../../project-targets.json" with { type: "json" };
import { assertTrustedOrigin, SecurityError, type AppEnvironment } from "./security/origin";

export const ENABLE_REAL_MONEY = false as const;

export function getRuntimeConfig(env: Readonly<Record<string,string|undefined>> = process.env) {
  const appEnv = env.APP_ENV ?? "local";
  if (!["local", "test", "preview", "production"].includes(appEnv)) throw new SecurityError("INVALID_APP_ENV", 503);
  if (env.ENABLE_REAL_MONEY && env.ENABLE_REAL_MONEY !== "false") throw new SecurityError("REAL_MONEY_DISABLED", 503);
  const isolated = appEnv === "local" || appEnv === "test";
  const publicOrigin = assertTrustedOrigin(env.ETAIL_PUBLIC_ORIGIN ?? (isolated ? "http://127.0.0.1:3000" : ""), appEnv as AppEnvironment);
  const netlifyRuntime = !!(env.NETLIFY || env.SITE_ID || env.CONTEXT);
  if (netlifyRuntime && isolated) throw new SecurityError("HOSTED_ENVIRONMENT_REQUIRED", 503);
  if (!isolated && (!targets.netlify.site_id || env.SITE_ID !== targets.netlify.site_id || targets.denied.netlify_site_ids.includes(env.SITE_ID ?? ""))) {
    throw new SecurityError("NEW_SITE_BINDING_REQUIRED", 503);
  }
  if (!isolated && publicOrigin !== targets.netlify.canonical_origin) throw new SecurityError("BOUND_ORIGIN_REQUIRED", 503);
  return {
    appEnv: appEnv as AppEnvironment, publicOrigin, netlifyRuntime,
    localFixtureIdentity: isolated && !netlifyRuntime && env.ENABLE_LOCAL_FIXTURE_IDENTITY === "true",
    // A flag cannot enable an incomplete hosted authentication lifecycle.
    hostedIdentityReady: false as const,
    realMoney: ENABLE_REAL_MONEY,
  };
}

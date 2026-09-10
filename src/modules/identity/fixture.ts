import { assertTrustedOrigin, SecurityError, type AppEnvironment } from "../../platform/security/origin";

export interface FixtureIdentityContext {
  appEnv: AppEnvironment;
  publicOrigin: string;
  fixtureIdentityEnabled: boolean;
  netlifyRuntime: boolean;
}

/** Fixture login is explicitly isolated and can never be enabled on a Netlify deploy. */
export function assertFixtureIdentityAllowed(context: FixtureIdentityContext): void {
  if (
    !context.fixtureIdentityEnabled || context.netlifyRuntime ||
    (context.appEnv !== "local" && context.appEnv !== "test")
  ) throw new SecurityError("FIXTURE_IDENTITY_DISABLED", 404);
  assertTrustedOrigin(context.publicOrigin, context.appEnv);
}

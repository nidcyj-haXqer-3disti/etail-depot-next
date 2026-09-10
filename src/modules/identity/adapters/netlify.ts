import { getIdentityConfig, type IdentityConfig } from "@netlify/identity";
import { assertTrustedOrigin, SecurityError, type AppEnvironment } from "../../../platform/security/origin";

export interface VerifiedIdentity {
  issuer: string;
  subject: string;
  emailVerified: true;
}

export interface NetlifyIdentityConfiguration {
  appEnv: AppEnvironment;
  publicOrigin: string;
  identityEndpoint: string | null;
  expectedSiteId: string | null;
  runtimeSiteId: string | null;
}

export interface IdentityConfigurationStatus {
  configured: boolean;
  reason: "CONFIGURED" | "IDENTITY_NOT_CONFIGURED" | "IDENTITY_TARGET_MISMATCH";
}

/**
 * Server-only provider adapter. The pinned SDK's login writes non-HttpOnly JWT and
 * refresh cookies, so only its runtime discovery API is used here. The documented
 * GoTrue password exchange and /user verification keep provider tokens in memory
 * on this server. No provider session is persisted or returned to the browser.
 *
 * This is a compatibility boundary, not a complete hosted auth lifecycle. The
 * application must keep hosted signup/login unavailable until release gates pass.
 */
export class NetlifyIdentityAdapter {
  constructor(
    private readonly configuration: () => NetlifyIdentityConfiguration,
    private readonly fetcher: typeof fetch = fetch,
    private readonly runtimeIdentity: () => IdentityConfig | null = getIdentityConfig,
  ) {}

  private endpoint(): string {
    const config = this.configuration();
    if (!config.identityEndpoint || !config.expectedSiteId || !config.runtimeSiteId) {
      throw new SecurityError("IDENTITY_NOT_CONFIGURED", 503);
    }
    const publicOrigin = assertTrustedOrigin(config.publicOrigin, config.appEnv);
    if (config.appEnv === "local" || config.appEnv === "test") {
      throw new SecurityError("IDENTITY_TARGET_MISMATCH", 503);
    }
    const expectedEndpoint = `${publicOrigin}/.netlify/identity`;
    const runtime = this.runtimeIdentity();
    if (
      config.expectedSiteId !== config.runtimeSiteId ||
      config.identityEndpoint !== expectedEndpoint ||
      runtime?.url !== expectedEndpoint
    ) throw new SecurityError("IDENTITY_TARGET_MISMATCH", 503);
    return expectedEndpoint;
  }

  /** This is configuration presence only; it does not claim service reachability. */
  configurationStatus(): IdentityConfigurationStatus {
    try {
      this.endpoint();
      return { configured: true, reason: "CONFIGURED" };
    } catch (error) {
      return {
        configured: false,
        reason: error instanceof SecurityError && error.code === "IDENTITY_NOT_CONFIGURED"
          ? "IDENTITY_NOT_CONFIGURED" : "IDENTITY_TARGET_MISMATCH",
      };
    }
  }

  private async request(url: string, init: RequestInit): Promise<Record<string, unknown>> {
    let response: Response;
    try {
      response = await this.fetcher(url, {
        ...init,
        redirect: "error",
        cache: "no-store",
        credentials: "omit",
        referrerPolicy: "no-referrer",
        signal: AbortSignal.timeout(5_000),
      });
    } catch {
      // Never attach provider errors, bodies, request URLs or credentials as causes.
      throw new SecurityError("IDENTITY_UNAVAILABLE", 503);
    }
    if (!response.ok) {
      if ([400, 401, 403, 404, 422].includes(response.status)) {
        throw new SecurityError("INVALID_CREDENTIALS", 401);
      }
      throw new SecurityError("IDENTITY_UNAVAILABLE", 503);
    }
    try {
      const value: unknown = await response.json();
      if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error();
      return value as Record<string, unknown>;
    } catch {
      throw new SecurityError("IDENTITY_INVALID_RESPONSE", 503);
    }
  }

  /** Requires route-level CSRF, durable rate limiting and a hosted readiness gate. */
  async verifyPassword(email: string, password: string): Promise<VerifiedIdentity> {
    const endpoint = this.endpoint();
    if (
      !email || email.length > 254 || !email.includes("@") ||
      password.length < 12 || password.length > 1_024
    ) throw new SecurityError("INVALID_CREDENTIALS", 401);
    const tokens = await this.request(`${endpoint}/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ grant_type: "password", username: email, password }).toString(),
    });
    const accessToken = tokens.access_token;
    if (typeof accessToken !== "string" || !/^[A-Za-z0-9._~-]{1,8192}$/.test(accessToken)) {
      throw new SecurityError("IDENTITY_INVALID_RESPONSE", 503);
    }
    const user = await this.request(`${endpoint}/user`, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (
      typeof user.id !== "string" || !/^[A-Za-z0-9_-]{1,256}$/.test(user.id) ||
      typeof user.confirmed_at !== "string" || !Number.isFinite(Date.parse(user.confirmed_at))
    ) throw new SecurityError("INVALID_CREDENTIALS", 401);
    // No email linkage and no provider roles/user_metadata are carried across.
    return { issuer: endpoint, subject: user.id, emailVerified: true };
  }
}

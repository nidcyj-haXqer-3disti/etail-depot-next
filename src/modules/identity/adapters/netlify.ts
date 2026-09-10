import { getIdentityConfig, type IdentityConfig } from "@netlify/identity";
import { assertTrustedOrigin, SecurityError, type AppEnvironment } from "../../../platform/security/origin";

export interface VerifiedIdentity { issuer: string; subject: string; providerConfirmed: true }
export interface NetlifyIdentityConfiguration {
  appEnv: AppEnvironment;
  publicOrigin: string;
  identityEndpoint: string | null;
  expectedSiteId: string | null;
  runtimeSiteId: string | null;
  /** Recorded provider origin; independent of the local application's loopback origin. */
  providerOrigin?: string;
  /** Set only by the isolated local configuration factory, never browser input. */
  localRemoteProvider?: boolean;
}
export interface IdentityConfigurationStatus { configured: boolean; reason: "CONFIGURED" | "IDENTITY_NOT_CONFIGURED" | "IDENTITY_TARGET_MISMATCH" }
export interface PasswordLoginAvailability { available: boolean; reason: "AVAILABLE" | "NOT_CONFIGURED" | "UNAVAILABLE" }
export interface EmailAuthenticationAvailability extends PasswordLoginAvailability { registrationAvailable: boolean }

/**
 * @netlify/identity discovers the hosted issuer. Its login sets non-HttpOnly JWT
 * and refresh cookies, so the documented password exchange and /user verification
 * stay inside this server adapter instead. Only verified issuer/subject leave it.
 * Local mode contacts the one recorded remote provider, never a fake credential store.
 */
export class NetlifyIdentityAdapter {
  constructor(
    private readonly configuration: () => NetlifyIdentityConfiguration,
    private readonly fetcher: typeof fetch = fetch,
    private readonly runtimeIdentity: () => IdentityConfig | null = getIdentityConfig,
  ) {}

  private endpoint(): string {
    const config = this.configuration();
    if (!config.identityEndpoint || !config.expectedSiteId) throw new SecurityError("IDENTITY_NOT_CONFIGURED", 503);
    const publicOrigin = assertTrustedOrigin(config.publicOrigin, config.appEnv);
    const providerOrigin = config.providerOrigin ?? publicOrigin;
    assertTrustedOrigin(providerOrigin, "production");
    const expectedEndpoint = `${providerOrigin}/.netlify/identity`;
    const runtime = this.runtimeIdentity();
    if (config.identityEndpoint !== expectedEndpoint) throw new SecurityError("IDENTITY_TARGET_MISMATCH", 503);
    if (config.localRemoteProvider === true) {
      // The factory additionally rejects CI and every hosted runtime indicator.
      if (config.appEnv !== "local" || config.runtimeSiteId !== null || (runtime && runtime.url !== expectedEndpoint)) throw new SecurityError("IDENTITY_TARGET_MISMATCH", 503);
      return expectedEndpoint;
    }
    if (config.appEnv === "local" || config.appEnv === "test" || !config.runtimeSiteId || config.expectedSiteId !== config.runtimeSiteId || publicOrigin !== providerOrigin || runtime?.url !== expectedEndpoint) {
      throw new SecurityError("IDENTITY_TARGET_MISMATCH", 503);
    }
    return expectedEndpoint;
  }

  configurationStatus(): IdentityConfigurationStatus {
    try { this.endpoint(); return { configured: true, reason: "CONFIGURED" }; }
    catch (error) { return { configured: false, reason: error instanceof SecurityError && error.code === "IDENTITY_NOT_CONFIGURED" ? "IDENTITY_NOT_CONFIGURED" : "IDENTITY_TARGET_MISMATCH" }; }
  }

  private async request(url: string, init: RequestInit, credentialsRequest = false, invalidToken = false, registration = false): Promise<Record<string, unknown>> {
    let response: Response;
    try {
      response = await this.fetcher(url, { ...init, redirect: "error", cache: "no-store", credentials: "omit", referrerPolicy: "no-referrer", signal: AbortSignal.timeout(5_000) });
    } catch { throw new SecurityError("IDENTITY_UNAVAILABLE", 503); }
    if (!response.ok) {
      if (registration && response.status === 400) {
        const error = await this.responseBody(response);
        if (error.msg === "A user with this email address has already been registered") return { registrationDuplicate: true };
      }
      if (response.status === 429) throw new SecurityError("SIGN_IN_RATE_LIMITED", 429);
      if (invalidToken && [400, 401, 403, 404, 422].includes(response.status)) throw new SecurityError("INVALID_EMAIL_LINK", 401);
      if (credentialsRequest && [400, 401, 403, 422].includes(response.status)) throw new SecurityError("INVALID_CREDENTIALS", 401);
      throw new SecurityError("IDENTITY_UNAVAILABLE", 503);
    }
    return this.responseBody(response);
  }

  private async responseBody(response: Response): Promise<Record<string, unknown>> {
    // Bound upstream data too; no provider body/error is logged or attached as a cause.
    const reader = response.body?.getReader();
    if (!reader) throw new SecurityError("IDENTITY_INVALID_RESPONSE", 503);
    const chunks: Uint8Array[] = []; let length = 0;
    try {
      for (;;) {
        const { value, done } = await reader.read(); if (done) break;
        length += value.length;
        if (length > 65_536) { await reader.cancel(); throw new Error(); }
        chunks.push(value);
      }
      const parsed: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8"));
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
      return parsed as Record<string, unknown>;
    } catch { throw new SecurityError("IDENTITY_INVALID_RESPONSE", 503); }
  }

  async passwordLoginAvailability(): Promise<PasswordLoginAvailability> {
    const { available, reason } = await this.emailAuthenticationAvailability();
    return { available, reason };
  }

  async emailAuthenticationAvailability(): Promise<EmailAuthenticationAvailability> {
    if (!this.configurationStatus().configured) return { available: false, reason: "NOT_CONFIGURED", registrationAvailable: false };
    try {
      const settings = await this.request(`${this.endpoint()}/settings`, { method: "GET" });
      const external = settings.external;
      if (!external || typeof external !== "object" || Array.isArray(external) || (external as Record<string, unknown>).email !== true) return { available: false, reason: "NOT_CONFIGURED", registrationAvailable: false };
      return { available: true, reason: "AVAILABLE", registrationAvailable: settings.disable_signup === false && settings.autoconfirm === false };
    } catch { return { available: false, reason: "UNAVAILABLE", registrationAvailable: false }; }
  }

  /** Registration never binds a Person or issues an application session. */
  async register(email: string, password: string): Promise<void> {
    const endpoint = this.endpoint();
    if (!(await this.emailAuthenticationAvailability()).registrationAvailable) throw new SecurityError("EMAIL_CONFIRMATION_REQUIRED", 503);
    if (!email || email.length > 254 || !email.includes("@") || password.length < 12 || password.length > 1024) throw new SecurityError("INVALID_REGISTRATION", 422);
    let user: Record<string, unknown>;
    try {
      user = await this.request(`${endpoint}/signup`, { method: "POST", headers: { "Content-Type": "application/json", Referer: `${new URL(endpoint).origin}/login` }, body: JSON.stringify({ email, password }) }, true, false, true);
    } catch (error) {
      // Existing email and invalid registration have one public response, without upstream user data.
      if (error instanceof SecurityError && error.code === "INVALID_CREDENTIALS") throw new SecurityError("REGISTRATION_NOT_COMPLETED", 422);
      throw error;
    }
    if (user.registrationDuplicate === true) return;
    if (user.confirmed_at || user.access_token || typeof user.confirmation_sent_at !== "string" || !Number.isFinite(Date.parse(user.confirmation_sent_at))) throw new SecurityError("EMAIL_CONFIRMATION_REQUIRED", 503);
  }

  async requestRecovery(email: string): Promise<void> {
    const endpoint = this.endpoint();
    if (!email || email.length > 254 || !email.includes("@")) throw new SecurityError("INVALID_REQUEST", 422);
    await this.request(`${endpoint}/recover`, { method: "POST", headers: { "Content-Type": "application/json", Referer: `${new URL(endpoint).origin}/login` }, body: JSON.stringify({ email }) });
  }

  async confirmEmail(token: string): Promise<void> {
    const endpoint = this.endpoint();
    const accessToken = await this.redeemEmailToken(endpoint, "signup", token);
    await this.verifiedUser(endpoint, accessToken);
    // The user must still sign in with their password. A link cannot switch the browser's app identity.
  }

  async resetPassword(token: string, password: string, beforeChange: (identity: VerifiedIdentity) => Promise<void>, afterChange: () => Promise<void>): Promise<void> {
    const endpoint = this.endpoint();
    if (password.length < 12 || password.length > 1024) throw new SecurityError("INVALID_REGISTRATION", 422);
    const accessToken = await this.redeemEmailToken(endpoint, "recovery", token);
    const identity = await this.verifiedUser(endpoint, accessToken);
    // Revoke existing app sessions before changing the provider password. Failure stops the change.
    await beforeChange(identity);
    const updated = await this.request(`${endpoint}/user`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` }, body: JSON.stringify({ password }) }, true);
    if (updated.id !== identity.subject) throw new SecurityError("IDENTITY_INVALID_RESPONSE", 503);
    // No callback on timeout, rejected response or ambiguous body: the persisted block remains.
    await afterChange();
  }

  private async redeemEmailToken(endpoint: string, type: "signup" | "recovery", token: string): Promise<string> {
    if (!/^[A-Za-z0-9_-]{1,2048}$/.test(token)) throw new SecurityError("INVALID_EMAIL_LINK", 401);
    const response = await this.request(`${endpoint}/verify`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type, token }) }, false, true);
    return this.accessToken(response);
  }

  private accessToken(tokens: Record<string, unknown>): string {
    const token = tokens.access_token;
    if (typeof token !== "string" || !/^[A-Za-z0-9._~-]{1,8192}$/.test(token)) throw new SecurityError("IDENTITY_INVALID_RESPONSE", 503);
    return token;
  }

  private async verifiedUser(endpoint: string, accessToken: string): Promise<VerifiedIdentity> {
    const user = await this.request(`${endpoint}/user`, { method: "GET", headers: { Authorization: `Bearer ${accessToken}` } }, true);
    if (typeof user.id !== "string" || !/^[A-Za-z0-9_-]{1,256}$/.test(user.id) || typeof user.confirmed_at !== "string" || !Number.isFinite(Date.parse(user.confirmed_at))) throw new SecurityError("INVALID_CREDENTIALS", 401);
    // This is provider confirmation, not KYC or independent proof of a formerly auto-confirmed email.
    return { issuer: endpoint, subject: user.id, providerConfirmed: true };
  }

  /** Existing passwords are verified by the provider; enrollment password-strength rules do not apply at login. */
  async verifyPassword(email: string, password: string): Promise<VerifiedIdentity> {
    const endpoint = this.endpoint();
    if (!email || email.length > 254 || !email.includes("@") || !password || password.length > 1_024) throw new SecurityError("INVALID_CREDENTIALS", 401);
    const tokens = await this.request(`${endpoint}/token`, {
      method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ grant_type: "password", username: email, password }).toString(),
    }, true);
    return this.verifiedUser(endpoint, this.accessToken(tokens));
  }
}

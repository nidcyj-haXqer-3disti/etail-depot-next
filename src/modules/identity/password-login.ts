import { NetlifyIdentityAdapter, type PasswordLoginAvailability, type EmailAuthenticationAvailability, type VerifiedIdentity } from "./adapters/netlify";
import { getPasswordIdentityConfiguration } from "./password-configuration";
import { passwordAttemptLimiter, type LoginAttemptLimiter } from "./password-throttle";
import type { SessionService } from "./session";
import { bindIdentity } from "../services/service";
import { SecurityError } from "../../platform/security/origin";
import { withPasswordAuthentication } from "./password-boundary";
import { passwordResetRepository, type PasswordResetAttempt } from "../../platform/database/session-repository";

interface PasswordVerifier { passwordLoginAvailability(): Promise<PasswordLoginAvailability>; verifyPassword(email: string, password: string): Promise<VerifiedIdentity> }
interface PasswordLoginDependencies {
  provider: PasswordVerifier;
  limiter: LoginAttemptLimiter;
  bind: (issuer: string, subject: string) => Promise<{ identityId: string; personId: string }>;
  sessions: Pick<SessionService, "logout" | "issue">;
}
/** One orchestration; provider identity never selects a fixture persona, role or service. */
export async function signInWithPassword(email: string, password: string, cookie: string | null, dependencies: PasswordLoginDependencies): Promise<string> {
  // A durable budget is consumed before any outbound credential request, including failed attempts.
  await dependencies.limiter.consume(email);
  if (!(await dependencies.provider.passwordLoginAvailability()).available) throw new SecurityError("IDENTITY_UNAVAILABLE", 503);
  const verified = await dependencies.provider.verifyPassword(email, password);
  if (!verified.providerConfirmed || !verified.issuer || !verified.subject || verified.issuer === "urn:etail:isolated-fixture") throw new SecurityError("INVALID_VERIFIED_IDENTITY", 401);
  const identity = await dependencies.bind(verified.issuer, verified.subject);
  await dependencies.sessions.logout(cookie);
  const issued = await dependencies.sessions.issue(identity);
  return issued.cookie;
}
function provider() { return new NetlifyIdentityAdapter(() => getPasswordIdentityConfiguration()); }
export async function getPasswordLoginAvailability(): Promise<EmailAuthenticationAvailability> {
  try { getPasswordIdentityConfiguration(); return await provider().emailAuthenticationAvailability(); }
  catch { return { available: false, reason: "NOT_CONFIGURED", registrationAvailable: false }; }
}

export async function registerWithPassword(email: string, password: string): Promise<void> {
  getPasswordIdentityConfiguration();
  await passwordAttemptLimiter.consume(email);
  await provider().register(email, password);
}
export async function requestPasswordRecovery(email: string): Promise<void> {
  getPasswordIdentityConfiguration();
  await passwordAttemptLimiter.consume(email);
  await provider().requestRecovery(email);
}
export async function confirmEmailLink(token: string): Promise<void> {
  getPasswordIdentityConfiguration();
  await passwordAttemptLimiter.consume(`email-confirmation:${token}`);
  await provider().confirmEmail(token);
}
export async function resetPasswordFromLink(token: string, password: string): Promise<void> {
  getPasswordIdentityConfiguration();
  await withPasswordAuthentication(async () => {
    await passwordAttemptLimiter.consume(`password-recovery:${token}`);
    let attempt: PasswordResetAttempt | null = null;
    await provider().resetPassword(token, password, async verified => {
      const identity = await bindIdentity(verified.issuer, verified.subject);
      attempt = await passwordResetRepository.begin(identity.identityId);
    }, async () => {
      if (!attempt) throw new SecurityError("PASSWORD_RESET_PENDING", 409);
      await passwordResetRepository.complete(attempt);
    });
  });
}
export async function passwordLogin(email: string, password: string, cookie: string | null, sessions: PasswordLoginDependencies["sessions"]): Promise<string> {
  getPasswordIdentityConfiguration();
  return withPasswordAuthentication(() => signInWithPassword(email, password, cookie, { provider: provider(), limiter: passwordAttemptLimiter, bind: bindIdentity, sessions }));
}

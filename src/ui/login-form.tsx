"use client";

import { useEffect, useRef, useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { EmailAuthenticationAvailability } from "@/modules/identity/adapters/netlify";
import { Icon } from "./icon";
import { parseEmailLink, takeEmailLink, type EmailLink } from "./identity-email-link";

type Mode = "login" | "register" | "confirm" | "recover" | "reset";
const titles: Record<Mode, string> = { login: "Sign in with email", register: "Create your login", confirm: "Confirm your email", recover: "Reset your password", reset: "Choose a new password" };
const actions: Record<Mode, string> = { login: "Sign in", register: "Create login", confirm: "Confirm email", recover: "Send reset email", reset: "Save new password" };

export function LoginForm({ localFixtureIdentity, localEmailLinkBridge, emailSignIn, providerOrigin }: { localFixtureIdentity: boolean; localEmailLinkBridge: boolean; emailSignIn: EmailAuthenticationAvailability; providerOrigin: string }) {
  const router = useRouter();
  const [checking, startChecking] = useTransition();
  const [pending, setPending] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("login");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [linkReady, setLinkReady] = useState(false);
  const emailLink = useRef<EmailLink | null>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => { if (error) errorRef.current?.focus(); }, [error]);
  useEffect(() => {
    const pendingLink = takeEmailLink();
    if (!pendingLink && !window.location.hash) return;
    const link = pendingLink?.kind === "invalid" ? null : pendingLink ?? parseEmailLink(window.location.hash, providerOrigin, true);
    // Fragments never reach the server. Remove them before any auth request or navigation.
    window.history.replaceState(window.history.state, "", `${window.location.pathname}${window.location.search}`);
    queueMicrotask(() => {
      if (!link) { setError("This email link is not supported. Copy the confirmation or reset link from your latest email."); return; }
      emailLink.current = link; setLinkReady(true); setMode(link.kind === "confirmation" ? "confirm" : "reset"); setNotice("Your email link is ready. Continue below."); titleRef.current?.focus();
    });
  }, [providerOrigin]);

  function changeMode(next: Mode) { emailLink.current = null; setLinkReady(false); setMode(next); setError(""); setNotice(""); }

  async function submit(path: string, body: Record<string, string>, operation: string) {
    setPending(operation); setError(""); setNotice("");
    try {
      const response = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin", body: JSON.stringify(body) });
      if (!response.ok) {
        const failure: unknown = await response.json().catch(() => null);
        const resetPending = !!failure && typeof failure === "object" && "error" in failure && !!failure.error && typeof failure.error === "object" && "code" in failure.error && failure.error.code === "PASSWORD_RESET_PENDING";
        setError(resetPending ? "Your password change needs review before you can sign in. Contact the site owner. A new reset email cannot clear this block." : response.status === 409 ? "Another sign-in or password change is in progress. Please try again shortly." : operation === "reset" ? "We could not confirm the password change. Request a new reset email. If review is required, contact the site owner before trying to sign in." : response.status === 429 ? "There have been too many attempts. Please wait 15 minutes before trying again." : response.status === 401 ? operation === "login" ? "Your email or password could not be verified. Check your details and try again." : "This email link is invalid or has expired. Request a new email and try again." : operation === "register" && response.status === 422 ? "We could not create this login. Try signing in, or reset your password if you have registered before." : response.status === 503 ? "Email access is temporarily unavailable. Please try again shortly." : "We could not complete this request. Please try again.");
        return;
      }
      const result: unknown = await response.json();
      const field = operation === "register" ? "registrationRequested" : operation === "confirm" ? "confirmed" : operation === "recover" ? "recoveryRequested" : operation === "reset" ? "passwordReset" : "authenticated";
      if (!result || typeof result !== "object" || !(field in result) || (result as Record<string, unknown>)[field] !== true) { setError("We could not confirm the result. Please try again."); return; }
      if (field === "authenticated") { router.replace("/services"); router.refresh(); return; }
      emailLink.current = null; setLinkReady(false);
      if (operation === "register") { setMode("confirm"); setNotice(localEmailLinkBridge ? "Check your inbox, or sign in if you already registered. For this local preview, open the confirmation link and copy the final page address below." : "Check your inbox and open the confirmation link to continue. If you already registered, return to sign in."); }
      if (operation === "recover") { setMode("reset"); setNotice(localEmailLinkBridge ? "If this email has a login, a reset email has been requested. Open its link, then copy the final page address below for this local preview." : "If this email has a login, a reset email has been requested. Open its link to choose your new password."); }
      if (operation === "confirm") { setMode("login"); setNotice("Your email is confirmed. Sign in with your email and password."); }
      if (operation === "reset") { setMode("login"); setNotice("Your password has been changed and previous sessions signed out. Sign in with your new password."); }
    } catch { setError(operation === "reset" ? "We could not confirm the password change. Request a new reset email. If review is required, contact the site owner before trying to sign in." : "We could not connect. Check your connection and try again."); }
    finally { setPending(null); }
  }

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = event.currentTarget; const data = new FormData(form);
    const email = String(data.get("email") ?? "").trim(), password = String(data.get("password") ?? "");
    if ((mode === "register" || mode === "reset") && password !== data.get("confirmPassword")) { setError("The passwords do not match."); return; }
    const pasted = String(data.get("emailLink") ?? "");
    const link = pasted ? parseEmailLink(pasted, providerOrigin) : emailLink.current;
    if ((mode === "confirm" || mode === "reset") && (!link || link.kind !== (mode === "confirm" ? "confirmation" : "recovery"))) { setError("Paste the complete link from the matching Etail Depot email."); return; }
    for (const name of ["password", "confirmPassword", "emailLink"]) { const field = form.elements.namedItem(name); if (field instanceof HTMLInputElement) field.value = ""; }
    if (link) { emailLink.current = link; setLinkReady(true); }
    if (mode === "login") void submit("/api/v1/auth/login", { email, password }, mode);
    if (mode === "register") void submit("/api/v1/auth/register", { email, password }, mode);
    if (mode === "recover") void submit("/api/v1/auth/recover", { email }, mode);
    if (mode === "confirm") void submit("/api/v1/auth/confirm", { token: link!.token }, mode);
    if (mode === "reset") void submit("/api/v1/auth/reset-password", { token: link!.token, password }, mode);
  }

  const disabled = pending !== null || !emailSignIn.available || (mode === "register" && !emailSignIn.registrationAvailable);
  return <div className="login-forms">
    {error && <div className="error-message" role="alert" tabIndex={-1} ref={errorRef}>{error}</div>}
    {notice && <p className="form-note" role="status">{notice}</p>}
    <form key={mode} aria-labelledby="email-mode-title" onSubmit={submitForm}>
      <h3 id="email-mode-title" ref={titleRef} tabIndex={-1}>{titles[mode]}</h3>
      {(mode === "login" || mode === "register" || mode === "recover") && <div className="field"><label htmlFor="email">Email address</label><input type="email" name="email" id="email" autoComplete={mode === "login" ? "username" : "email"} inputMode="email" maxLength={254} required disabled={disabled} placeholder="you@example.com" /></div>}
      {(mode === "confirm" || mode === "reset") && !linkReady && <><p className="form-note">{localEmailLinkBridge ? "For this local preview, open the link in your latest email, then paste the final Etail Depot page address here. Do not share it with anyone." : "Open the link in your latest Etail Depot email to continue here. If you opened it in another browser, you can paste its final page address below. Do not share it with anyone."}</p><div className="field"><label htmlFor="email-link">{mode === "confirm" ? "Confirmation link" : "Password reset link"}</label><input type="password" name="emailLink" id="email-link" autoComplete="off" maxLength={4096} required disabled={disabled} placeholder="Paste the complete email link" /></div></>}
      {(mode === "login" || mode === "register" || mode === "reset") && <div className="field"><label htmlFor="password">{mode === "reset" ? "New password" : "Password"}</label><input type="password" name="password" id="password" autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={mode === "login" ? undefined : 12} maxLength={1024} required disabled={disabled} />{mode !== "login" && <p className="form-note">Use at least 12 characters.</p>}</div>}
      {(mode === "register" || mode === "reset") && <div className="field"><label htmlFor="confirm-password">Confirm password</label><input type="password" name="confirmPassword" id="confirm-password" autoComplete="new-password" minLength={12} maxLength={1024} required disabled={disabled} /></div>}
      {mode === "register" && <p className="form-note">We will email you a confirmation link. Creating a login does not automatically open card or merchant services.</p>}
      {!emailSignIn.available && <p className="form-note" id="identity-readiness" role="status"><Icon name="info" />{emailSignIn.reason === "UNAVAILABLE" ? "We cannot connect to email sign-in right now." : "Email sign-in is not enabled in this environment."}</p>}
      {mode === "register" && emailSignIn.available && !emailSignIn.registrationAvailable && <p className="form-note" id="registration-readiness" role="status">Creating a login is not available until email confirmation is enabled.</p>}
      <button type="submit" className="button primary full-width" disabled={disabled}>{pending === mode ? "Please wait…" : actions[mode]}<Icon name="arrow" /></button>
      {(!emailSignIn.available || (mode === "register" && !emailSignIn.registrationAvailable)) && <button type="button" className="button secondary full-width" disabled={checking || pending !== null} onClick={() => startChecking(() => router.refresh())}>{checking ? "Checking…" : "Check availability"}</button>}
    </form>
    <div className="email-access-options" aria-label="Email access options">
      {mode !== "login" && <button type="button" className="button secondary full-width" disabled={pending !== null} onClick={() => changeMode("login")}>Back to sign in</button>}
      {mode === "login" && <><button type="button" className="button secondary full-width" disabled={pending !== null} onClick={() => changeMode("register")}>Create a login</button><button type="button" className="button secondary full-width" disabled={pending !== null} onClick={() => changeMode("recover")}>Forgot your password?</button></>}
      {(mode === "login" || mode === "register") && <button type="button" className="button secondary full-width" disabled={pending !== null} onClick={() => changeMode("confirm")}>I have a confirmation email</button>}
      {mode === "recover" && <button type="button" className="button secondary full-width" disabled={pending !== null} onClick={() => changeMode("reset")}>I have a reset email</button>}
      {mode === "reset" && <button type="button" className="button secondary full-width" disabled={pending !== null} onClick={() => changeMode("recover")}>Request a new reset email</button>}
      {mode === "confirm" && <button type="button" className="button secondary full-width" disabled={pending !== null} onClick={() => changeMode("register")}>Request a new confirmation email</button>}
    </div>
    {localFixtureIdentity && <section className="fixture-panel" aria-labelledby="local-session-title">
      <span className="local-label">Sandbox</span><h2 id="local-session-title">Explore the sandbox</h2><p>Sample users are separate from your email login. Choose a role to explore with demo data.</p>
      <div className="fixture-actions">
        <button type="button" className="button primary full-width" disabled={pending !== null} onClick={() => void submit("/api/v1/auth/local-fixture", { persona: "owner" }, "owner")}>{pending === "owner" ? "Opening…" : "Continue as primary user"}<Icon name="arrow" /></button>
        <p className="form-note">Manage your cardholders and merchants.</p>
        <button type="button" className="button secondary full-width" disabled={pending !== null} onClick={() => void submit("/api/v1/auth/local-fixture", { persona: "viewer" }, "viewer")}>{pending === "viewer" ? "Opening…" : "Continue as secondary user"}<Icon name="arrow" /></button>
        <p className="form-note">See only your cards and shared merchant tools.</p>
        <button type="button" className="button secondary full-width" disabled={pending !== null} onClick={() => void submit("/api/v1/auth/local-fixture", { persona: "operator" }, "operator")}>{pending === "operator" ? "Opening…" : "Continue as support operator"}<Icon name="arrow" /></button>
        <p className="form-note">Review and answer assigned customer questions.</p>
      </div>
    </section>}
  </div>;
}

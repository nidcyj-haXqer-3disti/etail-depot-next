"use client";

import { useEffect, useRef, useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { EmailAuthenticationAvailability } from "@/modules/identity/adapters/netlify";
import { Icon } from "./icon";
import { parseEmailLink, takeEmailLink, type EmailLink } from "./identity-email-link";

type Mode = "login" | "register" | "confirm" | "recover" | "reset";
type Operation = Mode | "owner" | "viewer" | "operator";
const titles: Record<Mode, string> = { login: "Sign in with email", register: "Create your login", confirm: "Confirm your email", recover: "Reset your password", reset: "Choose a new password" };
const actions: Record<Mode, string> = { login: "Sign in", register: "Create login", confirm: "Confirm email", recover: "Send reset email", reset: "Save new password" };
const requestTimeoutMs = 30_000;

function uncertainOutcome(operation: Operation): string {
  if (operation === "register") return "We could not confirm whether your request completed. Check your inbox and spam folder before trying again. If you already have a login, use your existing password or reset it.";
  if (operation === "recover") return "We could not confirm whether the reset email was requested. Check your inbox and spam folder before requesting another email.";
  if (operation === "confirm") return "We could not confirm the result. Try signing in with your email and password. If confirmation is still needed, open the link in your latest confirmation email again.";
  if (operation === "reset") return "We could not confirm the password change. Contact the site owner to review it before trying to sign in or requesting another reset email.";
  return "We could not confirm sign-in. Check your connection, then enter your password and try again.";
}

function failureCode(failure: unknown): string | null {
  if (!failure || typeof failure !== "object" || !("error" in failure) || !failure.error || typeof failure.error !== "object" || !("code" in failure.error)) return null;
  return typeof failure.error.code === "string" ? failure.error.code : null;
}

export function LoginForm({ nextPath="/services",localFixtureIdentity, localEmailLinkBridge, emailSignIn, providerOrigin }: { nextPath?:string;localFixtureIdentity: boolean; localEmailLinkBridge: boolean; emailSignIn: EmailAuthenticationAvailability; providerOrigin: string }) {
  const router = useRouter();
  const [checking, startChecking] = useTransition();
  const [pending, setPending] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("login");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [linkReady, setLinkReady] = useState(false);
  const [availabilityCheckOffered, setAvailabilityCheckOffered] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const emailLink = useRef<EmailLink | null>(null);
  const incomingLink = useRef<{ link: EmailLink | null } | null>(null);
  const inFlight = useRef(false);
  const navigationStarted = useRef(false);
  const errorRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => { if (error) errorRef.current?.focus(); }, [error]);
  useEffect(() => { if (linkReady) titleRef.current?.focus(); }, [linkReady]);
  useEffect(() => {
    let active = true;
    function receiveLink() {
      const pendingLink = takeEmailLink();
      if (pendingLink || window.location.hash) {
        const link = pendingLink?.kind === "invalid" ? null : pendingLink ?? parseEmailLink(window.location.hash, providerOrigin, true);
        // Capture before deferring: Strict Mode can replay this effect after the
        // single-use handoff and fragment have already been consumed.
        incomingLink.current = { link };
        const cleanUrl = `${window.location.pathname}${window.location.search}`;
        // Scrub immediately. Reusing Next's internal history state would bypass
        // its URL synchronization and let a refresh restore the fragment.
        window.history.replaceState(null, "", cleanUrl);
      }
      const incoming = incomingLink.current;
      if (!incoming) return;
      queueMicrotask(() => {
        if (!active || incomingLink.current !== incoming) return;
        incomingLink.current = null;
        // On first hydration the parent router installs its history integration
        // after this effect. Synchronize once it is installed, without a route
        // navigation that can reuse the initial fragment from the route cache.
        window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
        if (inFlight.current) { setError("Wait for your current request to finish, then open the email link again."); return; }
        const { link } = incoming;
        emailLink.current = link; setLinkReady(Boolean(link)); setNotice("");
        if (!link) { setError("This email link is not supported. Copy the confirmation or reset link from your latest email."); return; }
        setError(""); setMode(link.kind === "confirmation" ? "confirm" : "reset"); setNotice("Your email link is ready. Continue below.");
      });
    }
    receiveLink();
    window.addEventListener("hashchange", receiveLink);
    return () => { active = false; window.removeEventListener("hashchange", receiveLink); };
  }, [providerOrigin]);

  function changeMode(next: Mode) {
    if (inFlight.current || checking) return;
    emailLink.current = null; setLinkReady(false); setMode(next); setError(""); setNotice("");
  }

  function checkAvailability() {
    if (inFlight.current || checking) return;
    startChecking(() => router.refresh());
  }

  async function submit(path: string, body: Record<string, string>, operation: Operation) {
    if (inFlight.current || checking) return;
    inFlight.current = true;
    setPending(operation); setError(""); setNotice("");
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), requestTimeoutMs);
    try {
      const response = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin", body: JSON.stringify(body), signal: controller.signal });
      if (!response.ok) {
        const failure: unknown = await response.json().catch(() => null);
        const code = failureCode(failure);
        if (response.status === 503 && operation in actions) {
          setAvailabilityCheckOffered(true);
          // Refresh server-owned readiness only. Credentials are never resubmitted.
          startChecking(() => router.refresh());
        }
        if (code === "PASSWORD_RESET_PENDING") setError("Your password change needs review before you can sign in. Contact the site owner. A new reset email cannot clear this block.");
        else if (response.status === 409) setError("Another sign-in or password change is in progress. Please try again shortly.");
        else if (response.status === 429) setError("There have been too many attempts. Please wait 15 minutes before trying again.");
        else if (operation === "reset" && response.status === 401 && code === "INVALID_EMAIL_LINK") setError("This reset link is invalid or has expired. Request a new reset email and open its link to choose your password.");
        else if (operation === "reset") setError(uncertainOutcome(operation));
        else if (operation === "login" && response.status === 401) setError("We could not verify your email and password. Check your details. If you just created your login, open the confirmation email first.");
        else if (operation === "confirm" && response.status === 401) setError("This confirmation link is invalid or has expired. If you have already confirmed your email, return to sign in. Otherwise, open the link in your latest confirmation email.");
        else if (operation === "register" && response.status === 422) setError("We could not create this login. If you already registered, sign in with your existing password or reset it. Registering again does not change your password.");
        else if (operation === "register" && code === "EMAIL_CONFIRMATION_REQUIRED") setError("Creating a login is temporarily unavailable. Check availability before trying again. If you already have a login, return to sign in.");
        else if (response.status === 503) setError("Email access is temporarily unavailable. Check availability before trying again.");
        else setError("We could not complete this request. Please try again.");
        return;
      }
      const result: unknown = await response.json();
      const field = operation === "register" ? "registrationRequested" : operation === "confirm" ? "confirmed" : operation === "recover" ? "recoveryRequested" : operation === "reset" ? "passwordReset" : "authenticated";
      if (!result || typeof result !== "object" || !(field in result) || (result as Record<string, unknown>)[field] !== true) { setError(uncertainOutcome(operation)); return; }
      if (field === "authenticated") {
        navigationStarted.current = true; setSignedIn(true);
        // The new document reads the HttpOnly session set by this response.
        window.location.replace(nextPath); return;
      }
      emailLink.current = null; setLinkReady(false);
      if (operation === "register") { setMode("confirm"); setNotice("Your request was received. For a new login, check your inbox and spam folder for a confirmation email. If you already have a login, use your existing password or reset it. Registering again does not change your password."); }
      if (operation === "recover") { setMode("reset"); setNotice("If this email has a login, a reset email has been requested. Check your inbox and spam folder. Open its link and choose your new password on the Etail Depot page it opens."); }
      if (operation === "confirm") { setMode("login"); setNotice("Your email is confirmed. Sign in with your email and password."); }
      if (operation === "reset") { setMode("login"); setNotice("Your password has been changed and previous sessions signed out. Sign in with your new password."); }
    } catch {
      if (!navigationStarted.current) setError(`${controller.signal.aborted ? "This is taking longer than expected. " : ""}${uncertainOutcome(operation)}`);
    } finally {
      window.clearTimeout(timeout);
      if (!navigationStarted.current) { inFlight.current = false; setPending(null); }
    }
  }

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current || checking || !emailSignIn.available || (mode === "register" && !emailSignIn.registrationAvailable)) return;
    const form = event.currentTarget; const data = new FormData(form);
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

  if (signedIn) return <div className="login-forms"><p className="form-note" role="status">You’re signed in. Opening your services…</p><a className="button primary full-width" href={nextPath}>Continue<Icon name="arrow" /></a></div>;

  const busy = pending !== null || checking;
  const disabled = busy || !emailSignIn.available || (mode === "register" && !emailSignIn.registrationAvailable);
  return <div className="login-forms">
    {error && <div className="error-message" role="alert" tabIndex={-1} ref={errorRef}>{error}</div>}
    {notice && <p className="form-note" role="status">{notice}</p>}
    <form key={mode} aria-labelledby="email-mode-title" onSubmit={submitForm}>
      <h3 id="email-mode-title" ref={titleRef} tabIndex={-1}>{titles[mode]}</h3>
      {(mode === "login" || mode === "register" || mode === "recover") && <div className="field"><label htmlFor="email">Email address</label><input type="email" name="email" id="email" autoComplete={mode === "login" ? "username" : "email"} inputMode="email" maxLength={254} required disabled={disabled} placeholder="you@example.com" /></div>}
      {(mode === "confirm" || mode === "reset") && !linkReady && <><p className="form-note">Open the link in your latest Etail Depot email and {mode === "confirm" ? "confirm your email" : "choose your new password"} on the page it opens.{localEmailLinkBridge && " Then return here to sign in."}</p><p className="form-note">If you already copied a link that still contains its {mode === "confirm" ? "confirmation" : "reset"} code, you can paste it below. Do not share it with anyone.</p><div className="field"><label htmlFor="email-link">{mode === "confirm" ? "Confirmation link" : "Password reset link"}</label><input type="password" name="emailLink" id="email-link" autoComplete="off" maxLength={4096} required disabled={disabled} placeholder="Paste the complete email link" /></div></>}
      {(mode === "login" || mode === "register" || mode === "reset") && <div className="field"><label htmlFor="password">{mode === "reset" ? "New password" : "Password"}</label><input type="password" name="password" id="password" autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={mode === "login" ? undefined : 12} maxLength={1024} required disabled={disabled} />{mode !== "login" && <p className="form-note">Use at least 12 characters.</p>}</div>}
      {(mode === "register" || mode === "reset") && <div className="field"><label htmlFor="confirm-password">Confirm password</label><input type="password" name="confirmPassword" id="confirm-password" autoComplete="new-password" minLength={12} maxLength={1024} required disabled={disabled} /></div>}
      {mode === "register" && <p className="form-note">We will email you a confirmation link. Creating a login does not automatically open card or merchant services.</p>}
      {!emailSignIn.available && <p className="form-note" id="identity-readiness" role="status"><Icon name="info" />Email sign-in is temporarily unavailable. Check availability to try again.</p>}
      {mode === "register" && emailSignIn.available && !emailSignIn.registrationAvailable && <p className="form-note" id="registration-readiness" role="status">Creating a login is temporarily unavailable. If you already have a login, return to sign in.</p>}
      <button type="submit" className="button primary full-width" disabled={disabled}>{pending === mode ? "Please wait…" : actions[mode]}<Icon name="arrow" /></button>
      {(availabilityCheckOffered || !emailSignIn.available || (mode === "register" && !emailSignIn.registrationAvailable)) && <button type="button" className="button secondary full-width" disabled={busy} onClick={checkAvailability}>{checking ? "Checking…" : "Check availability"}</button>}
    </form>
    <div className="email-access-options" aria-label="Email access options">
      {mode !== "login" && <button type="button" className="button secondary full-width" disabled={busy} onClick={() => changeMode("login")}>Back to sign in</button>}
      {mode === "login" && <><button type="button" className="button secondary full-width" disabled={busy} onClick={() => changeMode("register")}>Create a login</button><button type="button" className="button secondary full-width" disabled={busy} onClick={() => changeMode("recover")}>Forgot your password?</button></>}
      {(mode === "login" || mode === "register") && <button type="button" className="button secondary full-width" disabled={busy} onClick={() => changeMode("confirm")}>I have a confirmation email</button>}
      {mode === "recover" && <button type="button" className="button secondary full-width" disabled={busy} onClick={() => changeMode("reset")}>I have a reset email</button>}
      {mode === "reset" && <button type="button" className="button secondary full-width" disabled={busy} onClick={() => changeMode("recover")}>Request a new reset email</button>}
      {mode === "confirm" && <><button type="button" className="button secondary full-width" disabled={busy} onClick={() => changeMode("recover")}>Forgot your password?</button><button type="button" className="button secondary full-width" disabled={busy} onClick={() => changeMode("register")}>Back to registration</button></>}
    </div>
    {localFixtureIdentity && <section className="fixture-panel" aria-labelledby="local-session-title">
      <span className="local-label">Sandbox</span><h2 id="local-session-title">Explore the sandbox</h2><p>Sample users are separate from your email login. Choose a role to explore with demo data.</p>
      <div className="fixture-actions">
        <button type="button" className="button primary full-width" disabled={busy} onClick={() => void submit("/api/v1/auth/local-fixture", { persona: "owner" }, "owner")}>{pending === "owner" ? "Opening…" : "Continue as primary user"}<Icon name="arrow" /></button>
        <p className="form-note">Manage your cardholders and merchants.</p>
        <button type="button" className="button secondary full-width" disabled={busy} onClick={() => void submit("/api/v1/auth/local-fixture", { persona: "viewer" }, "viewer")}>{pending === "viewer" ? "Opening…" : "Continue as secondary user"}<Icon name="arrow" /></button>
        <p className="form-note">See only your cards and shared merchant tools.</p>
        <button type="button" className="button secondary full-width" disabled={busy} onClick={() => void submit("/api/v1/auth/local-fixture", { persona: "operator" }, "operator")}>{pending === "operator" ? "Opening…" : "Continue as support operator"}<Icon name="arrow" /></button>
        <p className="form-note">Review and answer assigned customer questions.</p>
      </div>
    </section>}
  </div>;
}

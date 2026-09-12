"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Feedback } from "./workspace/primitives";

export function CardholderEnrollment() {
  const router = useRouter();
  const [attempt, setAttempt] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [signInRequired, setSignInRequired] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const mounted = useRef(true);
  const inFlight = useRef(false);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  async function enroll() {
    if (busy || inFlight.current || signInRequired || unavailable) return;
    inFlight.current = true;
    const commandId = attempt ?? crypto.randomUUID();
    setAttempt(commandId); setBusy(true); setError("");
    try {
      const response = await fetch("/api/v1/cardholder-services", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ commandId }) });
      if (!response.ok) {
        const code = (await response.json().catch(() => null))?.error?.code;
        if (!mounted.current) return;
        if (response.status === 401) { setSignInRequired(true); throw new Error("Your sign-in expired. Sign in again before continuing setup."); }
        if (response.status === 403) { setUnavailable(true); throw new Error("Cardholder setup is not available for your current access. Cards already assigned to you are unchanged."); }
        if (code === "CARDHOLDER_SERVICE_EXISTS") { router.push("/cardholder-services?new=1"); router.refresh(); return; }
        throw new Error("We couldn’t confirm your cardholder setup. Try again to safely check this request.");
      }
      if (mounted.current) { setAttempt(null); router.push("/cardholder-services?new=1"); router.refresh(); }
    } catch (caught) { if (mounted.current) setError(caught instanceof Error ? caught.message : "Please try again."); }
    finally { inFlight.current = false; if (mounted.current) setBusy(false); }
  }
  return <section className="ch-enrollment"><p className="consumer-eyebrow">YOUR CARDS, YOUR CONTROL</p><h2>Start your card group.</h2><p>You’ll choose your first card next. Add family or teammates when you’re ready. Each person sees only their own cards and purchases.</p><Feedback kind="error" message={error}/>{signInRequired ? <Link href="/login">Sign in to continue setup</Link> : <Button busy={busy} disabled={unavailable} onClick={enroll}>Set up my cards</Button>}<p className="consumer-form-footnote">You’ll review the card details before creating it.</p></section>;
}

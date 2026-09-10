"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { holdEmailLink, parseEmailLink } from "./identity-email-link";

/** Netlify's default email links land on /. Carry a parsed fragment in memory to the one login form. */
export function EmailCallbackBridge({ providerOrigin }: { providerOrigin: string }) {
  const router = useRouter();
  useEffect(() => {
    if (!/^#(?:confirmation_token|recovery_token)=/.test(window.location.hash)) return;
    const link = parseEmailLink(window.location.hash, providerOrigin, true);
    window.history.replaceState(window.history.state, "", `${window.location.pathname}${window.location.search}`);
    holdEmailLink(link ?? { kind: "invalid" });
    router.replace("/login");
  }, [providerOrigin, router]);
  return null;
}

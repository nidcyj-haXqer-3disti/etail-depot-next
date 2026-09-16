import type { Metadata } from "next";
import { headers } from "next/headers";
import { resolveAuthNextPath } from "@/modules/identity/continuation";
import { getRuntimeConfig } from "@/platform/config";
import { getPasswordLoginAvailability } from "@/modules/identity/password-login";
import { LoginForm } from "@/ui/login-form";
import { Shell } from "@/ui/shell";
import targets from "../../../project-targets.json";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const metadata: Metadata = { title: "Sign in", referrer: "no-referrer" };

export default async function LoginPage({searchParams}:{searchParams:Promise<{next?:string|string[];mode?:string|string[]}>}) {
  const query=await searchParams;const nextPath=await resolveAuthNextPath(query.next,(await headers()).get("cookie"));
  const initialMode=query.mode==="register"?"register":"login";
  let localEmailLinkBridge = false;
  let validConfiguration = false;
  try {
    const config = getRuntimeConfig();
    localEmailLinkBridge = config.appEnv === "local";
    validConfiguration = true;
  } catch { /* Invalid runtime configuration leaves every sign-in option unavailable. */ }
  const emailSignIn = validConfiguration ? await getPasswordLoginAvailability() : { available: false, reason: "NOT_CONFIGURED" as const, registrationAvailable: false };
  return <Shell><div className="login-layout page-container"><section className="login-introduction"><p className="eyebrow">Welcome to Etail Depot</p><h1>Your cards.<br /><span>Your payments.</span></h1><p>Sign in to view your cards or manage payments.</p></section><section className="login-panel" aria-label="Email access"><LoginForm nextPath={nextPath} initialMode={initialMode} localEmailLinkBridge={localEmailLinkBridge} emailSignIn={emailSignIn} providerOrigin={targets.netlify.canonical_origin} /></section></div></Shell>;
}

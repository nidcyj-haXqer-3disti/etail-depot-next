export interface EmailLink { kind: "confirmation" | "recovery"; token: string }
export type EmailLinkHandoff = EmailLink | { kind: "invalid" };
let pendingLink: EmailLinkHandoff | null = null;
/** Single-use memory handoff during client navigation; never web storage or cookies. */
export function holdEmailLink(link: EmailLinkHandoff): void { pendingLink = link; }
export function takeEmailLink(): EmailLinkHandoff | null { const link = pendingLink; pendingLink = null; return link; }
/** Only a token from the recorded issuer's link, or the current page fragment. Never fetch or navigate to pasted input. */
export function parseEmailLink(input: string, providerOrigin: string, currentFragment = false): EmailLink | null {
  let fragment: string;
  if (currentFragment) {
    if (!input.startsWith("#")) return null;
    fragment = input.slice(1);
  } else {
    let url: URL;
    try { url = new URL(input.trim()); } catch { return null; }
    if (url.origin !== providerOrigin || url.username || url.password || url.search || !["/", "/login"].includes(url.pathname)) return null;
    fragment = url.hash.slice(1);
  }
  const entries = [...new URLSearchParams(fragment)];
  if (entries.length !== 1) return null;
  const [key, token] = entries[0]!;
  if (!/^[A-Za-z0-9_-]{1,2048}$/.test(token)) return null;
  if (key === "confirmation_token") return { kind: "confirmation", token };
  if (key === "recovery_token") return { kind: "recovery", token };
  return null;
}

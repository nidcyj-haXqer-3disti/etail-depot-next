const privateOrInformationPaths = new Set(["app", "login", "signup", "help", "pricing", "legal", "teams"]);

/** Accept a public team page or event. Never forward page queries or visitor data. */
export function salesBookingUrl(value: string | null): string | null {
  if (value === null) return null;
  const url = new URL(value);
  const firstSegment = url.pathname.split("/")[1]?.toLowerCase() ?? "";
  if (url.origin !== "https://calendly.com" || url.username || url.password || url.search || url.hash || !/^\/[a-z0-9_-]+(?:\/[a-z0-9_-]+)?\/?$/i.test(url.pathname) || privateOrInformationPaths.has(firstSegment)) {
    throw new Error("Use a public Calendly team page or event URL without query parameters or a fragment.");
  }
  return url.href.replace(/\/$/, "");
}

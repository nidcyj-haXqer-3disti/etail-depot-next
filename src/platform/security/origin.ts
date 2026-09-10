export type AppEnvironment = "local" | "test" | "preview" | "production";

export class SecurityError extends Error {
  constructor(
    public readonly code: string,
    public readonly status = 403,
  ) {
    super(code);
    this.name = "SecurityError";
  }
}

const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

/** The caller supplies server configuration, never a value from request headers. */
export function assertTrustedOrigin(
  publicOrigin: string,
  appEnv: AppEnvironment,
): string {
  let url: URL;
  try {
    url = new URL(publicOrigin);
  } catch {
    throw new SecurityError("INVALID_PUBLIC_ORIGIN", 503);
  }
  if (
    url.origin !== publicOrigin ||
    url.username ||
    url.password ||
    url.hostname.includes("*") ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new SecurityError("INVALID_PUBLIC_ORIGIN", 503);
  }
  const isolated = appEnv === "local" || appEnv === "test";
  if (isolated) {
    if (!LOOPBACK_HOSTS.has(url.hostname) || !["http:", "https:"].includes(url.protocol)) {
      throw new SecurityError("LOCAL_ORIGIN_REQUIRED", 503);
    }
  } else if (url.protocol !== "https:" || LOOPBACK_HOSTS.has(url.hostname)) {
    throw new SecurityError("HTTPS_ORIGIN_REQUIRED", 503);
  }
  return url.origin;
}

/** Exact-origin CSRF protection for browser routes, including authentication. */
export function assertSameOrigin(
  request: Pick<Request, "method" | "headers">,
  trustedPublicOrigin: string,
): void {
  if (["GET", "HEAD", "OPTIONS"].includes(request.method.toUpperCase())) return;
  const origin = request.headers.get("origin");
  if (!origin || origin === "null" || origin !== trustedPublicOrigin) {
    throw new SecurityError("UNTRUSTED_REQUEST_ORIGIN");
  }
  // Origin is the authority; Fetch Metadata provides an additional browser check.
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none") {
    throw new SecurityError("UNTRUSTED_REQUEST_ORIGIN");
  }
}

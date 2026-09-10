import { SecurityError } from "../security/origin";

/** Validate before passing a connection string to pg: URL query options can override its host/user. */
export function validateLocalDatabaseTarget(raw: string | undefined, options: { ci: boolean }): string {
  if (!raw) throw new SecurityError("LOCAL_DATABASE_REQUIRED", 503);
  const reject = (): never => { throw new SecurityError("ISOLATED_DATABASE_REQUIRED", 503); };
  let url: URL;
  try { url = new URL(raw); } catch { return reject(); }

  // Pass only canonical URLs to the SDK so its parser never sees a different target.
  // Standalone migration/test tools enforce equivalent guards without importing TS.
  if (raw !== url.href || /[\u0000-\u0020\u007f]/.test(raw) || raw.includes("?") || raw.includes("#")) return reject();
  if (!["postgres:", "postgresql:"].includes(url.protocol)) return reject();
  if (!["127.0.0.1", "localhost", "[::1]"].includes(url.hostname)) return reject();
  if (url.search || url.hash || !["/etail_depot_next_services_test", "/etail_depot_next_services_preview"].includes(url.pathname)) return reject();

  if (options.ci) {
    const port = Number(url.port || "5432");
    if (url.username !== "etail_ci" || url.pathname !== "/etail_depot_next_services_test" || !Number.isInteger(port) || port < 1 || port > 65535) return reject();
    // CI service authentication is ephemeral and supplied by the test environment.
  } else if (url.username !== "etail_local" || url.port !== "55439" || url.password) {
    return reject();
  }
  return url.href;
}

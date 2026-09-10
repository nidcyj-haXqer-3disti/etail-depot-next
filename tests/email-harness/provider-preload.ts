import { applicationOrigin, assertEmailHarnessEnvironment, fixtureHeader, fixtureOrigin, pinnedIdentityEndpoint } from "./guard";

assertEmailHarnessEnvironment();
if (process.env.APP_ENV !== "local" || process.env.ETAIL_PUBLIC_ORIGIN !== applicationOrigin || process.env.ENABLE_LOCAL_FIXTURE_IDENTITY !== "false") {
  throw new Error("Email transport interception is restricted to the isolated application process.");
}
const endpoint = pinnedIdentityEndpoint();
const networkFetch = globalThis.fetch;
const allowed = new Set(["GET /settings", "POST /signup", "POST /verify", "POST /token", "GET /user", "POST /recover", "PUT /user"]);
/** Test transport only. Application configuration, adapter, routes and sessions are unmodified. */
globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const request = new Request(input, init);
  const url = new URL(request.url);
  if (url.origin === new URL(endpoint).origin) {
    const suffix = request.url.slice(endpoint.length);
    if (!request.url.startsWith(`${endpoint}/`) || url.search || url.hash || !allowed.has(`${request.method} ${suffix}`)) {
      throw new Error("Unexpected Identity request blocked by isolated test transport.");
    }
    const headers = new Headers(request.headers);
    headers.set("x-etail-email-fixture", fixtureHeader);
    return networkFetch(`${fixtureOrigin}/provider${suffix}`, {
      method: request.method, headers, body: request.method === "GET" ? undefined : await request.text(),
      redirect: "error", cache: "no-store", signal: request.signal,
    });
  }
  if (url.origin !== applicationOrigin) throw new Error("External fetch blocked by isolated email test transport.");
  return networkFetch(input, init);
};

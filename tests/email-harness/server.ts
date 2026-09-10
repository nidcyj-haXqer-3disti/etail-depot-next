import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { spawn } from "node:child_process";
import { applicationOrigin, fixtureHeader, fixtureOrigin, pinnedIdentityEndpoint, verifyEmailHarnessDatabase } from "./guard";

await verifyEmailHarnessDatabase();
pinnedIdentityEndpoint();
type Member = { subject: string; email: string; digest: string; confirmed: boolean; confirmation: string; recovery: string };
const members = new Map<string, Member>();
const accessTokens = new Map<string, Member>();
let autoConfirm = false;
let calls: string[] = [];
const digest = (value: string) => createHash("sha256").update(value).digest("hex");
function respond(response: ServerResponse, status: number, body: unknown) {
  response.writeHead(status, { "Content-Type": "application/json", "Cache-Control": "no-store" });
  response.end(JSON.stringify(body));
}
async function body(request: IncomingMessage): Promise<string> {
  let text = "";
  for await (const chunk of request) { text += chunk; if (Buffer.byteLength(text) > 8192) throw new Error("Oversized fixture request."); }
  return text;
}
function token(member: Member) {
  const value = randomBytes(32).toString("base64url"); accessTokens.set(value, member); return { access_token: value, token_type: "bearer" };
}
function user(member: Member) { return { id: member.subject, email: member.email, confirmed_at: member.confirmed ? new Date().toISOString() : null }; }
const server = createServer((request, response) => {
  void (async () => {
    if (request.headers["x-etail-email-fixture"] !== fixtureHeader || request.headers.origin || request.headers.host !== new URL(fixtureOrigin).host) {
      respond(response, 403, { error: "Fixture access denied" }); return;
    }
    const path = request.url ?? "";
    const method = request.method ?? "";
    if (path === "/control/reset" && method === "POST") {
      members.clear(); accessTokens.clear(); calls = []; autoConfirm = false;
      respond(response, 200, { reset: true }); return;
    }
    if (path === "/control/settings" && method === "POST") {
      const input = JSON.parse(await body(request));
      if (typeof input.autoconfirm !== "boolean") throw new Error("Invalid fixture settings.");
      autoConfirm = input.autoconfirm; respond(response, 200, { changed: true }); return;
    }
    if (path === "/control/member" && method === "POST") {
      const input = JSON.parse(await body(request));
      const member = members.get(input.email);
      if (!member) { respond(response, 404, { missing: true }); return; }
      // Synthetic confirmation token stays in test process memory; no mail is sent.
      respond(response, 200, { subject: member.subject, confirmation: member.confirmation, recovery: member.recovery, confirmed: member.confirmed }); return;
    }
    if (path === "/control/calls" && method === "GET") { respond(response, 200, { calls }); return; }
    if (!path.startsWith("/provider/")) { respond(response, 404, { error: "Unrecognized fixture request" }); return; }
    const route = path.slice("/provider".length);
    calls.push(`${method} ${route}`); // Only method/path, never headers, body, credentials or tokens.
    if (route === "/settings" && method === "GET") {
      respond(response, 200, { external: { email: true }, disable_signup: false, autoconfirm: autoConfirm }); return;
    }
    if (route === "/signup" && method === "POST") {
      const input = JSON.parse(await body(request));
      if (typeof input.email !== "string" || !/^email-e2e-[a-z0-9-]+@example\.test$/.test(input.email) || typeof input.password !== "string" || input.password.length < 12) {
        respond(response, 422, { error: "Only synthetic test registration is accepted" }); return;
      }
      let member = members.get(input.email);
      if (member?.confirmed) { respond(response, 400, { msg: "A user with this email address has already been registered" }); return; }
      if (!member) {
        member = { subject: randomUUID(), email: input.email, digest: digest(input.password), confirmed: autoConfirm, confirmation: randomBytes(24).toString("base64url"), recovery: "" };
        members.set(input.email, member);
      }
      respond(response, 200, { ...user(member), confirmation_sent_at: new Date().toISOString() }); return;
    }
    if (route === "/recover" && method === "POST") {
      const input = JSON.parse(await body(request)); const member = members.get(input.email);
      if (member) member.recovery = randomBytes(24).toString("base64url");
      respond(response, 200, {}); return;
    }
    if (route === "/verify" && method === "POST") {
      const input = JSON.parse(await body(request));
      const key = input.type === "signup" ? "confirmation" : input.type === "recovery" ? "recovery" : null;
      const member = key ? [...members.values()].find(item => item[key] && item[key] === input.token) : undefined;
      if (!member || !key) { respond(response, 401, { error: "Invalid confirmation" }); return; }
      member.confirmed = true; member[key] = ""; respond(response, 200, token(member)); return;
    }
    if (route === "/token" && method === "POST") {
      const input = new URLSearchParams(await body(request));
      const member = members.get(input.get("username") ?? "");
      if (input.get("grant_type") !== "password" || !member?.confirmed || digest(input.get("password") ?? "") !== member.digest) {
        respond(response, 400, { error: "invalid_grant", error_description: "Invalid login credentials" }); return;
      }
      respond(response, 200, token(member)); return;
    }
    if (route === "/user" && (method === "GET" || method === "PUT")) {
      const member = accessTokens.get(String(request.headers.authorization ?? "").replace(/^Bearer /, ""));
      if (!member) { respond(response, 401, { error: "Invalid token" }); return; }
      if (method === "PUT") {
        const input = JSON.parse(await body(request));
        if (typeof input.password !== "string" || input.password.length < 12) { respond(response, 422, { error: "Invalid password" }); return; }
        member.digest = digest(input.password);
      }
      respond(response, 200, user(member)); return;
    }
    respond(response, 501, { error: "Unrecognized provider operation" });
  })().catch(() => respond(response, 500, { error: "Isolated fixture request failed" }));
});
await new Promise<void>((resolve, reject) => { server.once("error", reject); server.listen(3102, "127.0.0.1", resolve); });
const child = spawn(process.execPath, ["--import", "tsx", "--import", "./tests/email-harness/provider-preload.ts", "node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", "3101"], {
  stdio: "inherit", env: { ...process.env, APP_ENV: "local", ETAIL_PUBLIC_ORIGIN: applicationOrigin, ENABLE_LOCAL_FIXTURE_IDENTITY: "false" },
});
let stopping = false;
function stop() { if (stopping) return; stopping = true; child.kill("SIGTERM"); server.closeAllConnections(); server.close(); }
process.once("SIGINT", stop); process.once("SIGTERM", stop);
child.once("error", () => { stop(); process.exitCode = 1; });
child.once("exit", code => { stop(); process.exitCode = code ?? 1; });

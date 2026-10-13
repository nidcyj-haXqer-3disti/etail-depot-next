/** Local-only static preview exercising the same request boundary as Netlify. */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { handlePublicRequest } from "../netlify/edge-functions/public-boundary.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const directory = path.join(root, "out");
const index = process.argv.indexOf("--port");
const port = Number(index >= 0 ? process.argv[index + 1] : 3100);
if (!Number.isSafeInteger(port) || port < 1024 || port > 65535) throw new Error("Invalid local preview port.");
await stat(path.join(directory, "index.html"));
const contentTypes = { ".html": "text/html; charset=utf-8", ".txt": "text/plain; charset=utf-8", ".xml": "application/xml; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml", ".ico": "image/x-icon", ".woff2": "font/woff2" };

async function staticResponse(url, method) {
  if (!["GET", "HEAD"].includes(method)) return new Response("Method not allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
  let pathname;
  try { pathname = decodeURIComponent(url.pathname); } catch { return new Response("Bad request", { status: 400 }); }
  if (pathname.includes("\\") || pathname.includes("\0") || pathname.split("/").some(part => part === ".." || part.startsWith("."))) return new Response("Not found", { status: 404 });
  const relative = pathname === "/" ? "index.html" : pathname.slice(1).replace(/\/$/, "");
  for (const file of [relative, `${relative}.html`, `${relative}/index.html`]) {
    const absolute = path.resolve(directory, file);
    if (!absolute.startsWith(directory + path.sep)) continue;
    try {
      if (!(await stat(absolute)).isFile()) continue;
      const type = pathname === "/opengraph-image" ? "image/png" : contentTypes[path.extname(absolute)] ?? "application/octet-stream";
      const body = method === "HEAD" ? null : await readFile(absolute);
      return new Response(body, { headers: { "Content-Type": type } });
    } catch (error) { if (error.code !== "ENOENT" && error.code !== "ENOTDIR") throw error; }
  }
  return new Response(method === "HEAD" ? null : await readFile(path.join(directory, "404.html")), { status: 404, headers: { "Content-Type": "text/html; charset=utf-8" } });
}

const server = createServer(async (incoming, outgoing) => {
  // Submitted bodies are never parsed, stored or forwarded by the retired service boundary.
  incoming.resume();
  try {
    const url = new URL(incoming.url, `http://127.0.0.1:${port}`);
    const method = incoming.method ?? "GET";
    const response = await handlePublicRequest(new Request(url, { method }), {
      next: () => staticResponse(url, method),
      site: { id: process.env.SITE_ID },
      deploy: { context: process.env.ETAIL_PREVIEW_DEPLOY_CONTEXT || process.env.CONTEXT || "dev" },
    }, { ...process.env, NODE_ENV: "production" });
    outgoing.writeHead(response.status, Object.fromEntries(response.headers));
    outgoing.end(method === "HEAD" ? undefined : Buffer.from(await response.arrayBuffer()));
  } catch {
    outgoing.writeHead(500, { "Content-Type": "text/plain", "X-Robots-Tag": "noindex, nofollow" });
    outgoing.end("The local preview could not serve this page.");
  }
});
server.listen(port, "127.0.0.1", () => console.log(`Public preview: http://127.0.0.1:${port}`));
for (const signal of ["SIGINT", "SIGTERM"]) process.once(signal, () => server.close(() => process.exit(0)));

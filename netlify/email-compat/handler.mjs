import { timingSafeEqual } from "node:crypto";

const headers = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex, nofollow",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "no-referrer",
};

/** Preserve authenticated platform sending without exposing the plugin's preview UI. */
export function createEmailHandler(loadHandler, readSecret) {
  return async function emailHandler(request) {
    if (request.method !== "POST") {
      return new Response(request.method === "HEAD" ? null : JSON.stringify({ message: "Method not allowed." }), {
        status: 405, headers: { ...headers, Allow: "POST" },
      });
    }
    const secret = readSecret();
    if (!secret) return new Response(JSON.stringify({ message: "Email service unavailable." }), { status: 503, headers });
    const supplied = request.headers.get("netlify-emails-secret") ?? "";
    const expectedBytes = Buffer.from(secret);
    const suppliedBytes = Buffer.from(supplied);
    if (expectedBytes.length !== suppliedBytes.length || !timingSafeEqual(expectedBytes, suppliedBytes)) {
      return new Response(JSON.stringify({ message: "Not authorized." }), { status: 403, headers });
    }
    try {
      const handler = await loadHandler();
      const response = await handler(request);
      const securedHeaders = new Headers(response.headers);
      for (const [name, value] of Object.entries(headers)) securedHeaders.set(name, value);
      return new Response(response.body, { status: response.status, headers: securedHeaders });
    } catch {
      // Upstream errors must not expose credentials, configuration or request details.
      return new Response(JSON.stringify({ message: "Email request could not be completed." }), { status: 500, headers });
    }
  };
}

export default createEmailHandler(async () => {
  const vendor = await import("./vendor.cjs");
  if (typeof vendor.default?.default !== "function") throw new Error("Unsupported email handler.");
  return vendor.default.default;
}, () => process.env.NETLIFY_EMAILS_SECRET);

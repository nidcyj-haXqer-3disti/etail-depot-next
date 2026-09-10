import type { ServerlessDatabaseConnection } from "@netlify/database";

type HttpClient = ServerlessDatabaseConnection["httpClient"];

/** The pinned Drizzle adapter uses plain SQL calls; Neon requires .query() for them. */
export function netlifyHttpQueryClient(client: HttpClient): HttpClient {
  return new Proxy(client, {
    apply(target, receiver, args) {
      // Resolve .query on every call to retain Netlify's connection refresh behavior.
      if (typeof args[0] === "string") return Reflect.apply(target.query, target, args);
      return Reflect.apply(target, receiver, args);
    },
  });
}

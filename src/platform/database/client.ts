import { getDatabase } from "@netlify/database";
import { drizzle } from "drizzle-orm/netlify-db";
import { getRuntimeConfig } from "../config";
import { SecurityError } from "../security/origin";
import { validateLocalDatabaseTarget } from "./local-target";

function connect() {
  const config = getRuntimeConfig();
  if (config.appEnv === "local" || config.appEnv === "test") {
    const connectionString = validateLocalDatabaseTarget(process.env.DATABASE_URL, { ci: process.env.CI === "true" });
    // Netlify SDK selects node-postgres for native PostgreSQL in local mode.
    process.env.NETLIFY_DB_DRIVER = "server";
    const connection = getDatabase({connectionString});
    return {db:drizzle({client:connection}),connection};
  }
  // Site ID and origin must already match the new project's recorded binding.
  if (!process.env.NETLIFY_DB_URL) throw new SecurityError("NEW_DATABASE_REQUIRED",503);
  const connection = getDatabase();
  return {db:drizzle({client:connection}),connection};
}
let cached: ReturnType<typeof connect> | undefined;
export function getDb() { cached ??= connect(); return cached.db; }
export async function closeDatabase() { if(cached) { await cached.connection.pool.end(); cached=undefined; } }

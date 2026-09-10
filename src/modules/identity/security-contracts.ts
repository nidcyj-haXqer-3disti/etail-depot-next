import { z } from "zod";

export const activeSessionSchema = z.object({
  id: z.uuid(), current: z.boolean(), signedInAt: z.iso.datetime(), expiresAt: z.iso.datetime(),
}).strict();
export const sessionOverviewSchema = z.object({ sessions: z.array(activeSessionSchema), moreAvailable: z.boolean() }).strict();
export const revokeSessionsSchema = z.object({ familyIds: z.array(z.uuid()).min(1).max(100) }).strict();
export type SessionOverview = z.infer<typeof sessionOverviewSchema>;
export type RevokeSessionsInput = z.infer<typeof revokeSessionsSchema>;
export const securityOperations = [
  { path: "/api/v1/auth/sessions", method: "get", response: sessionOverviewSchema, status: 200, authenticated: true },
  { path: "/api/v1/auth/sessions/revoke", method: "post", request: revokeSessionsSchema, response: sessionOverviewSchema, status: 200, authenticated: true },
] as const;

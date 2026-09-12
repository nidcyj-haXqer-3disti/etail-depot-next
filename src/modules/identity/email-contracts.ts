import { z } from "zod";
import { invitationIdFromNextPath } from "../../shared/auth-continuation";
const invitationNext = z.string().refine(value => invitationIdFromNextPath(value) !== null).optional();
export const registrationSchema = z.object({ email: z.email().max(254), password: z.string().min(12).max(1024), nextPath: invitationNext }).strict();
export const recoveryRequestSchema = z.object({ email: z.email().max(254), nextPath: invitationNext }).strict();
export const emailTokenSchema = z.string().regex(/^[A-Za-z0-9_-]{1,2048}$/);
export const emailConfirmationSchema = z.object({ token: emailTokenSchema }).strict();
export const passwordResetSchema = z.object({ token: emailTokenSchema, password: z.string().min(12).max(1024) }).strict();
export const emailAuthenticationOperations = [
  { path: "/api/v1/auth/register", method: "post", request: registrationSchema, response: z.object({ registrationRequested: z.literal(true) }).strict(), status: 200, authenticated: false },
  { path: "/api/v1/auth/confirm", method: "post", request: emailConfirmationSchema, response: z.object({ confirmed: z.literal(true) }).strict(), status: 200, authenticated: false },
  { path: "/api/v1/auth/recover", method: "post", request: recoveryRequestSchema, response: z.object({ recoveryRequested: z.literal(true) }).strict(), status: 200, authenticated: false },
  { path: "/api/v1/auth/reset-password", method: "post", request: passwordResetSchema, response: z.object({ passwordReset: z.literal(true) }).strict(), status: 200, authenticated: false },
] as const;

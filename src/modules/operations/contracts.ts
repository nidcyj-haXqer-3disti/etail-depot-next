import {z} from "zod";
export const operatorResponseSchema = z.object({ commandId: z.uuid(), expectedVersion: z.int().positive(), message: z.string().trim().min(1).max(2000), resolve: z.boolean() }).strict();
export type OperatorResponse = z.infer<typeof operatorResponseSchema>;


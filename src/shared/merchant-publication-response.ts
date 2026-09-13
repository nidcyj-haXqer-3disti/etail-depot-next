import {z} from "zod";
const money=z.object({minor:z.string().regex(/^[0-9]+$/),currency:z.literal("USD"),formatted:z.string()}).strict();
export const guestPublicationSchema=z.object({id:z.uuid(),version:z.int().positive(),state:z.enum(["AVAILABLE","UNAVAILABLE","REVOKED"]),publicHref:z.string(),merchantName:z.string(),primaryMerchantName:z.string(),description:z.string(),amount:money,usage:z.enum(["ONE_TIME","REUSABLE"]),expiresAt:z.iso.datetime(),mode:z.literal("SANDBOX"),feeStatus:z.literal("NOT_APPLIED")}).strict();
export const guestRevocationReceiptSchema=z.object({commandId:z.uuid(),publicationId:z.uuid(),status:z.literal("REVOKED"),confirmedAt:z.iso.datetime()}).strict();
export const guestPublicationManagementSchema=z.object({channelId:z.uuid(),publication:guestPublicationSchema.nullable(),canPublish:z.boolean(),canRevoke:z.boolean(),revocation:guestRevocationReceiptSchema.optional()}).strict();
export const guestRevocationResultSchema=guestPublicationManagementSchema.extend({revocation:guestRevocationReceiptSchema});
export const publicGuestRequestSchema=z.object({publication:guestPublicationSchema,canStart:z.boolean()}).strict();

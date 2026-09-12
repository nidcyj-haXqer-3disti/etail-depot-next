import {z} from "zod";

const money=z.object({minor:z.string().regex(/^[0-9]+$/),currency:z.literal("USD"),formatted:z.string()}).strict();
export const emptyGuestSchema=z.object({}).strict();
export const publishGuestChannelSchema=z.object({commandId:z.uuid(),expectedChannelVersion:z.int().positive()}).strict();
export const revokeGuestPublicationSchema=z.object({commandId:z.uuid(),expectedVersion:z.int().positive()}).strict();
import {guestPublicationSchema,guestPublicationManagementSchema,publicGuestRequestSchema} from "../../shared/merchant-publication-response";
export {guestPublicationSchema,guestPublicationManagementSchema,publicGuestRequestSchema} from "../../shared/merchant-publication-response";
export const guestOrderProjectionSchema=z.object({
 id:z.uuid(),version:z.int().positive(),publicationId:z.uuid(),merchantName:z.string(),primaryMerchantName:z.string(),description:z.string(),amount:money,expiresAt:z.iso.datetime(),receiptAccessExpiresAt:z.iso.datetime(),createdAt:z.iso.datetime(),
 status:z.enum(["READY","REVIEW","APPROVED","DECLINED","REFUNDED","UNAVAILABLE"]),canPrepare:z.boolean(),canConfirm:z.boolean(),freshRequestHref:z.string(),mode:z.literal("SANDBOX"),feeStatus:z.literal("NOT_APPLIED"),
 attempt:z.object({id:z.uuid(),outcome:z.enum(["APPROVED","DECLINED"]),createdAt:z.iso.datetime()}).strict().nullable(),
 receipt:z.object({paymentId:z.uuid(),reference:z.string(),status:z.enum(["APPROVED","DECLINED","REFUNDED"]),amount:money,createdAt:z.iso.datetime(),refund:z.object({amount:money,createdAt:z.iso.datetime(),reference:z.string()}).strict().nullable()}).strict().nullable(),
}).strict();
export type PublishGuestChannelInput=z.infer<typeof publishGuestChannelSchema>;
export type RevokeGuestPublicationInput=z.infer<typeof revokeGuestPublicationSchema>;
export type GuestPublication=z.infer<typeof guestPublicationSchema>;
export type GuestPublicationManagement=z.infer<typeof guestPublicationManagementSchema>;
export type PublicGuestRequest=z.infer<typeof publicGuestRequestSchema>;
export type GuestOrderProjection=z.infer<typeof guestOrderProjectionSchema>;

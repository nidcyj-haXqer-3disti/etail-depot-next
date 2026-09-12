import {z} from "zod";
const money=z.object({minor:z.string().regex(/^[0-9]+$/),currency:z.literal("USD"),formatted:z.string()}).strict();
export const networkCapabilitiesSchema=z.object({provider:z.literal("ETAIL_SANDBOX_NETWORK"),mode:z.literal("SANDBOX"),instruments:z.array(z.object({id:z.enum(["visa","mastercard","amex","discover"]),network:z.string()}).strict())}).strict();
export const networkCheckoutProjectionSchema=z.object({id:z.uuid(),publicationId:z.uuid(),state:z.enum(["PROCESSING","PAID","REFUNDED"]),merchantName:z.string(),businessName:z.string(),description:z.string(),amount:money,fee:money,instrumentId:z.enum(["visa","mastercard","amex","discover"]),network:z.string(),createdAt:z.iso.datetime(),receipt:z.object({paymentId:z.uuid(),reference:z.string(),paidAt:z.iso.datetime(),refundedAt:z.iso.datetime().nullable(),refundReference:z.string().nullable()}).strict().nullable()}).strict();
export type NetworkCheckoutProjection=z.infer<typeof networkCheckoutProjectionSchema>;
export type NetworkCapabilities=z.infer<typeof networkCapabilitiesSchema>;

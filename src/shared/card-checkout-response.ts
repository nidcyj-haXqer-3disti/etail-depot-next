import {z} from "zod";
const moneySchema=z.object({minor:z.string().regex(/^[1-9][0-9]{0,11}$/),currency:z.literal("USD"),formatted:z.string()}).strict();
export const cardCheckoutReviewSchema=z.object({id:z.uuid(),publicationId:z.uuid(),merchantName:z.string(),description:z.string(),amount:moneySchema,cardName:z.string(),lastFour:z.string().regex(/^[0-9]{4}$/),createdAt:z.iso.datetime(),receipt:z.object({paymentId:z.uuid(),reference:z.string(),paidAt:z.iso.datetime(),refundedAt:z.iso.datetime().nullable()}).strict().nullable()}).strict();

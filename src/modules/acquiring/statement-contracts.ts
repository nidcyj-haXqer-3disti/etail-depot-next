import {z} from "zod";
import {merchantActivityQuerySchema} from "../../shared/merchant-activity";

const money=z.object({minor:z.string().regex(/^-?\d+$/),currency:z.literal("USD"),formatted:z.string()}).strict();
export const merchantStatementRowSchema=z.object({
 id:z.uuid(),reference:z.string(),at:z.iso.datetime(),description:z.string(),
 kind:z.enum(["payment","refund","payout","settlement","funding","transfer"]),
 status:z.enum(["COMPLETED","PENDING","FAILED","DECLINED","REFUNDED"]),
 effect:z.enum(["CREDIT","DEBIT","INTERNAL","NONE"]),
 amount:money,credit:money.nullable(),debit:money.nullable(),
 terminalId:z.uuid().nullable(),terminalName:z.string().nullable(),businessName:z.string(),
 href:z.string().nullable(),journalId:z.uuid().nullable(),
}).strict();
export type MerchantStatementRow=z.infer<typeof merchantStatementRowSchema>;
export const merchantStatementProjectionSchema=z.object({
 query:merchantActivityQuerySchema,range:z.object({from:z.string(),to:z.string()}).strict(),asOf:z.iso.datetime(),
 name:z.string(),available:z.boolean(),completeScope:z.boolean(),includesAccountMovements:z.boolean(),
 rows:z.array(merchantStatementRowSchema),totalCount:z.int().nonnegative(),pageCount:z.int().positive(),pageSize:z.int().positive(),
 totals:z.array(z.object({currency:z.literal("USD"),credit:money,debit:money}).strict()),
}).strict();
export type MerchantStatementProjection=z.infer<typeof merchantStatementProjectionSchema>;

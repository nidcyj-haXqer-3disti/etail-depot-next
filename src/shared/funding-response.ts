import {z} from "zod";
const id=z.uuid();
const money=z.object({minor:z.string().regex(/^(0|[1-9][0-9]*)$/),currency:z.literal("USD"),formatted:z.string().min(1)}).strict();
export const personSpendingSchema=z.object({personId:id,monthlyLimit:money,spentThisMonth:money,remainingThisMonth:money,available:money,version:z.int().nonnegative(),periodStart:z.iso.datetime(),periodEnd:z.iso.datetime(),timeZone:z.literal("UTC")}).strict();
export const topupReceiptSchema=z.object({id,serviceId:id,amount:money,source:z.literal("SANDBOX_BANK"),sourceLabel:z.string().min(1),status:z.literal("COMPLETED"),createdAt:z.iso.datetime(),reference:z.string().min(1)}).strict();
export const fundingIntentSchema=z.object({id,serviceId:id,amount:money,sourceLabel:z.string().min(1),createdAt:z.iso.datetime(),receipt:topupReceiptSchema.nullable()}).strict().refine(intent=>!intent.receipt||(intent.receipt.serviceId===intent.serviceId&&intent.receipt.amount.minor===intent.amount.minor&&intent.receipt.amount.currency===intent.amount.currency),{message:"The saved receipt does not match its funding review.",path:["receipt"]});

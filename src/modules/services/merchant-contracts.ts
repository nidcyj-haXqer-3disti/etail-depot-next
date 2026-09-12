import { z } from "zod";

export const createMerchantServiceSchema=z.object({commandId:z.uuid(),moneyAccountId:z.uuid().optional(),displayName:z.string().trim().min(1).max(80).refine(value=>!/[\u0000-\u001f\u007f-\u009f]/.test(value),"Use a plain-text name")}).strict();
export type CreateMerchantServiceInput=z.infer<typeof createMerchantServiceSchema>;

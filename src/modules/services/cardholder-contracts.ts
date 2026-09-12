import { z } from "zod";
export const createCardholderServiceSchema=z.object({commandId:z.uuid(),moneyAccountId:z.uuid().optional(),displayName:z.string().trim().min(1).max(80).regex(/^[^\u0000-\u001f\u007f-\u009f]+$/).default("My cards")}).strict();
export type CreateCardholderServiceInput=z.input<typeof createCardholderServiceSchema>;
export interface CreatedCardholderService {serviceId:string;kind:"CARDHOLDER";nextHref:string}

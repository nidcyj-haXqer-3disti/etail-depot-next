import {z} from "zod";
const plain=(max:number)=>z.string().trim().max(max).refine(value=>!/[\u0000-\u001f\u007f-\u009f]/.test(value),"Use plain text");
export const openDisputeSchema=z.object({commandId:z.uuid(),reason:z.enum(["NOT_RECEIVED","NOT_AS_DESCRIBED","DUPLICATE","OTHER"]),message:plain(2000).min(1)}).strict();
export const respondDisputeSchema=z.object({commandId:z.uuid(),expectedVersion:z.int().positive(),message:plain(2000).min(1),evidence:plain(4000).min(1)}).strict();
export const reviewDisputeSchema=z.object({commandId:z.uuid(),expectedVersion:z.int().positive(),outcome:z.enum(["MORE_INFORMATION","CLOSED_NO_REFUND","REFUND_RECOMMENDED"]),message:plain(2000).min(1)}).strict();
export type OpenDisputeInput=z.infer<typeof openDisputeSchema>;
export type RespondDisputeInput=z.infer<typeof respondDisputeSchema>;
export type ReviewDisputeInput=z.infer<typeof reviewDisputeSchema>;
export {disputeProjectionSchema,payerDisputeProjectionSchema,type DisputeProjection} from "../../shared/dispute-response";

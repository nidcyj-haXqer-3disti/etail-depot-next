import { z } from "zod";
const minor=z.string().regex(/^(0|[1-9][0-9]{0,10})$/);
export const membershipEstimateInputSchema=z.object({salesMinor:minor,paymentCount:z.int().min(0).max(1000000),purchasesMinor:minor,brandCostPercent:z.string().regex(/^(?:[0-9](?:\.[0-9]{1,4})?|10(?:\.0{1,4})?)$/).nullable()}).strict();
export type MembershipEstimateInput=z.infer<typeof membershipEstimateInputSchema>;
const amount=z.object({minor:z.string().regex(/^-?(0|[1-9][0-9]*)$/),formatted:z.string()}).strict();
const plan=z.object({id:z.enum(["SELECT","PREMIER"]),annualFee:amount,processing:amount.nullable(),baseCashback:amount,additionalSpending:amount,providerFeeBonus:amount,combinedBonus:amount,netAnnualCost:amount.nullable(),brandCosts:amount.nullable(),providerFees:amount,cap:amount}).strict();
export const membershipEstimateSchema=z.object({basis:z.literal("PLANNING_ESTIMATE"),inputs:membershipEstimateInputSchema,plans:z.array(plan).length(2),difference:amount.nullable(),disclosure:z.string()}).strict();
export type MembershipEstimate=z.infer<typeof membershipEstimateSchema>;
export const membershipOperations=[{path:"/api/v1/membership/estimate",method:"post",request:membershipEstimateInputSchema,response:membershipEstimateSchema,status:200,authenticated:true}] as const;

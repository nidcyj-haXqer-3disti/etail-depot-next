import {randomUUID} from "node:crypto";
import {expect,it} from "vitest";
import {fundingIntentSchema} from "../../src/shared/funding-response";

it("accepts an unconfirmed funding review and only its matching completed receipt",()=>{
 const serviceId=randomUUID(),amount={minor:"12500",currency:"USD" as const,formatted:"$125.00"};
 const intent={id:randomUUID(),serviceId,amount,sourceLabel:"Sandbox bank",createdAt:"2026-09-12T01:00:00.000Z",receipt:null};
 const receipt={id:randomUUID(),serviceId,amount,source:"SANDBOX_BANK" as const,sourceLabel:"Sandbox bank",status:"COMPLETED" as const,createdAt:"2026-09-12T01:01:00.000Z",reference:"ADD-REVIEW"};
 expect(fundingIntentSchema.safeParse(intent).success).toBe(true);
 expect(fundingIntentSchema.safeParse({...intent,receipt}).success).toBe(true);
 expect(fundingIntentSchema.safeParse({...intent,receipt:{...receipt,serviceId:randomUUID()}}).success).toBe(false);
 expect(fundingIntentSchema.safeParse({...intent,receipt:{...receipt,amount:{...amount,minor:"12501",formatted:"$125.01"}}}).success).toBe(false);
 expect(fundingIntentSchema.safeParse({...intent,receipt:{...receipt,status:"PENDING"}}).success).toBe(false);
});

import { expect,it } from "vitest";
import { estimateMembership,sampleMembershipInput } from "../../src/modules/membership/estimate";
import { membershipEstimateSchema } from "../../src/modules/membership/contracts";
it("reproduces the source annual scenario: Select $3200, Premier $2600, difference $600",()=>{
  const result=membershipEstimateSchema.parse(estimateMembership(sampleMembershipInput));
  expect(result.plans.map(plan=>plan.netAnnualCost?.minor)).toEqual(["320000","260000"]);expect(result.difference?.minor).toBe("60000");
  expect(result.plans[1]?.combinedBonus.minor).toBe("28000");
});
it("keeps unknown brand costs unknown rather than pricing them as zero",()=>{
  const result=estimateMembership({...sampleMembershipInput,brandCostPercent:null});
  expect(result.plans[1]?.brandCosts).toBeNull();expect(result.plans[1]?.netAnnualCost).toBeNull();expect(result.difference).toBeNull();expect(result.plans[0]?.netAnnualCost?.minor).toBe("320000");
});
it("uses a single combined cap across both bonus sources and leaves base cashback outside it",()=>{
  const result=estimateMembership({...sampleMembershipInput,purchasesMinor:"24000000"});
  expect(result.plans[1]?.combinedBonus.minor).toBe("30000");expect(result.plans[1]?.baseCashback.minor).toBe("120000");
});
it("models zero activity without inventing brand charges and preserves exact subcent inputs until display",()=>{
  const zero=estimateMembership({salesMinor:"0",paymentCount:0,purchasesMinor:"0",brandCostPercent:null});
  expect(zero.plans.map(plan=>plan.netAnnualCost?.minor)).toEqual(["12000","30000"]);
  const small=estimateMembership({salesMinor:"1",paymentCount:1,purchasesMinor:"1",brandCostPercent:"1.2345"});
  expect(small.plans[1]?.netAnnualCost?.minor).toBe("30024");
});
it("rejects inconsistent counts, fractional minor units, excessive rates and injected service scope",()=>{
  for(const input of [{...sampleMembershipInput,paymentCount:0},{...sampleMembershipInput,salesMinor:"1.00"},{...sampleMembershipInput,brandCostPercent:"10.01"},{...sampleMembershipInput,serviceId:"x"}])expect(()=>estimateMembership(input)).toThrow();
});

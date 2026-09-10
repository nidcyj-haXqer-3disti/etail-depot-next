import rules from "../../../contracts/commercial-rules.json" with {type:"json"};
import { membershipEstimateInputSchema, type MembershipEstimateInput, type MembershipEstimate } from "./contracts";
import { SecurityError } from "../../platform/security/origin";

const SCALE=1000000n;
function rate(value:string) {const [whole,fraction=""]=value.split(".");if(!/^\d+(?:\.\d{1,6})?$/.test(value))throw new Error("Unsupported source rate precision");return BigInt(whole!)*SCALE+BigInt(fraction.padEnd(6,"0"));}
/** Display rounding for a non-posting estimate only; D14 financial posting remains unresolved. */
function display(scaledMinor:bigint) {const negative=scaledMinor<0n;const absolute=negative?-scaledMinor:scaledMinor;const rounded=(absolute+SCALE/2n)/SCALE;const value=negative&&rounded!==0n?-rounded:rounded;return {minor:value.toString(),formatted:`${value<0n?"−":""}$${new Intl.NumberFormat("en-US").format(rounded/100n)}.${(rounded%100n).toString().padStart(2,"0")}`};}
export const sampleMembershipInput:MembershipEstimateInput={salesMinor:"10000000",paymentCount:1000,purchasesMinor:"2400000",brandCostPercent:"1.90"};
export function estimateMembership(raw:unknown):MembershipEstimate {
  const parsed=membershipEstimateInputSchema.safeParse(raw);if(!parsed.success)throw new SecurityError("INVALID_REQUEST",422);
  const input=parsed.data;const sales=BigInt(input.salesMinor),purchases=BigInt(input.purchasesMinor),count=BigInt(input.paymentCount);
  if((sales===0n)!==(count===0n)||count>sales)throw new SecurityError("PAYMENT_COUNT_MISMATCH",422);
  const select=rules.plans.SELECT,premier=rules.plans.PREMIER;
  const selectProcessing=sales*rate(select.processing_rate)+count*BigInt(select.processing_fixed_minor)*SCALE;
  const base=purchases*rate(select.base_cashback_rate);
  const provider=sales*rate(premier.provider_fee_rate)+count*BigInt(premier.provider_fixed_minor)*SCALE;
  const spending=purchases*rate(premier.additional_spending_bonus_rate),feeBonus=provider*rate(premier.provider_fee_bonus_rate)/SCALE;
  const cap=BigInt(premier.combined_bonus_cap_minor)*SCALE,combined=spending+feeBonus<cap?spending+feeBonus:cap;
  // Percentage input has at most four decimal places, so dividing its rate by 100 is exact here.
  const brand=input.brandCostPercent===null?(sales===0n?0n:null):sales*rate(input.brandCostPercent)/100n;
  const annualSelect=BigInt(select.annual_fee_minor)*SCALE,annualPremier=BigInt(premier.annual_fee_minor)*SCALE;
  const netSelect=annualSelect+selectProcessing-base,processingPremier=brand===null?null:brand+provider;
  const netPremier=processingPremier===null?null:annualPremier+processingPremier-base-combined;
  return {basis:"PLANNING_ESTIMATE",inputs:input,plans:[
    {id:"SELECT",annualFee:display(annualSelect),processing:display(selectProcessing),baseCashback:display(base),additionalSpending:display(0n),providerFeeBonus:display(0n),combinedBonus:display(0n),netAnnualCost:display(netSelect),brandCosts:null,providerFees:display(selectProcessing),cap:display(0n)},
    {id:"PREMIER",annualFee:display(annualPremier),processing:processingPremier===null?null:display(processingPremier),baseCashback:display(base),additionalSpending:display(spending),providerFeeBonus:display(feeBonus),combinedBonus:display(combined),netAnnualCost:netPremier===null?null:display(netPremier),brandCosts:brand===null?null:display(brand),providerFees:display(provider),cap:display(cap)},
  ],difference:netPremier===null?null:display(netSelect-netPremier),disclosure:"This annual estimate uses eligible domestic online payments and settled purchases across your services. Assumed brand costs are estimates, not agreed rates. Only eligible activity earns rewards. Amounts are rounded to the nearest cent for display; they are not charges, card balances or earned rewards. Calculating an estimate does not buy or change a plan."};
}

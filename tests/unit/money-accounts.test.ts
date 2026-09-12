import {describe,expect,it} from "vitest";
import {moneyCommandSchema} from "../../src/modules/money/contracts";
import {moneyFundingIntentSchema,moneyWithdrawalReceiptSchema,moneyOverviewSchema} from "../../src/modules/money/api-contracts";
import {formatMoney} from "../../src/modules/money/format";
import {evaluate,type MoneyPolicyScope} from "../../src/modules/policy/evaluate";
const account="10000000-0000-4000-8000-000000000001",command="10000000-0000-4000-8000-000000000002";
describe("purpose-bound owner money",()=>{
 it("keeps exact pennies and amounts above Number safe integers",()=>{expect(formatMoney(9007199254740993n)).toEqual({minor:"9007199254740993",currency:"USD",formatted:"$90,071,992,547,409.93"});expect(formatMoney(-1n).formatted).toBe("-$0.01");});
 it.each(["0","-1","1.00","01","1e3","1000000000000"])("rejects unsafe wire amount %s",amountMinor=>{expect(moneyCommandSchema.safeParse({commandId:command,amountMinor}).success).toBe(false);});
 it("rejects browser-supplied owner, destination and outcome fields",()=>{for(const field of [{ownerPersonId:command},{destination:"changed-bank"},{outcome:"COMPLETED"}])expect(moneyCommandSchema.safeParse({commandId:command,amountMinor:"1",...field}).success).toBe(false);});
 it("requires the same exact owner/account for funds actions",()=>{const scope:MoneyPolicyScope={targetKind:"MONEY_ACCOUNT",actorPersonId:"owner",ownerPersonId:"owner",moneyAccountId:account,resourceMoneyAccountId:account,status:"ACTIVE"};for(const action of ["money.read","money.add","money.withdraw"]){expect(evaluate(scope,action).allowed).toBe(true);expect(evaluate({...scope,actorPersonId:"cardholder"},action).allowed).toBe(false);expect(evaluate({...scope,resourceMoneyAccountId:command},action).allowed).toBe(false);}expect(evaluate({...scope,status:"SUSPENDED"},"money.withdraw").allowed).toBe(false);});
 it("requires account identity and complete success shape for saved reviews",()=>{const review={id:command,moneyAccountId:account,receiptId:command,amount:formatMoney(100n),sourceLabel:"Funding balance",createdAt:"2026-09-12T00:00:00.000Z",receipt:null};expect(moneyFundingIntentSchema.safeParse(review).success).toBe(true);expect(moneyFundingIntentSchema.safeParse({...review,moneyAccountId:undefined}).success).toBe(false);expect(moneyWithdrawalReceiptSchema.safeParse({id:command,status:"COMPLETED"}).success).toBe(false);});
 it("rejects unsafe or differently scoped money history receipt links",()=>{
  const row={id:command,kind:"MONEY_FUNDING",label:"Money added",amount:formatMoney(100n),createdAt:"2026-09-12T00:00:00.000Z",referenceId:command,href:`/money-accounts/${account}?task=add&review=${command}`};
  const overview={id:account,displayName:"Card money",serviceKind:"CARDHOLDER",currency:"USD",status:"ACTIVE",version:1,services:[],available:formatMoney(100n),pendingWithdrawals:formatMoney(0n),history:[row],page:0,hasMore:false,canAddMoney:true,canWithdraw:true};
  expect(moneyOverviewSchema.safeParse(overview).success).toBe(true);
  for(const href of [`/money-accounts/${command}?task=add&review=${command}`,`/money-accounts/${account}?task=withdraw&review=${command}`,`https://example.test/money-accounts/${account}?task=add&review=${command}`,`/money-accounts/${account}?task=add&review=${command}&owner=other`])expect(moneyOverviewSchema.safeParse({...overview,history:[{...row,href}]}).success).toBe(false);
  expect(moneyOverviewSchema.safeParse({...overview,history:[{...row,href:null}]}).success).toBe(true);
 });
 it("requires processing time only for a finalized withdrawal receipt",()=>{
  const receipt={id:command,intentId:command,moneyAccountId:account,amount:formatMoney(100n),destinationLabel:"Withdrawal balance",status:"PENDING",createdAt:"2026-09-12T00:00:00.000Z",completedAt:null,reference:"OUT-TEST"};
  expect(moneyWithdrawalReceiptSchema.safeParse(receipt).success).toBe(true);
  expect(moneyWithdrawalReceiptSchema.safeParse({...receipt,status:"COMPLETED"}).success).toBe(false);
  expect(moneyWithdrawalReceiptSchema.safeParse({...receipt,completedAt:"2026-09-12T00:00:01.000Z"}).success).toBe(false);
  expect(moneyWithdrawalReceiptSchema.safeParse({...receipt,status:"FAILED",completedAt:"2026-09-11T23:59:59.000Z"}).success).toBe(false);
  expect(moneyWithdrawalReceiptSchema.safeParse({...receipt,status:"COMPLETED",completedAt:"2026-09-12T00:00:01.000Z"}).success).toBe(true);
 });

});
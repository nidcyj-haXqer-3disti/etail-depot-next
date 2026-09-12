import { describe, expect, it } from "vitest";
import { randomUUID } from "node:crypto";
import { formatMoney } from "../../src/modules/workspace/service";
import { cardDraftCommandSchema, cardControlCommandSchema, notificationCommandSchema } from "../../src/modules/workspace/contracts";
import { evaluate, type PolicyScope } from "../../src/modules/policy/evaluate";

describe("local workspace contracts and exact display money", () => {
  it("formats integer minor units without Number conversion or precision loss", () => {
    expect(formatMoney(900719925474099312n)).toEqual({minor:"900719925474099312",currency:"USD",formatted:"$9,007,199,254,740,993.12"});
    expect(formatMoney(-1n).formatted).toBe("-$0.01");
    expect(formatMoney(0n).formatted).toBe("$0.00");
  });
  it("accepts an explicit total card allowance while refusing funding and permission fields", () => {
    const base = {allowanceMinor:"0",commandId:randomUUID(),expectedVersion:1,holderId:randomUUID(),nickname:"Saved sample",format:"VIRTUAL"};
    expect(cardDraftCommandSchema.safeParse(base).success).toBe(true);
    for (const delta of [{role:"OWNER"},{format:"REAL"},{requestedLimitMinor:"10000"},{monthlyLimitMinor:"10000"},{amountMinor:"10000"},{balanceMinor:"10000"},{nickname:""},{nickname:"x".repeat(61)}]) expect(cardDraftCommandSchema.safeParse({...base,...delta}).success).toBe(false);
    for(const allowanceMinor of ["-1","1.23","1000000000000"])expect(cardDraftCommandSchema.safeParse({...base,allowanceMinor}).success).toBe(false);
    expect(cardControlCommandSchema.safeParse({commandId:randomUUID(),expectedVersion:1,action:"issue"}).success).toBe(false);
    expect(notificationCommandSchema.safeParse({commandId:randomUUID(),expectedVersion:1,serviceActivity:true,cardControls:true,caseUpdates:true,personId:randomUUID()}).success).toBe(false);
  });
});
const scope:PolicyScope={actorPersonId:"a",serviceId:"x",resourceServiceId:"x",membershipPersonId:"a",membershipServiceId:"x",membershipState:"ACCEPTED",primaryPersonId:"a",primaryMembershipState:"ACCEPTED",role:"OWNER",serviceKind:"CARDHOLDER",status:"ACTIVE"};
describe("explicit grants use the single evaluator",()=>{
 it("requires both read and control grants",()=>{expect(evaluate({...scope,grants:["cards.freeze"]},"cards.freeze").allowed).toBe(false);expect(evaluate({...scope,grants:["cards.read","cards.freeze"]},"cards.freeze").allowed).toBe(true);});
 it("does not issue or spend from responsibility alone",()=>{for(const action of ["cards.create","cards.purchase","spend.authorize"])expect(evaluate(scope,action).allowed).toBe(false);});
 it("a Merchant service cannot acquire Cardholder authority through grants",()=>{for(const action of ["cards.read","cards.request","cards.create","cards.purchase"])expect(evaluate({...scope,serviceKind:"MERCHANT",grants:["cards.read","cards.hold","cards.request","cards.create","cards.purchase"]},action).allowed).toBe(false);});
});

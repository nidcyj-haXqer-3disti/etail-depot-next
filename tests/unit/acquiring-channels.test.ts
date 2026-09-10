import {randomUUID} from "node:crypto";
import {describe,expect,it} from "vitest";
import {createChannelSchema,updateChannelSchema,createSubmerchantSchema,pauseMerchantSchema} from "../../src/modules/acquiring/contracts";
import {readMerchantDirectoryQuery} from "../../src/modules/acquiring/routes";

const input=()=>({commandId:randomUUID(),description:"Fictional handmade item",amountMinor:"1250",currency:"USD",usage:"ONE_TIME",expiresAt:"2026-10-01T00:00:00.000Z",presentations:["WEB"],visibility:"CREATOR_PRIVATE"});
describe("strict channel and merchant relationship contracts",()=>{
  it("accepts the seven presentation choices without making receipts or publishing another payable channel",()=>{
    expect(createChannelSchema.safeParse({...input(),presentations:["SMS","EMAIL","INVOICE","BILL","SOCIAL","QR","WEB"]}).success).toBe(true);
    for(const presentations of [[],["WEB","WEB"],["RECEIPT"],["CARD"],["TEXT"]])expect(createChannelSchema.safeParse({...input(),presentations}).success).toBe(false);
    for(const extra of [{publish:true},{status:"ACTIVE"},{paymentUrl:"https://example.invalid/pay"},{externalMid:"invented"},{gatewayId:randomUUID()},{creatorId:randomUUID()},{merchantUnitId:randomUUID()}])expect(createChannelSchema.safeParse({...input(),...extra}).success).toBe(false);
  });
  it("retains exact amount bounds and requires explicit visibility and optimistic edit version",()=>{
    for(const amountMinor of ["0","01","-1","1.25","1e3","1000000000000",1250])expect(createChannelSchema.safeParse({...input(),amountMinor}).success).toBe(false);
    expect(createChannelSchema.safeParse({...input(),amountMinor:"999999999999",visibility:"ASSIGNED"}).success).toBe(true);
    expect(createChannelSchema.safeParse({...input(),visibility:"PUBLIC"}).success).toBe(false);
    expect(updateChannelSchema.safeParse(input()).success).toBe(false);
    expect(updateChannelSchema.safeParse({...input(),expectedVersion:1}).success).toBe(true);
  });
  it("creates a named submerchant without accepting caller-supplied responsibility or consent",()=>{
    const request={commandId:randomUUID(),displayName:"Named collection unit"};
    expect(createSubmerchantSchema.safeParse(request).success).toBe(true);
    for(const extra of [{displayName:" "},{masterId:randomUUID()},{status:"ACTIVE"},{primaryPersonId:randomUUID()}])expect(createSubmerchantSchema.safeParse({...request,...extra}).success).toBe(false);
    expect(pauseMerchantSchema.safeParse({commandId:randomUUID(),expectedVersion:1,reason:""}).success).toBe(false);
  });
  it("rejects duplicated or foreign directory query scope",()=>{
    const id=randomUUID();expect(()=>readMerchantDirectoryQuery(new URLSearchParams({serviceId:id}))).toThrow("INVALID_REQUEST");
    expect(readMerchantDirectoryQuery(new URLSearchParams())).toEqual({});
    for(const query of [`serviceId=${id}&serviceId=${id}`,"serviceId=bad","personId=someone","masterServiceId=foreign"])expect(()=>readMerchantDirectoryQuery(new URLSearchParams(query))).toThrow("INVALID_REQUEST");
  });
});

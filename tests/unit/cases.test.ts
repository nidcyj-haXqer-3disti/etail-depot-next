import { randomUUID } from "node:crypto";
import { describe, expect, it } from "vitest";
import { createSupportCaseSchema, addSupportMessageSchema, withdrawSupportCaseSchema, supportCaseQuerySchema } from "../../src/modules/cases/contracts";
const create={commandId:randomUUID(),topic:"SERVICE",subject:"A question",message:"Please retain this explanation."};
describe("support case input boundaries",()=>{
  it("requires an explicit supported topic and nonblank bounded text",()=>{
    expect(createSupportCaseSchema.parse({...create,subject:"  A question  "})).toMatchObject({subject:"A question",transactionId:null});
    for(const input of [{...create,topic:"REFUND_APPROVED"},{...create,subject:" "},{...create,message:""},{...create,subject:"x".repeat(101)},{...create,message:"x".repeat(2001)},{...create,message:"bad\u0000text"}])expect(createSupportCaseSchema.safeParse(input).success).toBe(false);
  });
  it("rejects caller-invented identity, status, permission and routing fields",()=>{
    for(const field of ["serviceId","creatorId","status","canUpdate","nextActor","agentId","delivered"])expect(createSupportCaseSchema.safeParse({...create,[field]:"injected"}).success).toBe(false);
    expect(createSupportCaseSchema.safeParse({...create,transactionId:"not-an-id"}).success).toBe(false);
  });
  it("requires positive versions and bounded update or withdrawal explanations",()=>{
    const base={commandId:randomUUID(),expectedVersion:1};
    expect(addSupportMessageSchema.safeParse({...base,message:"A new detail"}).success).toBe(true);
    for(const expectedVersion of [0,-1,1.5,2147483647])expect(addSupportMessageSchema.safeParse({...base,expectedVersion,message:"update"}).success).toBe(false);
    expect(withdrawSupportCaseSchema.safeParse({...base,reason:" "}).success).toBe(false);
    expect(withdrawSupportCaseSchema.safeParse({...base,reason:"x".repeat(501)}).success).toBe(false);
  });
  it("bounds list queries and permits only stable known states and UUID cursors",()=>{
    expect(supportCaseQuerySchema.parse({})).toEqual({q:""});
    expect(supportCaseQuerySchema.parse({status:"RESOLVED"})).toEqual({q:"",status:"RESOLVED"});
    for(const query of [{q:"x".repeat(101)},{status:"ESCALATED"},{cursor:"yesterday"},{creatorId:randomUUID()}])expect(supportCaseQuerySchema.safeParse(query).success).toBe(false);
  });
});

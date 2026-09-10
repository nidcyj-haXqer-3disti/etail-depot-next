import {describe,expect,it} from "vitest";
import {randomUUID} from "node:crypto";
import {createChannelSchema,updateMerchantSetupSchema} from "../../src/modules/acquiring/contracts";
import {evaluate,type PolicyScope} from "../../src/modules/policy/evaluate";
const scope:PolicyScope={actorPersonId:"actor",serviceId:"merchant",resourceServiceId:"merchant",membershipPersonId:"actor",membershipServiceId:"merchant",membershipState:"ACCEPTED",role:"PRIMARY",serviceKind:"MERCHANT",status:"DRAFT",primaryPersonId:"actor",primaryMembershipState:"ACCEPTED",grants:[]};
describe("acquiring input and central permissions",()=>{
 it("uses strict exact amount strings and rejects payment/publication authority injection",()=>{
  const input={commandId:randomUUID(),description:"Fictional item",amountMinor:"999999999999",currency:"USD",usage:"REUSABLE",expiresAt:"2026-10-01T00:00:00.000Z",presentations:["WEB"],visibility:"CREATOR_PRIVATE"};
  expect(createChannelSchema.safeParse(input).success).toBe(true);
  for(const amountMinor of ["0","-1","01","12.5","1e2","1000000000000",12])expect(createChannelSchema.safeParse({...input,amountMinor}).success).toBe(false);
  for(const extra of [{publish:true},{serviceId:randomUUID()},{creatorId:randomUUID()},{currency:"EUR"},{description:"bad\u0000name"}])expect(createChannelSchema.safeParse({...input,...extra}).success).toBe(false);
 });
 it("keeps legal party, selling name and responsible applicant distinct and forbids browser-set decisions",()=>{
  const input={commandId:randomUUID(),expectedVersion:1,legalEntityType:null,sellingName:"",legalName:"",activityDescription:"",country:"US",fictionalDetailsConfirmed:false};
  expect(updateMerchantSetupSchema.safeParse(input).success).toBe(true);
  for(const extra of [{merchantStatus:"APPROVED"},{responsiblePersonId:randomUUID()},{country:"CA"},{legalName:"x".repeat(101)}])expect(updateMerchantSetupSchema.safeParse({...input,...extra}).success).toBe(false);
 });
 it("requires explicit Merchant grants and never infers write permission from role or household context",()=>{
  expect(evaluate(scope,"acquiring.setup").allowed).toBe(false);
  expect(evaluate({...scope,grants:["settlements.read"]},"acquiring.read").allowed).toBe(false);
  expect(evaluate({...scope,grants:["acquiring.setup"]},"acquiring.setup").allowed).toBe(false);
  const granted={...scope,grants:["acquiring.read","acquiring.setup","channels.create"]};
  expect(evaluate(granted,"acquiring.setup").allowed).toBe(true);
  expect(evaluate({...granted,actorPersonId:"other",membershipPersonId:"other",role:"SECONDARY"},"acquiring.setup").allowed).toBe(false);
  expect(evaluate({...granted,serviceKind:"CARDHOLDER"},"acquiring.read").allowed).toBe(false);
  expect(evaluate({...granted,membershipState:"REVOKED"},"acquiring.read").allowed).toBe(false);
  expect(evaluate(granted,"spend.authorize").allowed).toBe(false);expect(evaluate(granted,"acquiring.approve").allowed).toBe(false);
 });
});

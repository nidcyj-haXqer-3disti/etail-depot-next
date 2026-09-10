import {randomUUID} from "node:crypto";
import {expect,it} from "vitest";
import {evaluate,type MerchantPolicyScope} from "../../src/modules/policy/evaluate";
import {createMerchantInvitationSchema} from "../../src/modules/access/merchant-contracts";
const base:MerchantPolicyScope={targetKind:"MERCHANT_UNIT",actorPersonId:"helper",merchantUnitId:"unit",resourceMerchantUnitId:"unit",serviceId:"merchant",masterServiceId:"merchant",unitKind:"SUB",mode:"OPERATING",available:true,operating:true,primaryAccess:false,canManageFunds:false,authority:{kind:"MERCHANT_ASSIGNMENT",personId:"helper",membershipVersion:null},grants:["merchant.read","channels.read","channels.create"],delegableActions:[]};
it("exact merchant grants cannot become Cardholder access, primary oversight or transfer authority",()=>{
 expect(evaluate(base,"channels.create").allowed).toBe(true);
 for(const action of ["service.read","cards.read","balances.read","merchant.units.create","gateway.manage","payments.refund","payouts.manage"])expect(evaluate({...base,grants:[...base.grants,action,"payments.read"]},action).allowed).toBe(false);
});
it("resource, actor, current authority and read prerequisite checks cannot be bypassed",()=>{
 for(const patch of [{resourceMerchantUnitId:"sibling"},{masterServiceId:"foreign"},{available:false},{operating:false},{authority:null},{actorPersonId:"stranger"},{grants:["merchant.read","channels.create"]}])expect(evaluate({...base,...patch},"channels.create").allowed).toBe(false);
});
it("paused primary oversight is read-only and retains explicit payment read requirements",()=>{
 const primary={...base,operating:false,mode:"OVERSIGHT" as const,primaryAccess:true,canManageFunds:true,authority:{kind:"PRIMARY_MEMBER" as const,personId:"helper",membershipVersion:1}};
 expect(evaluate(primary,"channels.read").allowed).toBe(true);expect(evaluate(primary,"channels.create").allowed).toBe(false);expect(evaluate(primary,"payments.read").allowed).toBe(false);expect(evaluate({...primary,grants:[...primary.grants,"payments.read"]},"payments.read").allowed).toBe(true);
 expect(evaluate({...primary,primaryAccess:false},"channels.read").allowed).toBe(false);
});
it("only the intended recipient can accept an unexpired invitation in an operating unit",()=>{
 const recipient={...base,mode:"INVITATION_RECIPIENT" as const,authority:null,grants:[],invitation:{recipientPersonId:"helper",status:"PENDING",expiresAt:new Date("2026-09-11Z"),accessExpiresAt:new Date("2026-09-12Z"),now:new Date("2026-09-10Z")}};
 expect(evaluate(recipient,"invitation.accept").allowed).toBe(true);expect(evaluate({...recipient,actorPersonId:"stranger"},"invitation.accept").allowed).toBe(false);expect(evaluate({...recipient,operating:false},"invitation.accept").allowed).toBe(false);expect(evaluate({...recipient,invitation:{...recipient.invitation,now:recipient.invitation.expiresAt}},"invitation.accept").allowed).toBe(false);
});
it("invitation input rejects legacy host dependency, inherited authority and financial grants",()=>{
 const valid={commandId:randomUUID(),recipientId:randomUUID(),permissions:["merchant.read","channels.read"],delegablePermissions:[],expiresInDays:3,accessExpiresInDays:7};expect(createMerchantInvitationSchema.safeParse(valid).success).toBe(true);
 for(const patch of [{role:"PRIMARY"},{serviceId:randomUUID()},{membershipDependent:true},{permissions:["payments.refund"]},{permissions:["merchant.read","merchant.read"]},{sourcePrimaryPersonId:randomUUID()}])expect(createMerchantInvitationSchema.safeParse({...valid,...patch}).success).toBe(false);
});

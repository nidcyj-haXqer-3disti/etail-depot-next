import {randomUUID} from "node:crypto";
import {expect,it} from "vitest";
import {evaluate,type MerchantPolicyScope} from "../../src/modules/policy/evaluate";
import {createMerchantInvitationSchema,TERMINAL_PERMISSIONS} from "../../src/modules/access/merchant-contracts";
const base:MerchantPolicyScope={targetKind:"MERCHANT_TERMINAL",actorPersonId:"helper",terminalId:"terminal",resourceTerminalId:"terminal",serviceId:"merchant",resourceServiceId:"merchant",mode:"OPERATING",available:true,operating:true,ownerAccess:false,canManageFunds:false,authority:{kind:"TERMINAL_ASSIGNMENT",personId:"helper",membershipVersion:1},grants:[...TERMINAL_PERMISSIONS],delegableActions:[]};
it("terminal users can collect and respond to disputes but cannot become cardholders or move funds",()=>{
 for(const action of TERMINAL_PERMISSIONS)expect(evaluate(base,action).allowed).toBe(true);
 for(const action of ["service.read","cards.read","money.read","money.withdraw","merchant.people.invite","merchant.people.revoke","merchant.terminals.create","gateway.manage","payments.refund","payouts.manage","disputes.resolve"])expect(evaluate({...base,grants:[...base.grants,action]},action).allowed).toBe(false);
});
it("resource, actor, current authority and read prerequisite checks cannot be bypassed",()=>{
 for(const patch of [{resourceTerminalId:"sibling"},{resourceServiceId:"foreign"},{available:false},{operating:false},{authority:null},{actorPersonId:"stranger"},{grants:["merchant.read","channels.create"]}])expect(evaluate({...base,...patch},"channels.create").allowed).toBe(false);
});
it("paused owner oversight permits access removal while other operating actions stay unavailable",()=>{
 const owner={...base,operating:false,mode:"OVERSIGHT" as const,ownerAccess:true,canManageFunds:true,authority:{kind:"OWNER_MEMBER" as const,personId:"helper",membershipVersion:1}};
 for(const action of ["channels.read","payments.read","disputes.read"])expect(evaluate(owner,action).allowed).toBe(true);
 for(const action of ["channels.create","payments.refund","disputes.respond"])expect(evaluate({...owner,grants:[...owner.grants,action]},action).allowed).toBe(false);
 expect(evaluate({...owner,grants:[...owner.grants,"merchant.people.revoke"]},"merchant.people.revoke").allowed).toBe(true);
 expect(evaluate({...owner,ownerAccess:false,grants:[...owner.grants,"merchant.people.revoke"]},"merchant.people.revoke").allowed).toBe(false);
 expect(evaluate({...owner,grants:[...owner.grants,"merchant.people.invite"]},"merchant.people.invite").allowed).toBe(false);
 expect(evaluate({...owner,grants:["merchant.read"]},"payments.read").allowed).toBe(false);expect(evaluate({...owner,ownerAccess:false},"channels.read").allowed).toBe(false);
});
it("only the intended recipient can accept an unexpired invitation for an operating terminal",()=>{
 const recipient={...base,mode:"INVITATION_RECIPIENT" as const,authority:null,grants:[],invitation:{recipientPersonId:"helper",status:"PENDING",expiresAt:new Date("2026-09-11Z"),now:new Date("2026-09-10Z")}};
 expect(evaluate(recipient,"invitation.accept").allowed).toBe(true);expect(evaluate({...recipient,actorPersonId:"stranger"},"invitation.accept").allowed).toBe(false);expect(evaluate({...recipient,operating:false},"invitation.accept").allowed).toBe(false);expect(evaluate({...recipient,invitation:{...recipient.invitation,now:recipient.invitation.expiresAt}},"invitation.accept").allowed).toBe(false);
});
it("fixed terminal invitations reject permission editing, delegation and injected service authority",()=>{
 const valid={commandId:randomUUID(),recipientId:randomUUID(),expiresInDays:3};expect(createMerchantInvitationSchema.safeParse(valid).success).toBe(true);
 for(const patch of [{role:"OWNER"},{serviceId:randomUUID()},{membershipDependent:true},{permissions:["payments.refund"]},{delegablePermissions:[]},{accessExpiresInDays:7},{sourcePrimaryPersonId:randomUUID()}])expect(createMerchantInvitationSchema.safeParse({...valid,...patch}).success).toBe(false);
});

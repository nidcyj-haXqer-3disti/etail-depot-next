import { describe, expect, it } from "vitest";
import { resourceInvitationProjectionSchema } from "../../src/shared/resource-invitation-response";
import { PUBLIC_APP_URL } from "../../src/shared/public-origin";
import targets from "../../project-targets.json";
const id="bdf5ef78-32b0-47f1-a045-1229481b7c14";
const base={id,targetName:"Personal card",inviterName:"Owner",status:"PENDING",version:1,expiresAt:"2026-09-15T12:00:00.000Z",canRespond:true,hasAccess:false};
const card={...base,targetKind:"CARD",allowance:{amount:"10000",currency:"USD"},href:`/cardholder-services/cards/${id}`};
describe("recipient invitation response boundary",()=>{
 it("shares only the reviewed new project's public destination",()=>{
  expect(PUBLIC_APP_URL).toBe(targets.netlify.canonical_origin);
  expect(targets.denied.domains).not.toContain(new URL(PUBLIC_APP_URL).hostname);
 });
 it("keeps card allowance and terminal authority as separate exact projections",()=>{
  expect(resourceInvitationProjectionSchema.safeParse(card).success).toBe(true);
  expect(resourceInvitationProjectionSchema.safeParse({...base,targetKind:"MERCHANT_TERMINAL",href:`/merchants/${id}?tab=payments`}).success).toBe(true);
  expect(resourceInvitationProjectionSchema.safeParse({...card,targetKind:"MERCHANT_TERMINAL"}).success).toBe(false);
  expect(resourceInvitationProjectionSchema.safeParse({...card,recipientEmail:"private@example.test"}).success).toBe(false);
 });
 it.each(["https://foreign.example","//foreign.example",`/cardholder-services?card=${id}&card=${id}`,"/cardholder-services?next=https://foreign.example",`/merchants/${id}/people`,"/cardholder-services#secret","/cardholder-services?view=%63ards","/cardholder-services\n"])("rejects unsafe or broadened continuation href %#",href=>{
  expect(resourceInvitationProjectionSchema.safeParse({...card,href}).success).toBe(false);
 });
 it("rejects financial/display values that the recipient interface could mistake for a valid card limit",()=>{
  expect(resourceInvitationProjectionSchema.safeParse({...card,allowance:{amount:"NaN",currency:"USD"}}).success).toBe(false);
  expect(resourceInvitationProjectionSchema.safeParse({...card,allowance:{amount:"100",currency:"CAD"}}).success).toBe(false);
  expect(resourceInvitationProjectionSchema.safeParse({...card,version:0}).success).toBe(false);
 });
});

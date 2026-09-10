import { randomUUID } from "node:crypto";
import { getDb } from "../../src/platform/database/client";
import { merchantSetupEligibility } from "../../src/modules/services/schema";
import { bindIdentity, createCardholderService } from "../../src/modules/services/service";
import { acceptInvitation, createInvitation } from "../../src/modules/access/service";
import type { AccessPermission } from "../../src/modules/access/contracts";
import { getWorkspace, purchaseCard, startCardRequest, submitCardRequest, updateCardRequest } from "../../src/modules/workspace/service";

export const secondaryPermissions: AccessPermission[] = ["cards.read", "cards.hold", "cards.purchase", "cards.freeze", "cards.unfreeze", "activity.read", "notifications.manage"];
export async function cardPerson(displayName: string) {
  const identity = await bindIdentity("urn:etail:isolated-fixture", randomUUID(), displayName);
  await getDb().insert(merchantSetupEligibility).values({ personId: identity.personId, personaKind: "FICTIONAL_ADULT" });
  return identity.personId;
}
export async function cardPrimary(displayName = "Named primary") {
  const personId = await cardPerson(displayName);
  const service = await createCardholderService(personId, { commandId: randomUUID(), displayName: `${displayName}'s cards` });
  return { personId, serviceId: service.serviceId };
}
export async function enrollCardholder(primaryId: string, serviceId: string, personId: string, permissions = secondaryPermissions) {
  const invitation = await createInvitation(primaryId, serviceId, { commandId: randomUUID(), recipientId: personId, role: "SECONDARY", permissions, delegablePermissions: [], expiresInDays: 3 });
  return acceptInvitation(personId, invitation.id, { commandId: randomUUID(), expectedVersion: invitation.version });
}
export async function issuePracticeCard(primaryId: string, serviceId: string, holderId: string, nickname: string, allocation = "10000", spend?: string) {
  const draft = await startCardRequest(primaryId, serviceId, { commandId: randomUUID() });
  const saved = await updateCardRequest(primaryId, serviceId, draft.id, { commandId: randomUUID(), expectedVersion: draft.version, holderId, nickname, format: "VIRTUAL", requestedLimitMinor: allocation });
  const submit = { commandId: randomUUID(), expectedVersion: saved.version };
  const request = await submitCardRequest(primaryId, serviceId, saved.id, submit);
  if (request.status !== "ISSUED" || !request.issuedCardId) throw new Error("Fixture card was not issued by the canonical command");
  const card = (await getWorkspace(holderId, serviceId)).cards.find(row => row.id === request.issuedCardId);
  if (!card) throw new Error("Issued fixture card unavailable to its holder");
  const purchase = spend ? await purchaseCard(holderId, serviceId, card.id, { commandId: randomUUID(), expectedVersion: card.version, amountMinor: spend, description: `${nickname} purchase` }) : null;
  return { card: purchase?.card ?? card, activity: purchase?.activity ?? null, request, submit };
}

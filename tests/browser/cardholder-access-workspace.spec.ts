import {controlCard} from "../../src/modules/workspace/service";
import {CARDHOLDER_ACCESS_PERMISSIONS} from "../../src/modules/access/contracts";
import {freshPublishedPayment} from "./helpers/prepaid";
import {cardCheckoutReviewSchema} from "../../src/modules/acquiring/card-checkout-contracts";
import {fundCardGroup} from "../helpers/cardholder";
import { randomUUID } from "node:crypto";
import { and, eq, inArray } from "drizzle-orm";
import { expect, test, type BrowserContext } from "@playwright/test";
import { closeDatabase, getDb } from "../../src/platform/database/client";
import { identityBindings, services, serviceMembers, permissionGrants } from "../../src/platform/database/schema";
import { SessionService } from "../../src/modules/identity";
import { sessionRepository } from "../../src/platform/database/session-repository";
import { getAccessOverview, revokeInvitation, revokeMemberAccess } from "../../src/modules/access/service";
import { cardPerson, cardPrimary, issuePracticeCard } from "../helpers/cardholder";
import { startSandbox } from "../../src/modules/sandbox/service";
import type { WorkspaceProjection } from "../../src/modules/workspace/contracts";

const origin = "http://127.0.0.1:3100";
async function signIn(context: BrowserContext, personId: string) {
  const [identity] = await getDb().select().from(identityBindings).where(and(eq(identityBindings.personId, personId), eq(identityBindings.issuer, "urn:etail:isolated-fixture")));
  if (!identity) throw new Error("Expected an isolated fictional identity");
  const session = await new SessionService(sessionRepository, { appEnv: "test", publicOrigin: origin }).issue({ personId, identityId: identity.id });
  const pair = session.cookie.split(";", 1)[0]!;
  await context.addCookies([{ name: pair.slice(0, pair.indexOf("=")), value: pair.slice(pair.indexOf("=") + 1), domain: "127.0.0.1", path: "/", httpOnly: true, sameSite: "Strict", expires: Math.floor(session.record.expiresAt.getTime() / 1000) }]);
}

test.afterAll(closeDatabase);
test("invitations grant fixed own-card access after owner review without a permission editor", async ({page}) => {
  const primary = await cardPrimary(`Limited UI primary ${randomUUID().slice(0, 8)}`);
  await getDb().update(permissionGrants).set({state:"REVOKED"}).where(and(eq(permissionGrants.serviceId,primary.serviceId),eq(permissionGrants.personId,primary.personId),inArray(permissionGrants.action,["cards.purchase","cards.freeze","cards.unfreeze"])));
  await signIn(page.context(),primary.personId);
  const initial=await getAccessOverview(primary.personId,primary.serviceId);
  const recipient={id:await cardPerson("Limited access recipient"),name:"Limited access recipient"};
  const joined=await startSandbox(recipient.id,{commandId:randomUUID(),displayName:recipient.name,acknowledged:true});
  expect(joined.memberCode).toBeTruthy();
  await page.goto(`${origin}/cardholder-services?manage=${primary.serviceId}`);
  await page.getByRole("button",{name:"Invite a person",exact:true}).click();
  const dialog=page.getByRole("dialog",{name:"Invite a cardholder",exact:true});
  await expect(dialog.getByRole("button",{name:"Review invitation",exact:true})).toBeDisabled();
  await expect(dialog.getByRole("combobox",{name:"Named recipient",exact:true})).toHaveCount(0);
  await dialog.getByRole("textbox",{name:"Member code",exact:true}).fill(joined.memberCode!);
  await dialog.getByRole("button",{name:"Find member",exact:true}).click();
  await expect(dialog.getByRole("status")).toContainText(recipient.name);
  await expect(dialog.getByRole("radio")).toHaveCount(0);
  await expect(dialog.getByRole("checkbox")).toHaveCount(0);
  await expect(dialog.getByText("Customize access",{exact:true})).toHaveCount(0);
  await dialog.getByRole("button",{name:"Review invitation",exact:true}).click();
  expect((await getAccessOverview(primary.personId,primary.serviceId)).invitations).toEqual([]);
  const review=page.getByRole("dialog",{name:"Review invitation",exact:true});
  await expect(review).toContainText("Can use and freeze cards in their name");
  await review.getByRole("button",{name:"Save invitation",exact:true}).click();
  await expect(review).toHaveCount(0);
  const result=await getAccessOverview(primary.personId,primary.serviceId), invitation=result.invitations[0]!;
  expect(invitation.status).toBe("PENDING");
  expect(invitation.permissions.slice().sort()).toEqual([...CARDHOLDER_ACCESS_PERMISSIONS].sort());
  expect(initial.permissionOptions).toEqual([]);
  expect(invitation.permissions).not.toContain("people.invite");
  expect(invitation.delegablePermissions).toEqual([]);
  expect(result.people.some(person=>person.id===recipient.id&&person.state==="ACCEPTED")).toBe(false);
});

test("owner invitation, intended acceptance, card freeze and access removal stay in one new Cardholder service", async ({ page, browser }) => {
  const primary = await cardPrimary(`UI primary ${randomUUID().slice(0, 8)}`);
  // Invite a member by their shared code. Their separately owned card group
  // and its grants must remain unchanged throughout this relationship.
  const recipientName=`Invited primary ${randomUUID().slice(0,8)}`;
  const recipientPrimary=await cardPrimary(recipientName),recipient={id:recipientPrimary.personId,name:recipientName};
  const joined=await startSandbox(recipient.id,{commandId:randomUUID(),displayName:recipient.name,acknowledged:true});
  expect(joined.memberCode).toBeTruthy();
  const preservedIds = (await getDb().select({ id: services.id }).from(services).where(eq(services.primaryPersonId, recipient.id))).map(row => row.id);
  const preserved = async () => ({
    services: await getDb().select().from(services).where(inArray(services.id, preservedIds)).orderBy(services.id),
    members: await getDb().select().from(serviceMembers).where(inArray(serviceMembers.serviceId, preservedIds)).orderBy(serviceMembers.serviceId, serviceMembers.personId),
    grants: await getDb().select().from(permissionGrants).where(inArray(permissionGrants.serviceId, preservedIds)).orderBy(permissionGrants.serviceId, permissionGrants.personId, permissionGrants.action),
  });
  const before = await preserved();
  const primaryCard = await (async()=>{await fundCardGroup(primary.personId,primary.serviceId,"2000");return issuePracticeCard(primary.personId, primary.serviceId, primary.personId, "Private primary UI card", "99", "1000");})();
  const recipientContext = await browser.newContext({ viewport: page.viewportSize() ?? { width: 1280, height: 720 } });
  const recipientPage = await recipientContext.newPage();
  await signIn(page.context(), primary.personId); await signIn(recipientContext, recipient.id);
  const accessUrl = `${origin}/cardholder-services?view=cardholders&manage=${primary.serviceId}`;
  const headers = { Origin: origin, "Content-Type": "application/json" };
  try {
    await page.goto(accessUrl);
    await page.getByRole("button", { name: "Invite a person", exact: true }).click();
    const invite = page.getByRole("dialog", { name: "Invite a cardholder", exact: true });
    await expect(invite.getByRole("combobox", { name: "Named recipient" })).toHaveCount(0);
    await invite.getByRole("textbox",{name:"Member code",exact:true}).fill(joined.memberCode!);
    await invite.getByRole("button",{name:"Find member",exact:true}).click();
    await expect(invite.getByRole("status")).toContainText(recipient.name);
    await expect(invite).toContainText("After they accept, add cards in their name");
    await expect(invite.getByRole("radio")).toHaveCount(0);
    await invite.getByRole("button", { name: "Review invitation", exact: true }).click();
    const review = page.getByRole("dialog", { name: "Review invitation", exact: true });
    await expect(review.getByRole("heading", { name: recipient.name, exact: true })).toBeVisible();
    await review.getByRole("button", { name: "Save invitation", exact: true }).click();
    await expect(review).toBeHidden();
    const pending = (await getAccessOverview(primary.personId, primary.serviceId)).invitations.find(row => row.recipientId === recipient.id && row.status === "PENDING")!;
    expect(pending).toBeTruthy();
    expect(pending.permissions).toEqual(expect.arrayContaining(["cards.read", "cards.hold", "cards.purchase", "activity.read"]));
    expect(pending.delegablePermissions).toEqual([]);
    expect((await page.request.post(`${origin}/api/v1/invitations/${pending.id}/accept`, { headers, data: { commandId: randomUUID(), expectedVersion: pending.version } })).status()).toBe(404);
    expect((await recipientPage.request.get(`${origin}/api/v1/cardholder-services/${primary.serviceId}/workspace`)).status()).toBe(404);

    await recipientPage.goto(`${origin}/shared-access`);
    const invitationRow = recipientPage.locator(".ws-person-row").filter({ hasText: `Reference ${pending.id.slice(0, 8).toUpperCase()}` });
    await invitationRow.getByRole("button", { name: "Review invitation", exact: true }).click();
    const acceptance = recipientPage.getByRole("dialog", { name: "Review cardholder invitation", exact: true });
    await acceptance.getByRole("button", { name: "Accept this access", exact: true }).click();
    await expect(acceptance).toBeHidden();
    const secondaryCard = await (async()=>{return issuePracticeCard(primary.personId, primary.serviceId, recipient.id, "My secondary UI card", "25", "1000");})();
    await recipientPage.goto(`${origin}/cardholder-services?focus=${secondaryCard.card.id}`);
    await expect(recipientPage.getByRole("region", { name: "Selected card overview" })).toContainText(secondaryCard.card.nickname);
    await recipientPage.goto(`${origin}/cardholder-services/activity?focus=${secondaryCard.card.id}`);
    await expect(recipientPage.getByText(secondaryCard.activity!.title, { exact: true })).toBeVisible();
    await expect(recipientPage.getByText(primaryCard.activity!.title, { exact: true })).toHaveCount(0);
    const ownWorkspace = await (await recipientPage.request.get(`${origin}/api/v1/cardholder-services/${primary.serviceId}/workspace`)).json() as WorkspaceProjection;
    expect(ownWorkspace.cards.map(card => card.id)).toEqual([secondaryCard.card.id]);
    expect(ownWorkspace.activity.map(item => item.id)).toEqual([secondaryCard.activity!.id]);
    await recipientPage.goto(`${origin}/cardholder-services?focus=${primaryCard.card.id}`);
    await expect(recipientPage.getByRole("heading", { name: "This card is unavailable", exact: true })).toBeVisible();

    // Prepare a customer checkout, then freeze its card. The saved review must
    // reject the changed card version without posting either side of a payment.
    const checkout=await freshPublishedPayment("1","Denied after permission change");
    const checkoutPath=`${origin}/api/v1/checkout/${checkout.publication.id}/card`;
    const prepared=await recipientPage.request.post(checkoutPath,{headers,data:{
      commandId:randomUUID(),cardServiceId:primary.serviceId,cardId:secondaryCard.card.id,
      expectedCardVersion:secondaryCard.card.version,
    }});
    expect(prepared.status()).toBe(200);
    const checkoutReview=cardCheckoutReviewSchema.parse(await prepared.json());
    expect(checkoutReview.receipt).toBeNull();

    await controlCard(primary.personId,primary.serviceId,secondaryCard.card.id,{commandId:randomUUID(),expectedVersion:secondaryCard.card.version,action:"freeze"});
    const denied=await recipientPage.request.post(`${checkoutPath}/${checkoutReview.id}`,{headers,data:{}});
    expect(denied.status()).toBe(409);
    expect(await denied.json()).toMatchObject({error:{code:"STALE_VERSION"}});
    const stillUnpaid=await recipientPage.request.get(`${checkoutPath}/${checkoutReview.id}`);
    expect(stillUnpaid.status()).toBe(200);
    expect(cardCheckoutReviewSchema.parse(await stillUnpaid.json()).receipt).toBeNull();
    const restricted=await (await recipientPage.request.get(`${origin}/api/v1/cardholder-services/${primary.serviceId}/workspace`)).json() as WorkspaceProjection;
    expect(restricted.cards.find(card=>card.id===secondaryCard.card.id)).toMatchObject({canPurchase:false,purchaseAvailability:{code:"FROZEN"}});
    expect(restricted.activity.map(row=>row.id)).toEqual(ownWorkspace.activity.map(row=>row.id));

    await page.goto(accessUrl+`&person=${recipient.id}`);
    await page.getByRole("button", { name: "Remove access", exact: true }).click();
    const revoke = page.getByRole("dialog", { name: "Remove cardholder access", exact: true });
    await revoke.getByRole("button", { name: "Confirm removal", exact: true }).click();
    await expect(revoke).toBeHidden();
    await recipientPage.goto(`${origin}/cardholder-services?focus=${secondaryCard.card.id}`);
    await expect(recipientPage.getByRole("heading", { name: "This card is unavailable", exact: true })).toBeVisible();
    expect((await recipientPage.request.get(`${origin}/api/v1/cardholder-services/${primary.serviceId}/workspace`)).status()).toBe(404);
    expect(await preserved()).toEqual(before);
  } finally {
    // Only this freshly created relationship is cleaned up if an earlier assertion failed.
    const access = await getAccessOverview(primary.personId, primary.serviceId);
    const member = access.people.find(row => row.id === recipient.id && row.state === "ACCEPTED");
    if (member) await revokeMemberAccess(primary.personId, primary.serviceId, recipient.id, { commandId: randomUUID(), expectedVersion: member.version });
    for (const invitation of access.invitations.filter(row => row.recipientId === recipient.id && row.status === "PENDING")) await revokeInvitation(primary.personId, primary.serviceId, invitation.id, { commandId: randomUUID(), expectedVersion: invitation.version });
    await recipientContext.close();
  }
});

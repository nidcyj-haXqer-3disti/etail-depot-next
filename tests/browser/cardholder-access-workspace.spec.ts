import { randomUUID } from "node:crypto";
import { and, eq, inArray } from "drizzle-orm";
import { expect, test, type BrowserContext } from "@playwright/test";
import { closeDatabase, getDb } from "../../src/platform/database/client";
import { identityBindings, people, services, serviceMembers, permissionGrants } from "../../src/platform/database/schema";
import { SessionService } from "../../src/modules/identity";
import { sessionRepository } from "../../src/platform/database/session-repository";
import { getAccessOverview, revokeInvitation, revokeMemberAccess } from "../../src/modules/access/service";
import { cardPrimary, issuePracticeCard } from "../helpers/cardholder";
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
test("ordinary cardholder access respects the current permission ceiling and requires a reviewed invitation", async ({page}) => {
  const primary = await cardPrimary(`Limited UI primary ${randomUUID().slice(0, 8)}`);
  await getDb().update(permissionGrants).set({state:"REVOKED"}).where(and(eq(permissionGrants.serviceId,primary.serviceId),eq(permissionGrants.personId,primary.personId),inArray(permissionGrants.action,["cards.purchase","cards.freeze","cards.unfreeze"])));
  await signIn(page.context(),primary.personId);
  const initial=await getAccessOverview(primary.personId,primary.serviceId), recipient=initial.recipients[0]!;
  await page.goto(`${origin}/cardholder-services?manage=${primary.serviceId}`);
  await page.getByRole("button",{name:"Invite a person",exact:true}).click();
  const dialog=page.getByRole("dialog",{name:"Invite a person",exact:true});
  await expect(dialog.getByRole("button",{name:"Review access",exact:true})).toBeDisabled();
  await dialog.getByRole("combobox",{name:"Named recipient",exact:true}).selectOption(recipient.id);
  await expect(dialog.getByRole("radio")).toHaveCount(0);
  await expect(dialog).toContainText("Purchasing is turned off");
  await dialog.getByText("Customize access",{exact:true}).click();
  await expect(dialog.getByRole("checkbox",{name:/^Make purchases/})).toHaveCount(0);
  await expect(dialog.getByRole("checkbox",{name:/^Freeze their own cards/})).toHaveCount(0);
  await expect(dialog.getByRole("checkbox",{name:/^Unfreeze their own cards/})).toHaveCount(0);
  await dialog.getByRole("button",{name:"Review access",exact:true}).click();
  expect((await getAccessOverview(primary.personId,primary.serviceId)).invitations).toEqual([]);
  const review=page.getByRole("dialog",{name:"Review cardholder access",exact:true});
  await expect(review).toContainText("Purchasing is turned off");
  await review.getByRole("button",{name:"Save invitation",exact:true}).click();
  await expect(review).toHaveCount(0);
  const result=await getAccessOverview(primary.personId,primary.serviceId), invitation=result.invitations[0]!;
  expect(invitation.status).toBe("PENDING");
  expect(invitation.permissions).toEqual(expect.arrayContaining(["cards.read","cards.hold","activity.read"]));
  expect(invitation.permissions.every(action=>initial.permissionOptions.some(option=>option.action===action))).toBe(true);
  expect(invitation.permissions).not.toContain("cards.purchase");
  expect(invitation.permissions).not.toContain("cards.freeze");
  expect(invitation.permissions).not.toContain("people.invite");
  expect(invitation.delegablePermissions).toEqual([]);
  expect(result.people.some(person=>person.id===recipient.id&&person.state==="ACCEPTED")).toBe(false);
});

test("primary invitation, intended acceptance, permission changes and revocation stay in one new Cardholder service", async ({ page, browser }) => {
  const primary = await cardPrimary(`UI primary ${randomUUID().slice(0, 8)}`);
  // The picker intentionally contains only the named demo recipients. Enroll Alex solely
  // in this new test service; never change Alex's existing primary service or its grants.
  const [recipient] = await getDb().select({ id: people.id, name: people.displayName }).from(identityBindings).innerJoin(people, eq(people.id, identityBindings.personId)).where(and(eq(identityBindings.issuer, "urn:etail:isolated-fixture"), eq(identityBindings.subject, "owner")));
  if (!recipient) throw new Error("Expected the named primary demo recipient");
  const preservedIds = (await getDb().select({ id: services.id }).from(services).where(eq(services.primaryPersonId, recipient.id))).map(row => row.id);
  const preserved = async () => ({
    services: await getDb().select().from(services).where(inArray(services.id, preservedIds)).orderBy(services.id),
    members: await getDb().select().from(serviceMembers).where(inArray(serviceMembers.serviceId, preservedIds)).orderBy(serviceMembers.serviceId, serviceMembers.personId),
    grants: await getDb().select().from(permissionGrants).where(inArray(permissionGrants.serviceId, preservedIds)).orderBy(permissionGrants.serviceId, permissionGrants.personId, permissionGrants.action),
  });
  const before = await preserved();
  const primaryCard = await issuePracticeCard(primary.personId, primary.serviceId, primary.personId, "Private primary UI card", "1000", "99");
  const recipientContext = await browser.newContext({ viewport: page.viewportSize() ?? { width: 1280, height: 720 } });
  const recipientPage = await recipientContext.newPage();
  await signIn(page.context(), primary.personId); await signIn(recipientContext, recipient.id);
  const accessUrl = `${origin}/cardholder-services?view=cardholders&manage=${primary.serviceId}`;
  const headers = { Origin: origin, "Content-Type": "application/json" };
  try {
    await page.goto(accessUrl);
    await page.getByRole("button", { name: "Invite a person", exact: true }).click();
    const invite = page.getByRole("dialog", { name: "Invite a person", exact: true });
    await invite.getByRole("combobox", { name: "Named recipient" }).selectOption(recipient.id);
    await expect(invite).toContainText("Purchases allowed on their own cards");
    await expect(invite.getByRole("radio")).toHaveCount(0);
    await invite.getByRole("button", { name: "Review access", exact: true }).click();
    const review = page.getByRole("dialog", { name: "Review cardholder access", exact: true });
    await expect(review.getByRole("heading", { name: recipient.name, exact: true })).toBeVisible();
    await review.getByRole("button", { name: "Save invitation", exact: true }).click();
    await expect(review).toBeHidden();
    const pending = (await getAccessOverview(primary.personId, primary.serviceId)).invitations.find(row => row.recipientId === recipient.id && row.status === "PENDING")!;
    expect(pending).toBeTruthy();
    expect(pending.permissions).toEqual(expect.arrayContaining(["cards.read", "cards.hold", "cards.purchase", "activity.read"]));
    expect(pending.delegablePermissions).toEqual([]);
    expect((await page.request.post(`${origin}/api/v1/invitations/${pending.id}/accept`, { headers, data: { commandId: randomUUID(), expectedVersion: pending.version } })).status()).toBe(404);
    expect((await recipientPage.request.get(`${origin}/api/v1/cardholder-services/${primary.serviceId}/workspace`)).status()).toBe(404);

    await recipientPage.goto(`${origin}/services`);
    const invitationRow = recipientPage.locator(".ws-person-row").filter({ hasText: `Reference ${pending.id.slice(0, 8).toUpperCase()}` });
    await invitationRow.getByRole("button", { name: "Review invitation", exact: true }).click();
    const acceptance = recipientPage.getByRole("dialog", { name: "Review cardholder invitation", exact: true });
    await acceptance.getByRole("button", { name: "Accept this access", exact: true }).click();
    await expect(acceptance).toBeHidden();
    const secondaryCard = await issuePracticeCard(primary.personId, primary.serviceId, recipient.id, "My secondary UI card", "1000", "25");
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

    await page.goto(accessUrl);
    await page.locator("button.ws-person-row").filter({ hasText: recipient.name }).click();
    // Click the next action as soon as it is visible: a pending person-route
    // transition must not replace and discard this newly opened review.
    await page.getByRole("button", { name: "Change access", exact: true }).click();
    const edit = page.getByRole("dialog", { name: "Change cardholder access", exact: true });
    await expect(page).toHaveURL(new RegExp(`person=${recipient.id}`));
    await edit.getByRole("checkbox", {name: /^Make purchases/}).uncheck();
    await edit.getByRole("button", { name: "Review access", exact: true }).click();
    const editReview = page.getByRole("dialog", { name: "Review cardholder access", exact: true });
    await editReview.getByRole("button", { name: "Save these permissions", exact: true }).click();
    await expect(editReview).toBeHidden();
    expect((await recipientPage.request.post(`${origin}/api/v1/cardholder-services/${primary.serviceId}/cards/${secondaryCard.card.id}/purchase`, { headers, data: { commandId: randomUUID(), expectedVersion: secondaryCard.card.version, amountMinor: "1", description: "Denied after permission change" } })).status()).toBe(403);

    await page.goto(accessUrl);
    await page.locator("button.ws-person-row").filter({ hasText: recipient.name }).click();
    await page.getByRole("button", { name: "Remove access", exact: true }).click();
    const revoke = page.getByRole("dialog", { name: "Revoke cardholder access", exact: true });
    await revoke.getByRole("button", { name: "Confirm revocation", exact: true }).click();
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

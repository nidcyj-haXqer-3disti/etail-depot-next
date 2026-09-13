import {randomUUID} from "node:crypto";
import {and,eq,inArray} from "drizzle-orm";
import {expect,test} from "@playwright/test";
import {closeDatabase,getDb} from "../../src/platform/database/client";
import {services,serviceMembers,permissionGrants} from "../../src/platform/database/schema";
import {CARDHOLDER_ACCESS_PERMISSIONS} from "../../src/modules/access/contracts";
import {getAccessOverview,getCardInvitations,revokeMemberAccess} from "../../src/modules/access/service";
import {prepareCardCheckout} from "../../src/modules/acquiring/card-checkout-service";
import {controlCard,purchaseCard} from "../../src/modules/workspace/service";
import {cardCheckoutReviewSchema} from "../../src/modules/acquiring/card-checkout-contracts";
import type {WorkspaceProjection} from "../../src/modules/workspace/contracts";
import {cardPerson,cardPrimary,fundCardGroup,issuePracticeCard} from "../helpers/cardholder";
import {freshPublishedPayment} from "./helpers/prepaid";
import {acceptCardUI,createCardUI,inviteCardUI,signInVerified} from "./helpers/card-invitation";

const origin="http://127.0.0.1:3100";
test.afterAll(closeDatabase);
test("card-first invitations grant fixed own-card access without a permission editor",async({page})=>{
 const owner=await cardPrimary(`Limited owner ${randomUUID().slice(0,8)}`);
 await getDb().update(permissionGrants).set({state:"REVOKED"}).where(and(eq(permissionGrants.serviceId,owner.serviceId),eq(permissionGrants.personId,owner.personId),inArray(permissionGrants.action,["cards.purchase","cards.freeze","cards.unfreeze"])));
 await signInVerified(page,owner.personId);
 const initial=await getAccessOverview(owner.personId,owner.serviceId),recipient=await cardPerson("Limited access recipient"),email=`fixed-card-${randomUUID()}@example.test`;
 const card=await createCardUI(page,"Card before invitation");expect(card).toMatchObject({holderId:null,assignmentState:"UNASSIGNED"});
 await page.getByRole("region",{name:"Cardholder",exact:true}).getByRole("button",{name:"Invite cardholder",exact:true}).click();
 await expect(page.getByRole("textbox",{name:"Member code",exact:true})).toHaveCount(0);
 await expect(page.getByRole("radio")).toHaveCount(0);await expect(page.getByRole("checkbox")).toHaveCount(0);
 await expect(page.getByRole("button",{name:"Create invitation",exact:true})).toBeDisabled();
 await page.getByRole("textbox",{name:"Their email address",exact:true}).fill(email);
 expect((await getCardInvitations(owner.personId,card.id)).invitations).toEqual([]);
 await page.getByRole("button",{name:"Create invitation",exact:true}).click();
 await expect(page.getByRole("region",{name:"Share invitation",exact:true})).toBeVisible();
 await page.getByRole("region",{name:"Share invitation",exact:true}).getByRole("button",{name:"Share invitation",exact:true}).click();
 for(const label of ["Email","Text message"])await expect(page.getByRole("link",{name:label,exact:true})).toBeVisible();
 const invitation=(await getCardInvitations(owner.personId,card.id)).invitations[0]!;
 expect(invitation).toMatchObject({targetKind:"CARD",cardId:card.id,status:"PENDING",recipientId:null,recipientEmail:email,delegablePermissions:[]});
 expect(invitation.permissions.slice().sort()).toEqual([...CARDHOLDER_ACCESS_PERMISSIONS].sort());expect(invitation.permissions).not.toContain("people.invite");
 expect(initial.permissionOptions).toEqual([]);expect((await getAccessOverview(owner.personId,owner.serviceId)).people.some(person=>person.id===recipient&&person.state==="ACCEPTED")).toBe(false);
});

test("owner creates, shares and removes one card while its holder's other account remains unchanged",async({page,browser})=>{
 test.setTimeout(120_000);
 const owner=await cardPrimary(`UI owner ${randomUUID().slice(0,8)}`),recipientOwner=await cardPrimary(`Invited owner ${randomUUID().slice(0,8)}`),recipient=recipientOwner.personId,email=`card-holder-${randomUUID()}@example.test`;
 const preservedIds=(await getDb().select({id:services.id}).from(services).where(eq(services.primaryPersonId,recipient))).map(row=>row.id);
 const preserved=async()=>({services:await getDb().select().from(services).where(inArray(services.id,preservedIds)).orderBy(services.id),members:await getDb().select().from(serviceMembers).where(inArray(serviceMembers.serviceId,preservedIds)).orderBy(serviceMembers.serviceId,serviceMembers.personId),grants:await getDb().select().from(permissionGrants).where(inArray(permissionGrants.serviceId,preservedIds)).orderBy(permissionGrants.serviceId,permissionGrants.personId,permissionGrants.action)});
 const before=await preserved();await fundCardGroup(owner.personId,owner.serviceId,"2000");
 const privateCard=await issuePracticeCard(owner.personId,owner.serviceId,owner.personId,"Private owner UI card","99","1000");
 const context=await browser.newContext({viewport:page.viewportSize()??undefined}),recipientPage=await context.newPage();
 await signInVerified(page,owner.personId);await signInVerified(recipientPage,recipient,email);
 const headers={Origin:origin,"Content-Type":"application/json"};
 try{
  const created=await createCardUI(page,"My invited UI card","10.00");const invitationId=await inviteCardUI(page,created.id,email);
  const invitation=(await getCardInvitations(owner.personId,created.id)).invitations.find(row=>row.id===invitationId)!;
  expect((await page.request.post(`/api/v1/invitations/${invitationId}/accept`,{headers,data:{commandId:randomUUID(),expectedVersion:invitation.version}})).status()).toBe(404);
  expect((await recipientPage.request.get(`/api/v1/cardholder-services/${owner.serviceId}/workspace`)).status()).toBe(404);
  await acceptCardUI(recipientPage,invitationId);
  let ownWorkspace=await (await recipientPage.request.get(`/api/v1/cardholder-services/${owner.serviceId}/workspace`)).json() as WorkspaceProjection;
  const assigned=ownWorkspace.cards.find(card=>card.id===created.id)!;
  const paid=await purchaseCard(recipient,owner.serviceId,assigned.id,{commandId:randomUUID(),expectedVersion:assigned.version,amountMinor:"25",description:"Invited card purchase"});
  await recipientPage.goto(`/cardholder-services?focus=${assigned.id}`);await expect(recipientPage.getByRole("region",{name:"Selected card overview",exact:true})).toContainText(assigned.nickname);
  await recipientPage.goto(`/cardholder-services/activity?focus=${assigned.id}`);await expect(recipientPage.getByText(paid.activity.title,{exact:true})).toBeVisible();await expect(recipientPage.getByText(privateCard.activity!.title,{exact:true})).toHaveCount(0);
  ownWorkspace=await (await recipientPage.request.get(`/api/v1/cardholder-services/${owner.serviceId}/workspace`)).json() as WorkspaceProjection;
  expect(ownWorkspace.cards.map(card=>card.id)).toEqual([assigned.id]);expect(ownWorkspace.activity.map(row=>row.id)).toEqual([paid.activity.id]);
  await recipientPage.goto(`/cardholder-services?focus=${privateCard.card.id}`);await expect(recipientPage.getByRole("heading",{name:"This card is unavailable",exact:true})).toBeVisible();
  const checkout=await freshPublishedPayment("1","Denied after card freeze"),checkoutPath=`/api/v1/checkout/${checkout.publication.id}/card`;
  const review=await prepareCardCheckout(recipient,checkout.publication.id,{commandId:randomUUID(),cardServiceId:owner.serviceId,cardId:assigned.id,expectedCardVersion:paid.card.version});expect(review.receipt).toBeNull();
  await controlCard(owner.personId,owner.serviceId,assigned.id,{commandId:randomUUID(),expectedVersion:paid.card.version,action:"freeze"});
  const denied=await recipientPage.request.post(`${checkoutPath}/${review.id}`,{headers,data:{}});expect(denied.status()).toBe(409);expect(await denied.json()).toMatchObject({error:{code:"STALE_VERSION"}});
  expect(cardCheckoutReviewSchema.parse(await (await recipientPage.request.get(`${checkoutPath}/${review.id}`)).json()).receipt).toBeNull();
  await page.goto(`/cardholder-services?card=${assigned.id}`);const dialog=page.getByRole("dialog");
  await page.getByRole("region",{name:"Cardholder",exact:true}).getByRole("button",{name:"Remove cardholder",exact:true}).click();await expect(dialog.getByRole("heading",{name:/Remove .* from this card\?/})).toBeVisible();
  await dialog.getByRole("button",{name:"Remove cardholder",exact:true}).click();await expect(dialog).toHaveCount(0);await expect(page.getByRole("region",{name:"Selected card overview",exact:true})).toContainText("Card access removed");
  await recipientPage.goto(`/cardholder-services?focus=${assigned.id}`);await expect(recipientPage.getByRole("heading",{name:"This card is unavailable",exact:true})).toBeVisible();
  const removed=await (await recipientPage.request.get(`/api/v1/cardholder-services/${owner.serviceId}/workspace`)).json() as WorkspaceProjection;expect(removed.cards).toEqual([]);expect(removed.activity).toEqual([]);
  expect(await preserved()).toEqual(before);
 }finally{
  const access=await getAccessOverview(owner.personId,owner.serviceId),member=access.people.find(row=>row.id===recipient&&row.state==="ACCEPTED");
  if(member)await revokeMemberAccess(owner.personId,owner.serviceId,recipient,{commandId:randomUUID(),expectedVersion:member.version});await context.close();
 }
});

import {fundCardGroup} from "../helpers/cardholder";
import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { closeDatabase, getDb } from "../../src/platform/database/client";
import { identityBindings, permissionGrants } from "../../src/platform/database/schema";
import { SessionService } from "../../src/modules/identity";
import { sessionRepository } from "../../src/platform/database/session-repository";
import { createCardInvitation, getAccessOverview, getCardInvitations, listInvitationsForPerson } from "../../src/modules/access/service";
import { getWorkspace, startCardRequest, updateCardRequest } from "../../src/modules/workspace/service";
import {createCardUI,signInVerified} from "./helpers/card-invitation";
import { cardPerson, cardPrimary, enrollCardholder, issuePracticeCard } from "../helpers/cardholder";

const origin="http://127.0.0.1:3100";
test.afterAll(closeDatabase);
async function signIn(page:Page,personId:string){
 const [identity]=await getDb().select().from(identityBindings).where(and(eq(identityBindings.personId,personId),eq(identityBindings.issuer,"urn:etail:isolated-fixture")));
 if(!identity)throw new Error("Expected a new fictional identity");
 const session=await new SessionService(sessionRepository,{appEnv:"test",publicOrigin:origin}).issue({personId,identityId:identity.id});
 const pair=session.cookie.split(";",1)[0]!;
 await page.context().addCookies([{name:pair.slice(0,pair.indexOf("=")),value:pair.slice(pair.indexOf("=")+1),domain:"127.0.0.1",path:"/",httpOnly:true,sameSite:"Strict",expires:Math.floor(session.record.expiresAt.getTime()/1000)}]);
}
// Simulate an external authority change only on each test's newly created service.
async function setPermission(primary:Awaited<ReturnType<typeof cardPrimary>>,action:string,state:"ACCEPTED"|"REVOKED"){
 const changed=await getDb().update(permissionGrants).set({state}).where(and(eq(permissionGrants.serviceId,primary.serviceId),eq(permissionGrants.personId,primary.personId),eq(permissionGrants.action,action))).returning({action:permissionGrants.action});
 expect(changed.length).toBeGreaterThan(0);
}
async function accessibleRecovery(page:Page){
 const viewport=page.viewportSize();
 await page.setViewportSize({width:320,height:568});
 expect((await new AxeBuilder({page}).include("dialog").withTags(["wcag2a","wcag2aa","wcag21aa"]).analyze()).violations).toEqual([]);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true);
 const dialog=page.getByRole("dialog");
 expect(await dialog.evaluate(element=>element.scrollWidth<=element.clientWidth+1)).toBe(true);
 await expect(dialog.getByRole("button",{name:"Leave unconfirmed request",exact:true})).toBeEnabled();
 if(viewport)await page.setViewportSize(viewport);
}
test("lost freeze result survives denied retry, hides unavailable card details, and keeps one business effect",async({page})=>{
 test.setTimeout(90_000);
 const action="freeze";
 const primary=await cardPrimary(`Recovery ${action} ${randomUUID().slice(0,8)}`),own=await (async()=>{await fundCardGroup(primary.personId,primary.serviceId,"900");return issuePracticeCard(primary.personId, primary.serviceId, primary.personId, `Private ${action} card`, undefined, "900");})();
 await signIn(page,primary.personId);
 const attempts:unknown[]=[],statuses:number[]=[];
 const path=`**/api/v1/cardholder-services/${primary.serviceId}/cards/${own.card.id}/control`;
 await page.route(path,async route=>{
  attempts.push(route.request().postDataJSON());const result=await route.fetch();statuses.push(result.status());
  if(attempts.length===1){expect(result.status()).toBe(200);await route.abort("connectionfailed");}else await route.fulfill({response:result});
 });
 await page.goto(`/cardholder-services?focus=${own.card.id}`);
 await page.getByRole("region",{name:"Card controls",exact:true}).getByRole("button",{name:"Freeze card",exact:true}).click();
 const dialog=page.getByRole("dialog");
 await dialog.getByRole("button",{name:"Freeze card",exact:true}).click();
 const retry=dialog.getByRole("button",{name:"Retry same change",exact:true});
 await expect(retry).toBeEnabled();
 await setPermission(primary,`cards.${action}`,"REVOKED");
 await retry.click();await expect.poll(()=>statuses.length).toBe(2);expect(statuses[1]).toBe(403);
 await expect(retry).toBeEnabled();await page.keyboard.press("Escape");await expect(dialog).toBeVisible();
 await expect(dialog.getByRole("button",{name:"Leave unconfirmed request",exact:true})).toHaveCount(0);
 await dialog.getByRole("button",{name:"Check card access",exact:true}).click();
 await expect(dialog).toHaveAccessibleName("Card access unavailable");
 await expect(dialog).not.toContainText(own.card.nickname);await expect(dialog).not.toContainText(own.card.lastFour);
 await accessibleRecovery(page);
 expect(attempts[0]).toEqual(attempts[1]);
 await dialog.getByRole("button",{name:"Leave unconfirmed request",exact:true}).click();await expect(dialog).toHaveCount(0);
 const result=await getWorkspace(primary.personId,primary.serviceId),card=result.cards.find(item=>item.id===own.card.id)!;
 expect(card.available.minor).toBe("900");expect(card.status).toBe("FROZEN");
});

test("a lost cancellation survives revoked request access and confirmed retry clears the unavailable view",async({page})=>{
 test.setTimeout(90_000);
 const primary=await cardPrimary(`Request recovery ${randomUUID().slice(0,8)}`);
 const draft=await startCardRequest(primary.personId,primary.serviceId,{commandId:randomUUID()});
 const saved=await updateCardRequest(primary.personId,primary.serviceId,draft.id,{allowanceMinor:"0",commandId:randomUUID(),expectedVersion:draft.version,holderId:primary.personId,nickname:"Private canceled request",format:"VIRTUAL"});
 await signIn(page,primary.personId);
 const attempts:unknown[]=[],statuses:number[]=[];
 await page.route(`**/api/v1/cardholder-services/${primary.serviceId}/card-requests/${saved.id}/cancel`,async route=>{
  attempts.push(route.request().postDataJSON());const result=await route.fetch();statuses.push(result.status());
  if(attempts.length===1){expect(result.status()).toBe(200);await route.abort("connectionfailed");}else await route.fulfill({response:result});
 });
 await page.goto(`/cardholder-services?request=${saved.id}&review=1`);
 const dialog=page.getByRole("dialog"),retry=dialog.getByRole("button",{name:"Retry the same request",exact:true});
 await dialog.getByRole("button",{name:"Cancel this request",exact:true}).click();
 await dialog.getByRole("button",{name:"Confirm cancellation",exact:true}).click();await expect(retry).toBeEnabled();
 await setPermission(primary,"cards.request","REVOKED");await retry.click();await expect.poll(()=>statuses.length).toBe(2);expect(statuses[1]).toBe(403);
 await expect(retry).toBeEnabled();await dialog.getByRole("button",{name:"Check request access",exact:true}).click();
 await expect(dialog).toHaveAccessibleName("Card request access unavailable");await expect(dialog).not.toContainText(saved.nickname);
 await expect(dialog.getByRole("button",{name:"Leave unconfirmed request",exact:true})).toBeEnabled();
 await setPermission(primary,"cards.request","ACCEPTED");await retry.click();
 await expect(dialog).toHaveAccessibleName("Card request");await expect(dialog).toContainText(saved.nickname);
 await expect(dialog.getByRole("button",{name:"Close",exact:true})).toBeEnabled();
 await expect(dialog.getByRole("button",{name:"Leave unconfirmed request",exact:true})).toHaveCount(0);
 expect(statuses).toEqual([200,403,200]);expect(attempts[1]).toEqual(attempts[0]);expect(attempts[2]).toEqual(attempts[0]);
 const current=await getWorkspace(primary.personId,primary.serviceId);
 expect(current.cardRequests.filter(item=>item.id===saved.id)).toMatchObject([{status:"CANCELED"}]);expect(current.cards).toHaveLength(0);
});

test("lost exact-card invitation keeps its original email and command through a denied retry",async({page})=>{
 test.setTimeout(90_000);
 const primary=await cardPrimary(`Invitation recovery ${randomUUID().slice(0,8)}`),email=`invite-recovery-${randomUUID()}@example.test`;
 await signInVerified(page,primary.personId);const card=await createCardUI(page,"Private invitation recovery card");
 const attempts:unknown[]=[],statuses:number[]=[];
 await page.route(`**/api/v1/cardholder-services/${primary.serviceId}/cards/${card.id}/invitations`,async route=>{
  if(route.request().method()==="GET"){await route.continue();return;}
  attempts.push(route.request().postDataJSON());const response=await route.fetch();statuses.push(response.status());
  if(attempts.length===1){expect(response.status()).toBe(200);await route.abort("connectionfailed");}else await route.fulfill({response});
 });
 await page.goto(`/cards/${card.id}/invite`);await page.getByRole("textbox",{name:"Their email address",exact:true}).fill(email);
 await page.getByRole("button",{name:"Create invitation",exact:true}).click();
 const retry=page.getByRole("button",{name:"Check invitation request again",exact:true});await expect(retry).toBeEnabled();
 await expect(page.getByRole("textbox",{name:"Their email address",exact:true})).toBeDisabled();await expect(page.getByRole("combobox",{name:"Accept within",exact:true})).toBeDisabled();
 await setPermission(primary,"people.invite","REVOKED");await retry.click();await expect.poll(()=>statuses.length).toBe(2);expect(statuses[1]).toBe(403);
 await expect(page.getByRole("heading",{name:"Card access is unavailable",exact:true})).toBeVisible();const unavailable=page.getByRole("dialog",{name:"Card access is unavailable",exact:true});await expect(unavailable).not.toContainText(card.nickname);await expect(unavailable).not.toContainText(email);
 const stillAuthorized=await page.request.get(`/api/v1/cardholder-services/${primary.serviceId}/workspace`);expect(stillAuthorized.status()).toBe(200);expect((await stillAuthorized.json()).cards.some((row:{id:string})=>row.id===card.id)).toBe(true);
 await expect(retry).toBeEnabled();await setPermission(primary,"people.invite","ACCEPTED");await retry.click();
 await expect(page.getByRole("region",{name:"Share invitation",exact:true})).toContainText(email);await expect(retry).toHaveCount(0);
 expect(statuses).toEqual([200,403,200]);expect(attempts[1]).toEqual(attempts[0]);expect(attempts[2]).toEqual(attempts[0]);
 expect((await getCardInvitations(primary.personId,card.id)).invitations).toHaveLength(1);
 expect((await getWorkspace(primary.personId,primary.serviceId)).cards.find(row=>row.id===card.id)).toMatchObject({holderId:null,assignmentState:"UNASSIGNED"});
});

test("lost cardholder removal hides private details after denial and retries the original card version",async({page})=>{
 test.setTimeout(90_000);
 const primary=await cardPrimary(`Removal recovery ${randomUUID().slice(0,8)}`),recipient=await cardPerson("Private removal recipient");
 await enrollCardholder(primary.personId,primary.serviceId,recipient);
 const own=await issuePracticeCard(primary.personId,primary.serviceId,recipient,"Private removed card",undefined,"900");await signInVerified(page,primary.personId);
 const attempts:unknown[]=[],statuses:number[]=[];
 await page.route(`**/api/v1/cardholder-services/${primary.serviceId}/cards/${own.card.id}/recipient/revoke`,async route=>{
  attempts.push(route.request().postDataJSON());const response=await route.fetch();statuses.push(response.status());
  if(attempts.length===1){expect(response.status()).toBe(200);await route.abort("connectionfailed");}else await route.fulfill({response});
 });
 await page.goto(`/cardholder-services?card=${own.card.id}`);const dialog=page.getByRole("dialog");
 await page.getByRole("region",{name:"Cardholder",exact:true}).getByRole("button",{name:"Remove cardholder",exact:true}).click();await dialog.getByRole("button",{name:"Remove cardholder",exact:true}).click();
 const retry=dialog.getByRole("button",{name:"Retry same removal",exact:true});await expect(retry).toBeEnabled();await expect(dialog.getByRole("button",{name:"Keep cardholder",exact:true})).toBeDisabled();
 await page.keyboard.press("Escape");await expect(dialog).toBeVisible();
 await setPermission(primary,"people.revoke","REVOKED");await retry.click();await expect.poll(()=>statuses.length).toBe(2);expect(statuses[1]).toBe(403);
 await expect(dialog).toHaveAccessibleName("Card access unavailable");await expect(dialog).not.toContainText(own.card.nickname);await expect(dialog).not.toContainText(own.card.holderName);await expect(dialog).not.toContainText(own.card.lastFour);
 const recovery=dialog.getByRole("button",{name:"Retry saved card removal",exact:true});await expect(recovery).toBeEnabled();await accessibleRecovery(page);
 await setPermission(primary,"people.revoke","ACCEPTED");await recovery.click();await expect(dialog).toHaveCount(0);await expect(page.getByRole("region",{name:"Selected card overview",exact:true})).toContainText("Card access removed");await expect(recovery).toHaveCount(0);
 expect(statuses).toEqual([200,403,200]);expect(attempts[1]).toEqual(attempts[0]);expect(attempts[2]).toEqual(attempts[0]);
 const current=(await getWorkspace(primary.personId,primary.serviceId)).cards.find(row=>row.id===own.card.id)!;
 expect(current).toMatchObject({holderId:recipient,assignmentState:"REVOKED",version:own.card.version+1});expect((await getWorkspace(recipient,primary.serviceId)).cards).toEqual([]);
});

for(const decision of ["accept","decline"] as const)test(`lost ${decision} decision survives a later denial and refresh without switching invitation decisions`,async({page})=>{
 test.setTimeout(90_000);
 const primary=await cardPrimary(`Invitation recovery ${randomUUID().slice(0,8)}`),recipient=await cardPerson(`Private ${decision} recipient`),email=`decision-${randomUUID()}@example.test`;
 await signInVerified(page,primary.personId);const card=await createCardUI(page,`Private ${decision} offered card`);
 const invitation=await createCardInvitation(primary.personId,primary.serviceId,card.id,{commandId:randomUUID(),recipientEmail:email,expiresInDays:3});
 await signInVerified(page,recipient,email);const attempts:unknown[]=[];
 await page.route(`**/api/v1/invitations/${invitation.id}/${decision}`,async route=>{
  attempts.push(route.request().postDataJSON());
  if(attempts.length===1){const response=await route.fetch();expect(response.status()).toBe(200);await route.fulfill({status:200,contentType:"application/json",body:""});}
  // A later HTTP denial cannot prove that the first, committed decision failed.
  else if(attempts.length===2)await route.fulfill({status:403,contentType:"application/json",body:JSON.stringify({error:{code:"FORBIDDEN"}})});
  else await route.continue();
 });
 await page.goto(`/invitations/${invitation.id}`);await expect(page.getByRole("heading",{name:"Your card invitation",exact:true})).toBeVisible();
 const retry=page.getByRole("button",{name:"Check your response again",exact:true});
 await page.getByRole("button",{name:decision==="accept"?"Accept invitation":"Decline invitation",exact:true}).click();await expect(retry).toBeEnabled();
 for(const name of ["Accept invitation","Decline invitation"])await expect(page.getByRole("button",{name,exact:true})).toBeDisabled();
 await retry.click();await expect.poll(()=>attempts.length).toBe(2);await expect(retry).toBeEnabled();
 await expect(page.getByRole("heading",{name:"Invitation unavailable",exact:true})).toBeVisible();await expect(page.locator("main")).not.toContainText(card.nickname);
 await page.getByRole("button",{name:"Refresh invitation",exact:true}).click();await expect(page.getByRole("heading",{name:"Your card invitation",exact:true})).toBeVisible();
 await expect(retry).toBeEnabled();await expect(page.getByRole("link",{name:"Open your card",exact:true})).toHaveCount(0);
 // Refresh shows the committed decision but cannot replace the original retry.
 await retry.click();await expect(retry).toHaveCount(0);
 expect(attempts).toHaveLength(3);expect(attempts[1]).toEqual(attempts[0]);expect(attempts[2]).toEqual(attempts[0]);
 const current=(await listInvitationsForPerson(recipient)).find(item=>item.id===invitation.id)!;
 expect(current.status).toBe(decision==="accept"?"ACCEPTED":"DECLINED");
 expect((await getAccessOverview(primary.personId,primary.serviceId)).people.some(item=>item.id===recipient&&item.state==="ACCEPTED")).toBe(decision==="accept");
});

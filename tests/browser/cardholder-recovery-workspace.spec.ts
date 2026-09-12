import {fundCardGroup,setPersonLimit} from "../helpers/cardholder";
import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { closeDatabase, getDb } from "../../src/platform/database/client";
import { identityBindings, permissionGrants } from "../../src/platform/database/schema";
import { SessionService } from "../../src/modules/identity";
import { sessionRepository } from "../../src/platform/database/session-repository";
import { createInvitation, getAccessOverview, listInvitationsForPerson } from "../../src/modules/access/service";
import { getWorkspace, startCardRequest, updateCardRequest } from "../../src/modules/workspace/service";
import {startSandbox} from "../../src/modules/sandbox/service";
import { cardPerson, cardPrimary, enrollCardholder, issuePracticeCard, secondaryPermissions } from "../helpers/cardholder";

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
 const primary=await cardPrimary(`Recovery ${action} ${randomUUID().slice(0,8)}`),own=await (async()=>{await fundCardGroup(primary.personId,primary.serviceId,"900");await setPersonLimit(primary.personId,primary.serviceId,primary.personId,"900");return issuePracticeCard(primary.personId,primary.serviceId,primary.personId,`Private ${action} card`);})();
 await signIn(page,primary.personId);
 const attempts:unknown[]=[],statuses:number[]=[];
 const path=`**/api/v1/cardholder-services/${primary.serviceId}/cards/${own.card.id}/control`;
 await page.route(path,async route=>{
  attempts.push(route.request().postDataJSON());const result=await route.fetch();statuses.push(result.status());
  if(attempts.length===1){expect(result.status()).toBe(200);await route.abort("connectionfailed");}else await route.fulfill({response:result});
 });
 await page.goto(`/cardholder-services?focus=${own.card.id}`);
 await page.getByRole("region",{name:"Selected card overview",exact:true}).getByRole("link",{name:"Card controls",exact:true}).click();
 const dialog=page.getByRole("dialog");
 await dialog.getByRole("button",{name:"Freeze",exact:true}).click();
 await dialog.getByRole("button",{name:"Freeze card",exact:true}).click();
 const retry=dialog.getByRole("button",{name:"Retry same change",exact:true});
 await expect(retry).toBeEnabled();
 await setPermission(primary,`cards.${action}`,"REVOKED");
 await retry.click();await expect.poll(()=>statuses.length).toBe(2);expect(statuses[1]).toBe(403);
 await expect(retry).toBeEnabled();await page.keyboard.press("Escape");await expect(dialog).toBeVisible();
 await expect(dialog.getByRole("button",{name:"Leave unconfirmed request",exact:true})).toHaveCount(0);
 await dialog.getByRole("button",{name:"Reload card access",exact:true}).click();
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
 const saved=await updateCardRequest(primary.personId,primary.serviceId,draft.id,{commandId:randomUUID(),expectedVersion:draft.version,holderId:primary.personId,nickname:"Private canceled request",format:"VIRTUAL"});
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
 await expect(retry).toBeEnabled();await dialog.getByRole("button",{name:"Reload request access",exact:true}).click();
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

for(const operation of ["invite","edit","revoke"] as const)test(`lost cardholder ${operation} result cannot change details or discard the original access command`,async({page})=>{
 test.setTimeout(90_000);
 const primary=await cardPrimary(`People recovery ${operation} ${randomUUID().slice(0,8)}`);
 const recipient={id:await cardPerson(`Private ${operation} person`),displayName:`Private ${operation} person`};
 const joined=operation==="invite"?await startSandbox(recipient.id,{commandId:randomUUID(),displayName:recipient.displayName,acknowledged:true}):null;
 if(operation!=="invite")await enrollCardholder(primary.personId,primary.serviceId,recipient.id);
 await signIn(page,primary.personId);
 const suffix=operation==="invite"?"/invitations":`/people/${recipient.id}${operation==="revoke"?"/revoke":""}`;
 const attempts:unknown[]=[],statuses:number[]=[];
 await page.route(`**/api/v1/cardholder-services/${primary.serviceId}${suffix}`,async route=>{
  if(route.request().method()==="GET"){await route.continue();return;}
  attempts.push(route.request().postDataJSON());const result=await route.fetch();statuses.push(result.status());
  if(attempts.length===1){expect(result.status()).toBe(200);await route.abort("connectionfailed");}else await route.fulfill({response:result});
 });
 await page.goto(`/cardholder-services?view=cardholders&manage=${primary.serviceId}${operation==="invite"?"":`&person=${recipient.id}`}`);
 if(operation==="invite"){
  await page.getByRole("button",{name:"Invite a person",exact:true}).click();
  await page.getByRole("dialog").getByRole("textbox",{name:"Member code",exact:true}).fill(joined!.memberCode!);
  await page.getByRole("dialog").getByRole("button",{name:"Find member",exact:true}).click();
  await expect(page.getByRole("dialog")).toContainText(`Selected: ${recipient.displayName}`);
 }else await page.getByRole("button",{name:operation==="edit"?"Change access":"Remove access",exact:true}).click();
 const dialog=page.getByRole("dialog"),retry=dialog.getByRole("button",{name:"Retry same access request",exact:true});
 if(operation!=="revoke"){
  if(operation==="edit")await dialog.getByRole("checkbox",{name:/^Make purchases/}).uncheck();
  await dialog.getByRole("button",{name:"Review access",exact:true}).click();
 }
 await dialog.getByRole("button",{name:operation==="invite"?"Save invitation":operation==="edit"?"Save these permissions":"Confirm revocation",exact:true}).click();
 await expect(retry).toBeEnabled();await expect(dialog.getByRole("button",{name:operation==="revoke"?"Keep access":"Back to details",exact:true})).toBeDisabled();
 await page.keyboard.press("Escape");await expect(dialog).toBeVisible();
 const permission=operation==="invite"?"people.invite":operation==="edit"?"people.changeRole":"people.revoke";
 await setPermission(primary,permission,"REVOKED");await retry.click();await expect.poll(()=>statuses.length).toBe(2);expect(statuses[1]).toBe(403);await expect(retry).toBeEnabled();
 await dialog.getByRole("button",{name:"Reload access",exact:true}).click();await expect(dialog).toHaveAccessibleName("Cardholder access unavailable");await expect(dialog).not.toContainText(recipient.displayName);
 await expect(dialog.getByRole("button",{name:"Leave unconfirmed request",exact:true})).toBeEnabled();
 await setPermission(primary,permission,"ACCEPTED");await retry.click();await expect(dialog).toHaveCount(0);
 expect(statuses).toEqual([200,403,200]);expect(attempts[1]).toEqual(attempts[0]);expect(attempts[2]).toEqual(attempts[0]);
 const after=await getAccessOverview(primary.personId,primary.serviceId);
 if(operation==="invite")expect(after.invitations.filter(item=>item.recipientId===recipient.id)).toHaveLength(1);
 else{const member=after.people.find(item=>item.id===recipient.id)!;expect(member.state).toBe(operation==="revoke"?"REVOKED":"ACCEPTED");if(operation==="edit")expect(member.permissions).not.toContain("cards.purchase");}
});

for(const decision of ["accept","decline"] as const)test(`lost ${decision} decision survives a later denial and reload without switching invitation decisions`,async({page})=>{
 test.setTimeout(90_000);
 const primary=await cardPrimary(`Invitation recovery ${randomUUID().slice(0,8)}`),recipient=await cardPerson(`Private ${decision} recipient`);
 const invitation=await createInvitation(primary.personId,primary.serviceId,{commandId:randomUUID(),recipientId:recipient,role:"SECONDARY",permissions:secondaryPermissions,delegablePermissions:[],expiresInDays:3});
 await signIn(page,recipient);const attempts:unknown[]=[];
 await page.route(`**/api/v1/invitations/${invitation.id}/${decision}`,async route=>{
  attempts.push(route.request().postDataJSON());
  if(attempts.length===1){const response=await route.fetch();expect(response.status()).toBe(200);await route.fulfill({status:200,contentType:"application/json",body:""});}
  // A later HTTP denial cannot prove that the first, committed decision failed.
  else if(attempts.length===2)await route.fulfill({status:403,contentType:"application/json",body:JSON.stringify({error:{code:"FORBIDDEN"}})});
  else await route.continue();
 });
 await page.goto("/shared-access");await page.locator(".ws-person-row").filter({hasText:`Reference ${invitation.id.slice(0,8).toUpperCase()}`}).getByRole("button",{name:"Review invitation",exact:true}).click();
 const dialog=page.getByRole("dialog"),retry=dialog.getByRole("button",{name:"Retry same invitation decision",exact:true});
 await dialog.getByRole("button",{name:decision==="accept"?"Accept this access":"Decline invitation",exact:true}).click();await expect(retry).toBeEnabled();
 for(const name of ["Accept this access","Decline invitation"])await expect(dialog.getByRole("button",{name,exact:true})).toBeDisabled();
 await retry.click();await expect.poll(()=>attempts.length).toBe(2);await expect(retry).toBeEnabled();
 await dialog.getByRole("button",{name:"Reload invitation access",exact:true}).click();
 await expect(retry).toBeEnabled();await page.keyboard.press("Escape");await expect(dialog).toBeVisible();
 // The current list already contains the committed decision; retry still sends
 // the original version and command instead of accepting a new decision.
 await retry.click();await expect(dialog).toHaveCount(0);
 expect(attempts).toHaveLength(3);expect(attempts[1]).toEqual(attempts[0]);expect(attempts[2]).toEqual(attempts[0]);
 const current=(await listInvitationsForPerson(recipient)).find(item=>item.id===invitation.id)!;
 expect(current.status).toBe(decision==="accept"?"ACCEPTED":"DECLINED");
 expect((await getAccessOverview(primary.personId,primary.serviceId)).people.some(item=>item.id===recipient&&item.state==="ACCEPTED")).toBe(decision==="accept");
});

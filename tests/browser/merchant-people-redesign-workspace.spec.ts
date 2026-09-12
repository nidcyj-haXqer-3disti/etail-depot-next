import {randomUUID} from "node:crypto";
import {and,eq} from "drizzle-orm";
import AxeBuilder from "@axe-core/playwright";
import {expect,test,type BrowserContext,type Page} from "@playwright/test";
import {closeDatabase,getDb} from "../../src/platform/database/client";
import {identityBindings,permissionGrants,serviceMembers} from "../../src/platform/database/schema";
import {SessionService} from "../../src/modules/identity";
import {sessionRepository} from "../../src/platform/database/session-repository";
import {startSandbox} from "../../src/modules/sandbox/service";
import {createMerchantInvitation,getMerchantAccessOverview,revokeMerchantAccess} from "../../src/modules/access/merchant-service";
import {acceptInvitation} from "../../src/modules/access/service";
import {getMerchantBusinessDetails} from "../../src/modules/acquiring/service";
import {merchantAccessFixture,merchantOffer} from "../helpers/merchant-access";
import {acquiringFixture,acquiringPerson} from "../helpers/acquiring";

const origin="http://127.0.0.1:3100";
test.afterAll(closeDatabase);
async function signIn(context:BrowserContext,personId:string){
 const [identity]=await getDb().select().from(identityBindings).where(and(eq(identityBindings.personId,personId),eq(identityBindings.issuer,"urn:etail:isolated-fixture")));
 if(!identity)throw new Error("Expected an isolated fictional identity");
 const session=await new SessionService(sessionRepository,{appEnv:"test",publicOrigin:origin}).issue({personId,identityId:identity.id});
 const pair=session.cookie.split(";",1)[0]!;
 await context.addCookies([{name:pair.slice(0,pair.indexOf("=")),value:pair.slice(pair.indexOf("=")+1),domain:"127.0.0.1",path:"/",httpOnly:true,sameSite:"Strict",expires:Math.floor(session.record.expiresAt.getTime()/1000)}]);
}
async function accessible(page:Page){
 expect((await new AxeBuilder({page}).include("main").withTags(["wcag2a","wcag2aa","wcag21aa"]).analyze()).violations).toEqual([]);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true);
}

test("ordinary merchant collection access is reviewed, recovers one invitation, starts only on acceptance and revokes into history",async({page,browser})=>{
 test.setTimeout(120000);
 const f=await merchantAccessFixture(),name=`Collection colleague ${randomUUID().slice(0,6)}`;
 const member=await startSandbox(f.helper.personId,{commandId:randomUUID(),displayName:name,acknowledged:true});
 const recipientContext=await browser.newContext({viewport:page.viewportSize()??{width:1440,height:900}}),recipientPage=await recipientContext.newPage();
 await signIn(page.context(),f.merchant.personId);await signIn(recipientContext,f.helper.personId);
 const beforeMemberships=await getDb().select().from(serviceMembers).where(eq(serviceMembers.personId,f.helper.personId));
 try{
  await page.goto(`/merchants/${f.unit.id}?tab=people`);
  await expect(page.getByRole("heading",{name:"People & access",exact:true})).toBeVisible();
  await page.getByRole("button",{name:"Invite person",exact:true}).click();
  const invite=page.getByRole("dialog",{name:"Invite a person",exact:true});
  await expect(invite.getByRole("radio")).toHaveCount(0);
  await expect(invite.getByRole("combobox",{name:"Person",exact:true})).toHaveCount(0);
  await expect(invite.getByRole("button",{name:/View records|Manage people/})).toHaveCount(0);
  await invite.getByRole("textbox",{name:"Member code",exact:true}).fill(member.memberCode!);
  await invite.getByRole("button",{name:"Find member",exact:true}).click();
  await expect(invite).toContainText(`Selected person: ${name}`);
  await expect(invite.getByLabel("Selected merchant access")).toContainText("Can create payment channels");
  await expect(invite.getByLabel("Selected merchant access")).toContainText("They cannot invite others");
  await invite.getByRole("button",{name:"Review invitation",exact:true}).click();
  expect((await getMerchantAccessOverview(f.merchant.personId,f.unit.id)).pendingInvitationCount).toBe(0);
  const review=page.getByRole("dialog",{name:"Review merchant invitation",exact:true});
  await expect(review).toContainText("including time before acceptance");
  const bodies:string[]=[];
  await page.route(`**/api/v1/merchants/${f.unit.id}/invitations`,async route=>{
   if(route.request().method()!=="POST"){await route.continue();return;}
   bodies.push(route.request().postData()!);
   if(bodies.length===1){const saved=await route.fetch();expect(saved.status()).toBe(200);await route.abort("failed");}else await route.continue();
  });
  await review.getByRole("button",{name:"Save invitation",exact:true}).click();
  await expect(review.getByRole("button",{name:"Retry same access request",exact:true})).toBeVisible();
  await expect(page.locator(".mn-navigation-boundary")).toHaveAttribute("data-pending","true");
  await review.getByRole("button",{name:"Retry same access request",exact:true}).click();
  await expect(review).toBeHidden();expect(bodies).toHaveLength(2);expect(bodies[0]).toBe(bodies[1]);expect(JSON.parse(bodies[0]).recipientId).toBe(f.helper.personId);
  const saved=await getMerchantAccessOverview(f.merchant.personId,f.unit.id),offer=saved.invitations.find(item=>item.recipientId===f.helper.personId)!;
  expect(saved.pendingInvitationCount).toBe(1);expect(offer.permissions).toEqual(expect.arrayContaining(["merchant.read","channels.read","channels.create","channels.update","channels.share","payments.read"]));expect(offer.delegablePermissions).toEqual([]);
  expect(saved.people.some(person=>person.personId===f.helper.personId)).toBe(false);
  expect((await recipientPage.request.get(`/api/v1/merchants/${f.unit.id}`)).status()).toBe(404);
  await recipientPage.goto("/shared-access");
  await expect(recipientPage).toHaveURL(/\/shared-access$/);
  await expect(recipientPage.getByRole("heading",{name:"Shared access",level:1,exact:true})).toBeVisible();
  await recipientPage.locator(".ws-person-row").filter({hasText:offer.id.slice(0,8).toUpperCase()}).getByRole("button",{name:"Review invitation",exact:true}).click();
  await recipientPage.getByRole("dialog",{name:"Review merchant invitation",exact:true}).getByRole("button",{name:"Accept this access",exact:true}).click();
  await recipientPage.getByRole("link",{name:"Continue to merchant",exact:true}).click();
  await expect(recipientPage).toHaveURL(new RegExp(`/merchants/${f.unit.id}.*tab=channels`));
  expect((await recipientPage.request.get(`/api/v1/merchants/${f.master.id}`)).status()).toBe(404);
  expect(await getDb().select().from(serviceMembers).where(eq(serviceMembers.personId,f.helper.personId))).toEqual(beforeMemberships);
  await page.getByRole("button",{name:"Reload people",exact:true}).click();
  const person=page.locator(".mp-person").filter({hasText:name});await expect(person).toContainText("Active access");
  await accessible(page);
  await person.getByRole("button",{name:"Revoke access",exact:true}).click();
  await page.getByRole("dialog",{name:"Remove merchant access?",exact:true}).getByRole("button",{name:"Confirm revoke",exact:true}).click();
  await expect(page.getByRole("dialog")).toBeHidden();
  await page.getByRole("button",{name:/^Past access/}).click();
  await expect(page.locator(".mp-person").filter({hasText:name})).toContainText("Access removed");
  await expect(page.locator(".mp-person").filter({hasText:name}).getByRole("button",{name:"Invite again",exact:true})).toBeVisible();
  await page.locator(".mp-person").filter({hasText:name}).getByRole("button",{name:"Invite again",exact:true}).click();
  await expect(invite).toContainText(`Selected person: ${name}`);
  await expect(invite.getByRole("combobox",{name:"Person",exact:true})).toHaveCount(0);
  await invite.getByRole("button",{name:"Review invitation",exact:true}).click();
  await expect(review.getByRole("heading",{name,exact:true})).toBeVisible();
  await review.getByRole("button",{name:"Back to permissions",exact:true}).click();
  await invite.getByRole("button",{name:"Cancel",exact:true}).click();
  expect((await recipientPage.request.get(`/api/v1/merchants/${f.unit.id}`)).status()).toBe(404);
 }finally{await recipientContext.close();}
});

test("a limited inviter gets only current actions and a usable short term, while a near-expiry invitation explains why it cannot continue",async({page})=>{
 const f=await merchantAccessFixture();
 const permissions=["merchant.read","merchant.people.read","merchant.people.invite","channels.read","payments.read"] as const;
 const offer=await createMerchantInvitation(f.merchant.personId,f.unit.id,merchantOffer(f.helper.personId,[...permissions],[...permissions]));
 await acceptInvitation(f.helper.personId,offer.id,{commandId:randomUUID(),expectedVersion:offer.version});
 await signIn(page.context(),f.helper.personId);await page.goto(`/merchants/${f.unit.id}?tab=people`);
 await page.getByRole("button",{name:"Invite person",exact:true}).click();
 const invite=page.getByRole("dialog",{name:"Invite a person",exact:true});
 await expect(invite.getByRole("combobox",{name:"Invitation available for",exact:true})).toHaveValue("1");
 await expect(invite.getByRole("combobox",{name:"Merchant access lasts",exact:true})).toHaveValue("1");
 await invite.getByText("Customize access",{exact:true}).click();
 await expect(invite.getByRole("checkbox",{name:/^Create channels/})).toHaveCount(0);
 await expect(invite.getByRole("checkbox",{name:/^Try a sandbox payment/})).toHaveCount(0);
 await expect(invite.locator(".mp-permission-options").getByRole("checkbox",{name:/^Invite people/})).not.toBeChecked();
 await accessible(page);
 await invite.getByRole("button",{name:"Cancel",exact:true}).click();
 const near=await acquiringPerson(),nearOffer=await createMerchantInvitation(f.merchant.personId,f.unit.id,{...merchantOffer(near.personId,[...permissions],[...permissions]),expiresInDays:1,accessExpiresInDays:1});
 await acceptInvitation(near.personId,nearOffer.id,{commandId:randomUUID(),expectedVersion:nearOffer.version});
 await signIn(page.context(),near.personId);await page.goto(`/merchants/${f.unit.id}?tab=people`);
 await page.getByRole("button",{name:"Invite person",exact:true}).click();
 await expect(invite).toContainText("Your access ends too soon to offer an available invitation term");
 await expect(invite.getByRole("button",{name:"Review invitation",exact:true})).toBeDisabled();
});

test("business details starts with saved progress, recovers its exact draft and returns to payment setup without implying approval",async({page})=>{
 const f=await acquiringFixture();await signIn(page.context(),f.personId);
 await page.goto(`/merchants/${f.merchantId}/business-details`);
 await expect(page.getByRole("dialog")).toBeHidden();
 await page.getByRole("button",{name:"Continue merchant setup",exact:true}).click();
 const setup=page.getByRole("dialog",{name:"Merchant setup",exact:true});
 await setup.getByRole("combobox",{name:"Applicant type",exact:true}).selectOption("SOLE_PROPRIETOR");
 await setup.getByRole("textbox",{name:"Legal name",exact:true}).fill("Fictional garden shop");
 await setup.getByRole("textbox",{name:"Selling name",exact:true}).fill("Sample plants");
 await setup.getByRole("textbox",{name:"What will you sell?",exact:true}).fill("Fictional plants and garden supplies");
 await expect(setup.getByRole("checkbox")).toHaveCount(0);
 const bodies:string[]=[];
 await page.route(`**/api/v1/merchants/${f.merchantId}/business-details/application/${f.setup.id}`,async route=>{
  if(route.request().method()!=="PATCH"){await route.continue();return;}
  bodies.push(route.request().postData()!);
  if(bodies.length===1){const saved=await route.fetch();expect(saved.status()).toBe(200);await route.abort("failed");}else await route.continue();
 });
 await setup.getByRole("button",{name:"Save & review",exact:true}).click();
 await expect(setup.getByRole("button",{name:"Retry same save",exact:true})).toBeVisible();
 await setup.getByRole("button",{name:"Close Merchant setup",exact:true}).click();await expect(setup).toBeVisible();
 await setup.getByRole("button",{name:"Retry same save",exact:true}).click();
 await expect(setup.getByRole("heading",{name:"Review your merchant setup",exact:true})).toBeVisible();
 expect(bodies).toHaveLength(2);expect(bodies[0]).toBe(bodies[1]);expect(JSON.parse(bodies[0]).fictionalDetailsConfirmed).toBe(true);
 await setup.getByRole("button",{name:"Submit for review",exact:true}).click();
 await expect(setup.getByRole("heading",{name:"Saved for review",exact:true})).toBeVisible();
 expect((await getMerchantBusinessDetails(f.personId,f.merchantId)).merchantStatus).toBe("PENDING_LOCAL_REVIEW");
 await accessible(page);
 await setup.getByRole("button",{name:"Return to payment setup",exact:true}).click();
 await expect(page).toHaveURL(url=>url.pathname===`/merchants/${f.merchantId}`&&url.searchParams.get("tab")==="verification");
});

test("an unconfirmed access request stays locked until a removed user explicitly leaves after a denied access refresh",async({page})=>{
 const f=await merchantAccessFixture(),member=await startSandbox(f.helper.personId,{commandId:randomUUID(),displayName:"Fictional invitation recipient",acknowledged:true});
 await signIn(page.context(),f.operator.personId);await page.goto(`/merchants/${f.unit.id}?tab=people`);
 await page.getByRole("button",{name:"Invite person",exact:true}).click();
 const invite=page.getByRole("dialog",{name:"Invite a person",exact:true});
 await invite.getByRole("textbox",{name:"Member code",exact:true}).fill(member.memberCode!);
 await invite.getByRole("button",{name:"Find member",exact:true}).click();
 await expect(invite).toContainText("Selected person: Fictional invitation recipient");
 await invite.getByRole("button",{name:"Review invitation",exact:true}).click();
 let writes=0;
 await page.route(`**/api/v1/merchants/${f.unit.id}/invitations`,async route=>{
  if(route.request().method()!=="POST"){await route.continue();return;}
  writes++;const saved=await route.fetch();expect(saved.status()).toBe(200);await route.abort("failed");
 });
 await page.getByRole("dialog",{name:"Review merchant invitation",exact:true}).getByRole("button",{name:"Save invitation",exact:true}).click();
 await expect(page.getByRole("button",{name:"Retry same access request",exact:true})).toBeVisible();
 await expect(page.getByRole("button",{name:"Leave unconfirmed request",exact:true})).toHaveCount(0);
 const primary=await getMerchantAccessOverview(f.merchant.personId,f.unit.id),assignment=primary.people.find(person=>person.personId===f.operator.personId)!;
 await revokeMerchantAccess(f.merchant.personId,f.unit.id,assignment.id,{commandId:randomUUID(),expectedVersion:assignment.version});
 await page.getByRole("button",{name:"Reload merchant access",exact:true}).click();
 await expect(page.getByRole("heading",{name:"Merchant access unavailable",exact:true})).toBeVisible();
 await expect(page.locator(".mp-workspace")).not.toContainText("Fictional invitation recipient");
 await expect(page.getByRole("button",{name:"Retry same access request",exact:true})).toBeVisible();
 await expect(page.locator(".mn-navigation-boundary")).toHaveAttribute("data-pending","true");
 await expect(page.locator(".mp-workspace")).toContainText("Leaving does not cancel it or confirm whether it was saved.");
 await page.getByRole("button",{name:"Leave unconfirmed request",exact:true}).click();
 await expect(page).toHaveURL(url=>url.pathname==="/merchant-services");expect(writes).toBe(1);
 expect((await getMerchantAccessOverview(f.merchant.personId,f.unit.id)).invitations.filter(item=>item.recipientId===f.helper.personId)).toHaveLength(1);
});

test("business-details recovery stays visible after edit access changes and permits explicit leaving only after read access is denied",async({page})=>{
 const f=await acquiringFixture();await signIn(page.context(),f.personId);
 await page.goto(`/merchants/${f.merchantId}/business-details`);
 await page.getByRole("button",{name:"Continue merchant setup",exact:true}).click();
 const setup=page.getByRole("dialog",{name:"Merchant setup",exact:true});
 await setup.getByRole("textbox",{name:"Legal name",exact:true}).fill("Fictional private draft name");
 let writes=0;
 await page.route(`**/api/v1/merchants/${f.merchantId}/business-details/application/${f.setup.id}`,async route=>{
  if(route.request().method()!=="PATCH"){await route.continue();return;}
  writes++;const saved=await route.fetch();expect(saved.status()).toBe(200);await route.abort("failed");
 });
 await setup.getByRole("button",{name:"Save & review",exact:true}).click();
 await expect(setup.getByRole("button",{name:"Retry same save",exact:true})).toBeVisible();
 await getDb().update(permissionGrants).set({state:"REVOKED"}).where(and(eq(permissionGrants.serviceId,f.serviceId),eq(permissionGrants.personId,f.personId),eq(permissionGrants.action,"acquiring.setup")));
 await setup.getByRole("button",{name:"Reload merchant setup",exact:true}).click();
 await expect(setup.getByRole("heading",{name:"Review your merchant setup",exact:true})).toBeVisible();
 await expect(setup.getByRole("button",{name:"Retry same save",exact:true})).toBeVisible();
 await expect(setup.getByRole("button",{name:"Leave unconfirmed request",exact:true})).toHaveCount(0);
 await getDb().update(permissionGrants).set({state:"REVOKED"}).where(and(eq(permissionGrants.serviceId,f.serviceId),eq(permissionGrants.personId,f.personId),eq(permissionGrants.action,"acquiring.read")));
 await setup.getByRole("button",{name:"Reload merchant setup",exact:true}).click();
 await expect(setup.getByRole("heading",{name:"Business details unavailable",exact:true})).toBeVisible();
 await expect(setup).not.toContainText("Fictional private draft name");
 await expect(setup.getByRole("button",{name:"Retry same save",exact:true})).toBeVisible();
 await expect(page.locator(".mn-navigation-boundary")).toHaveAttribute("data-pending","true");
 await expect(setup).toContainText("Leaving does not cancel it or confirm whether it was saved.");
 await setup.getByRole("button",{name:"Leave unconfirmed request",exact:true}).click();
 await expect(page).toHaveURL(url=>url.pathname==="/merchant-services");expect(writes).toBe(1);
});

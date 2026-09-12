import {randomUUID} from "node:crypto";
import {and,eq} from "drizzle-orm";
import AxeBuilder from "@axe-core/playwright";
import {expect,test,type BrowserContext,type Page} from "@playwright/test";
import {closeDatabase,getDb} from "../../src/platform/database/client";
import {identityBindings,permissionGrants} from "../../src/platform/database/schema";
import {SessionService} from "../../src/modules/identity";
import {sessionRepository} from "../../src/platform/database/session-repository";
import {startSandbox} from "../../src/modules/sandbox/service";
import {getMerchantAccessOverview} from "../../src/modules/access/merchant-service";
import {getMerchantBusinessDetails} from "../../src/modules/acquiring/service";
import {merchantAccessFixture} from "../helpers/merchant-access";
import {acquiringFixture} from "../helpers/acquiring";

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

test("owner invitations recover one request, grant one terminal on acceptance and remove access",async({page,browser})=>{
 test.setTimeout(120000);const f=await merchantAccessFixture(),name=`Terminal colleague ${randomUUID().slice(0,6)}`;
 const member=await startSandbox(f.helper.personId,{commandId:randomUUID(),displayName:name,acknowledged:true});
 const context=await browser.newContext({viewport:page.viewportSize()??{width:1440,height:900}}),recipient=await context.newPage();await signIn(page.context(),f.merchant.personId);await signIn(context,f.helper.personId);
 try{
  await page.goto(`/merchants/${f.unit.id}?tab=people`);await page.getByRole("button",{name:"Invite a person",exact:true}).click();
  const invite=page.getByRole("dialog",{name:"Invite a person",exact:true});await invite.getByRole("textbox",{name:"Member code",exact:true}).fill(member.memberCode!);await invite.getByRole("button",{name:"Find person",exact:true}).click();await expect(invite).toContainText(`Selected: ${name}`);
  await invite.getByRole("button",{name:"Review invitation",exact:true}).click();const review=page.getByRole("dialog",{name:"Review payment access",exact:true});await expect(review).toContainText("You keep control of money, refunds, settings and invitations. They cannot change them.");await expect(review.getByRole("checkbox")).toHaveCount(0);
  const bodies:string[]=[];await page.route(`**/api/v1/merchants/${f.unit.id}/invitations`,async route=>{if(route.request().method()!=="POST"){await route.continue();return;}bodies.push(route.request().postData()!);if(bodies.length===1){expect((await route.fetch()).status()).toBe(200);await route.abort("failed");}else await route.continue();});
  await review.getByRole("button",{name:"Save invitation",exact:true}).click();await review.getByRole("button",{name:"Check access request again",exact:true}).click();await expect(review).toBeHidden();expect(bodies[0]).toBe(bodies[1]);
  const access=await getMerchantAccessOverview(f.merchant.personId,f.unit.id),offer=access.invitations.find(row=>row.recipientId===f.helper.personId)!;expect(access.pendingInvitationCount).toBe(1);expect(offer.permissions).toContain("disputes.respond");expect(offer).not.toHaveProperty("delegablePermissions");
  expect((await recipient.request.get(`/api/v1/merchants/${f.unit.id}`)).status()).toBe(404);await recipient.goto("/shared-access");await recipient.locator(".ws-person-row").filter({hasText:offer.id.slice(0,8).toUpperCase()}).getByRole("button",{name:"Review invitation"}).click();await recipient.getByRole("dialog",{name:"Review terminal invitation",exact:true}).getByRole("button",{name:"Accept invitation",exact:true}).click();await recipient.getByRole("link",{name:"Open your terminal",exact:true}).click();await expect(recipient).toHaveURL(new RegExp(`/merchants/${f.unit.id}`));expect((await recipient.request.get(`/api/v1/merchants/${f.master.id}`)).status()).toBe(404);
  await page.reload();const person=page.locator(".mp-person").filter({hasText:name});await expect(person).toContainText("Can collect payments");await accessible(page);await person.getByRole("button",{name:"Remove access",exact:true}).click();await page.getByRole("dialog",{name:"Remove payment access?",exact:true}).getByRole("button",{name:"Confirm removal",exact:true}).click();await expect(page.getByRole("dialog")).toBeHidden();expect((await recipient.request.get(`/api/v1/merchants/${f.unit.id}`)).status()).toBe(404);
 }finally{await context.close();}
});
test("terminal users cannot access people management or invite anyone onward",async({page})=>{
 const f=await merchantAccessFixture();await signIn(page.context(),f.operator.personId);await page.goto(`/merchants/${f.unit.id}?tab=channels`);await expect(page.getByRole("button",{name:"Invite a person",exact:true})).toHaveCount(0);await expect(page.getByRole("link",{name:"People",exact:true})).toHaveCount(0);expect((await page.request.get(`/api/v1/merchants/${f.unit.id}/access`)).status()).toBe(403);await accessible(page);
});

test("business details starts with saved progress, recovers its exact draft and returns to payment setup without implying approval",async({page})=>{
 const f=await acquiringFixture();await signIn(page.context(),f.personId);
 await page.goto(`/merchants/${f.merchantId}/business-details`);
 await expect(page.getByRole("dialog")).toBeHidden();
 await page.getByRole("button",{name:"Continue business details",exact:true}).click();
 const setup=page.getByRole("dialog",{name:"Business details",exact:true});
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
 await setup.getByRole("button",{name:"Close Business details",exact:true}).click();await expect(setup).toBeVisible();
 await setup.getByRole("button",{name:"Retry same save",exact:true}).click();
 await expect(setup.getByRole("heading",{name:"Review your business details",exact:true})).toBeVisible();
 expect(bodies).toHaveLength(2);expect(bodies[0]).toBe(bodies[1]);expect(JSON.parse(bodies[0]).fictionalDetailsConfirmed).toBe(true);
 await setup.getByRole("button",{name:"Submit for review",exact:true}).click();
 await expect(setup.getByRole("heading",{name:"Saved for review",exact:true})).toBeVisible();
 expect((await getMerchantBusinessDetails(f.personId,f.merchantId)).merchantStatus).toBe("PENDING_LOCAL_REVIEW");
 await accessible(page);
 await setup.getByRole("button",{name:"Return to payment setup",exact:true}).click();
 await expect(page).toHaveURL(url=>url.pathname===`/merchants/${f.merchantId}`&&url.searchParams.get("tab")==="verification");
});

test("business-details recovery stays visible after edit access changes and permits explicit leaving only after read access is denied",async({page})=>{
 const f=await acquiringFixture();await signIn(page.context(),f.personId);
 await page.goto(`/merchants/${f.merchantId}/business-details`);
 await page.getByRole("button",{name:"Continue business details",exact:true}).click();
 const setup=page.getByRole("dialog",{name:"Business details",exact:true});
 await setup.getByRole("textbox",{name:"Legal name",exact:true}).fill("Fictional private draft name");
 let writes=0;
 await page.route(`**/api/v1/merchants/${f.merchantId}/business-details/application/${f.setup.id}`,async route=>{
  if(route.request().method()!=="PATCH"){await route.continue();return;}
  writes++;const saved=await route.fetch();expect(saved.status()).toBe(200);await route.abort("failed");
 });
 await setup.getByRole("button",{name:"Save & review",exact:true}).click();
 await expect(setup.getByRole("button",{name:"Retry same save",exact:true})).toBeVisible();
 await getDb().update(permissionGrants).set({state:"REVOKED"}).where(and(eq(permissionGrants.serviceId,f.serviceId),eq(permissionGrants.personId,f.personId),eq(permissionGrants.action,"acquiring.setup")));
 await setup.getByRole("button",{name:"Reload business details",exact:true}).click();
 await expect(setup.getByRole("heading",{name:"Review your business details",exact:true})).toBeVisible();
 await expect(setup.getByRole("button",{name:"Retry same save",exact:true})).toBeVisible();
 await expect(setup.getByRole("button",{name:"Leave for now",exact:true})).toHaveCount(0);
 await getDb().update(permissionGrants).set({state:"REVOKED"}).where(and(eq(permissionGrants.serviceId,f.serviceId),eq(permissionGrants.personId,f.personId),eq(permissionGrants.action,"acquiring.read")));
 await setup.getByRole("button",{name:"Reload business details",exact:true}).click();
 await expect(setup.getByRole("heading",{name:"Business details unavailable",exact:true})).toBeVisible();
 await expect(setup).not.toContainText("Fictional private draft name");
 await expect(setup.getByRole("button",{name:"Retry same save",exact:true})).toBeVisible();
 await expect(page.locator(".mn-navigation-boundary")).toHaveAttribute("data-pending","true");
 await expect(setup).toContainText("Leaving does not cancel it or confirm whether it was saved.");
 await setup.getByRole("button",{name:"Leave for now",exact:true}).click();
 await expect(page).toHaveURL(url=>url.pathname==="/merchant-services");expect(writes).toBe(1);
});

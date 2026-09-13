import {createCardUI,inviteCardUI,acceptCardUI,signInVerified} from "./helpers/card-invitation";
import {fundCardGroup} from "../helpers/cardholder";
import { randomUUID } from "node:crypto";
import { and,eq } from "drizzle-orm";
import AxeBuilder from "@axe-core/playwright";
import { expect,test,type Page } from "@playwright/test";
import { closeDatabase,getDb } from "../../src/platform/database/client";
import { identityBindings } from "../../src/platform/database/schema";
import { SessionService } from "../../src/modules/identity";
import { sessionRepository } from "../../src/platform/database/session-repository";
import { cardPerson,cardPrimary,enrollCardholder,issuePracticeCard } from "../helpers/cardholder";
import { getWorkspace } from "../../src/modules/workspace/service";

const origin="http://127.0.0.1:3100";
test.afterAll(closeDatabase);
async function signIn(page:Page,personId:string){
 const [identity]=await getDb().select().from(identityBindings).where(and(eq(identityBindings.personId,personId),eq(identityBindings.issuer,"urn:etail:isolated-fixture")));
 if(!identity)throw new Error("Expected an isolated test identity");
 const session=await new SessionService(sessionRepository,{appEnv:"test",publicOrigin:origin}).issue({personId,identityId:identity.id}),pair=session.cookie.split(";",1)[0]!;
 await page.context().addCookies([{name:pair.slice(0,pair.indexOf("=")),value:pair.slice(pair.indexOf("=")+1),domain:"127.0.0.1",path:"/",httpOnly:true,sameSite:"Strict",expires:Math.floor(session.record.expiresAt.getTime()/1000)}]);
}
async function fillCard(page:Page,name:string){
 const dialog=page.getByRole("dialog");
 await dialog.getByRole("textbox",{name:"Card name",exact:true}).fill(name);
 await dialog.getByRole("textbox",{name:"Total spending limit (USD)",exact:true}).fill("25.00");
 return dialog;
}
async function accessible(page:Page){
 expect((await new AxeBuilder({page}).include("main").withTags(["wcag2a","wcag2aa","wcag21aa"]).analyze()).violations).toEqual([]);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true);
}

test("multiple drafts retain their own details and created/canceled requests remain usable after reload",async({page})=>{
 test.setTimeout(120_000);
 const primary=await cardPrimary(`Request UI ${randomUUID().slice(0,8)}`);
 await signIn(page,primary.personId);
 await page.goto(`${origin}/cardholder-services?view=requests`);
 for(const name of ["Travel request","Everyday request"]){
  await page.getByRole("link",{name:"Add card",exact:true}).click();
  const dialog=await fillCard(page,name);
  await dialog.getByRole("button",{name:"Save for later",exact:true}).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator(".ch-request-record").filter({hasText:name})).toBeVisible();
 }
 await page.reload();
 await expect(page.locator(".ch-request-record")).toHaveCount(2);
 await accessible(page);
 await page.locator(".ch-request-record").filter({hasText:"Travel request"}).getByRole("link").click();
 let dialog=page.getByRole("dialog");
 await expect(dialog.getByRole("textbox",{name:"Card name",exact:true})).toHaveValue("Travel request");
 await dialog.getByRole("button",{name:"Cancel this request",exact:true}).click();
 await expect(dialog.getByRole("heading",{name:"Cancel Travel request?",exact:true})).toBeVisible();
 await dialog.getByRole("button",{name:"Confirm cancellation",exact:true}).click();
 await expect(dialog.getByRole("heading",{name:"Request canceled",exact:true})).toBeVisible();
 await dialog.getByRole("button",{name:"Close",exact:true}).click();
 await page.locator(".ch-request-record").filter({hasText:"Everyday request"}).getByRole("link").click();
 dialog=page.getByRole("dialog");
 await expect(dialog.getByRole("textbox",{name:"Card name",exact:true})).toHaveValue("Everyday request");
 await dialog.getByRole("button",{name:"Review card",exact:true}).click();
 await dialog.getByRole("button",{name:"Create card",exact:true}).click();
 await expect(page.getByRole("dialog")).toHaveCount(0);
 await expect(page.getByRole("region",{name:"Selected card overview",exact:true})).toContainText("Everyday request");
 const result=await getWorkspace(primary.personId,primary.serviceId),issued=result.cards[0]!;
 expect(result.cardRequests).toHaveLength(2);
 expect(result.cards).toHaveLength(1);
 await page.getByRole("navigation",{name:"Cards and spending navigation",exact:true}).getByRole("link",{name:"Cards",exact:true}).click();
 await page.getByRole("navigation",{name:"Card management",exact:true}).getByRole("link",{name:"Card history",exact:true}).click();
 await expect(page).toHaveURL(/view=requests/);
 await expect(page.getByRole("heading",{name:"Card history",level:3,exact:true})).toBeVisible();
 await page.reload();
 const canceled=page.locator(".ch-request-record").filter({hasText:"Travel request"});
 const created=page.locator(".ch-request-record").filter({hasText:"Everyday request"});
 await expect(canceled).toContainText("Canceled");
 await expect(created).toContainText("Card created");
 await created.getByRole("link").first().click();
 dialog=page.getByRole("dialog");
 await dialog.getByText("Request history",{exact:true}).click();
 await expect(dialog).toContainText("Request started");
 await expect(dialog).toContainText("Card details saved");
 await expect(dialog).toContainText("Card creation checked");
 await dialog.getByRole("button",{name:"View your card",exact:true}).click();
 await expect(page).toHaveURL(new RegExp(`focus=${issued.id}`));
 await page.goto(`${origin}/cardholder-services?view=requests`);
 await page.getByRole("searchbox",{name:"Search card history",exact:true}).fill("Travel");
 await page.getByRole("combobox",{name:"Status",exact:true}).selectOption("CANCELED");
 await page.getByRole("button",{name:"Apply filters",exact:true}).click();
 await expect(page.locator(".ch-request-record")).toHaveCount(1);
 await page.reload();
 await expect(page.getByRole("searchbox",{name:"Search card history",exact:true})).toHaveValue("Travel");
 await expect(page.getByRole("combobox",{name:"Status",exact:true})).toHaveValue("CANCELED");
 await accessible(page);
});

test("an owner sees a person's cards and history while holders cannot open management",async({page,browser})=>{
 test.setTimeout(120_000);
 const primary=await cardPrimary(`People UI ${randomUUID().slice(0,8)}`),secondary=await cardPerson("Jordan Sample");
 await signIn(page,primary.personId);
 const email=`jordan-${randomUUID()}@example.test`,recipientContext=await browser.newContext({viewport:page.viewportSize()??undefined}),recipientPage=await recipientContext.newPage();
 try{
  await signInVerified(recipientPage,secondary,email);
  for(const name of ["Jordan groceries","Jordan travel"]){
   const card=await createCardUI(page,name,"25.00");expect(card.assignmentState).toBe("UNASSIGNED");
   const invitation=await inviteCardUI(page,card.id,email);await acceptCardUI(recipientPage,invitation);
  }
 }finally{await recipientContext.close();}
 await page.goto(`${origin}/cardholder-services?view=cardholders&person=${secondary}`);
 const profile=page.locator(".access-cardholder");await expect(profile.locator(".access-person-card-list li")).toHaveCount(2);await expect(profile).toContainText("Jordan groceries");await expect(profile).toContainText("Jordan travel");
 await expect(page.getByRole("button",{name:"Change access",exact:true})).toHaveCount(0);await accessible(page);
 await page.getByRole("link",{name:"All people",exact:true}).click();
 await page.getByRole("searchbox",{name:"Search people",exact:true}).fill("Jordan");await page.getByRole("button",{name:"Search",exact:true}).click();
 await page.waitForURL(url=>url.pathname==="/cardholder-services"&&url.searchParams.get("view")==="cardholders"&&url.searchParams.get("peopleSearch")==="Jordan",{waitUntil:"domcontentloaded"});
 await expect(profile).toHaveCount(1);await page.reload();
 await expect(page.getByRole("searchbox",{name:"Search people",exact:true})).toHaveValue("Jordan");await expect(profile).toHaveCount(1);
 await profile.getByRole("link",{name:"Jordan Sample",exact:true}).click();await expect(profile.locator(".access-person-card-list li")).toHaveCount(2);
 await profile.locator("li").filter({hasText:"Jordan travel"}).getByRole("link",{name:"Card settings",exact:true}).click();
 await expect(page.getByRole("dialog")).toContainText("Only Jordan Sample can use this card");await expect(page.getByRole("dialog").getByRole("article",{name:"Card spending limit"})).toContainText("$25.00");await page.keyboard.press("Escape");
 await page.getByRole("link",{name:"All people",exact:true}).click();await page.getByRole("button",{name:"History",exact:true}).click();await expect(page.locator(".access-history")).toContainText("Invitation accepted");
 const context=await browser.newContext({viewport:page.viewportSize()??undefined});
 try{const holderPage=await context.newPage();await signIn(holderPage,secondary);await holderPage.goto(`${origin}/cardholder-services?view=cardholders&person=${primary.personId}`);await expect(holderPage.getByRole("heading",{name:"People are managed by the account owner",exact:true})).toBeVisible();await expect(holderPage.getByRole("button",{name:"Remove access",exact:true})).toHaveCount(0);await holderPage.goto(`${origin}/cardholder-services?view=requests`);await expect(holderPage.locator(".ch-request-record")).toHaveCount(0);}finally{await context.close();}
 await page.goto(`${origin}/cardholder-services?view=cardholders&person=${randomUUID()}`);await expect(page.getByRole("heading",{name:"This person is unavailable",exact:true})).toBeVisible();await expect(profile).toHaveCount(0);
});

test("a secondary can remove their own freeze while the primary's restriction stays in place",async({page,browser})=>{
 test.setTimeout(120_000);
 const primary=await cardPrimary(`Freeze UI ${randomUUID().slice(0,8)}`),holder=await cardPerson("Taylor Sample");
 await enrollCardholder(primary.personId,primary.serviceId,holder);
 const {card}=await (async()=>{await fundCardGroup(primary.personId,primary.serviceId,"2400");return issuePracticeCard(primary.personId, primary.serviceId, holder, "Taylor daily card", undefined, "2400");})();
 const cardUrl=`${origin}/cardholder-services?card=${card.id}`;
 await signIn(page,primary.personId);
 await page.goto(cardUrl);
 const primaryDialog=page.getByRole("dialog");
 await primaryDialog.getByRole("button",{name:"Freeze",exact:true}).click();
 await primaryDialog.getByRole("button",{name:"Freeze card",exact:true}).click();
 await expect(primaryDialog.locator(".consumer-restriction-status")).toHaveText("Paused by the account owner.");
 const secondaryContext=await browser.newContext({viewport:page.viewportSize()??undefined});
 try{
  const secondaryPage=await secondaryContext.newPage();await signIn(secondaryPage,holder);
  await secondaryPage.goto(cardUrl);
  const dialog=secondaryPage.getByRole("dialog");
  await expect(dialog.getByRole("button",{name:"Unfreeze",exact:true})).toHaveCount(0);
  await expect(dialog.getByRole("button",{name:"Remove your freeze",exact:true})).toHaveCount(0);
  await dialog.getByRole("button",{name:"Add your freeze",exact:true}).click();
  await dialog.getByRole("button",{name:"Add your freeze",exact:true}).click();
  await expect(dialog.locator(".consumer-restriction-status")).toContainText("Paused by the person named on the card.");
  await dialog.getByRole("button",{name:"Remove your freeze",exact:true}).click();
  await expect(dialog).toContainText("will stay frozen");
  await dialog.getByRole("button",{name:"Remove your freeze",exact:true}).click();
  await expect(dialog.locator(".consumer-restriction-status")).toHaveText("Paused by the account owner.");
  await expect(dialog.getByRole("button",{name:"Unfreeze",exact:true})).toHaveCount(0);
  await secondaryPage.reload();
  await expect(dialog.locator(".consumer-restriction-status")).toHaveText("Paused by the account owner.");
  await dialog.getByText("Card control history",{exact:true}).click();
  await expect(dialog).toContainText("Unfreeze recorded");
  expect((await getWorkspace(holder,primary.serviceId)).cards[0]).toMatchObject({status:"FROZEN",canPurchase:false,freeze:{primary:true,holder:false}});
  await accessible(secondaryPage);
  await page.reload();
  await primaryDialog.getByRole("button",{name:"Unfreeze",exact:true}).click();
  await expect(primaryDialog).toContainText("all current freezes");
  await primaryDialog.getByRole("button",{name:"Unfreeze card",exact:true}).click();
  await expect(primaryDialog.locator(".consumer-restriction-status")).toHaveText("Manage new purchases while keeping past activity and balances visible.");
  await secondaryPage.reload();
  await expect(dialog.locator(".consumer-restriction-status")).toHaveText("Manage new purchases while keeping past activity and balances visible.");
  expect((await getWorkspace(holder,primary.serviceId)).cards[0]).toMatchObject({status:"ACTIVE",canPurchase:true,available:{minor:"2400"}});
 }finally{await secondaryContext.close();}
});

import {randomUUID} from "node:crypto";
import {mkdir} from "node:fs/promises";
import {eq} from "drizzle-orm";
import AxeBuilder from "@axe-core/playwright";
import {expect,test} from "@playwright/test";
import targets from "../../project-targets.json" with {type:"json"};
import {bindIdentity} from "../../src/modules/services/service";
import {SessionService} from "../../src/modules/identity/session";
import {sessionRepository} from "../../src/platform/database/session-repository";
import {closeDatabase,getDb} from "../../src/platform/database/client";
import {services} from "../../src/platform/database/schema";
import {sandboxParticipants} from "../../src/modules/sandbox/schema";

test.afterAll(closeDatabase);
test("first service choice survives an unknown setup result without opening financial services",async({page})=>{
 const identity=await bindIdentity(`${targets.netlify.canonical_origin}/.netlify/identity`,randomUUID());
 const sessions=new SessionService(sessionRepository,{appEnv:"test",publicOrigin:"http://127.0.0.1:3100"});
 const session=await sessions.issue(identity),pair=session.cookie.split(";",1)[0]!;
 await page.context().addCookies([{name:pair.slice(0,pair.indexOf("=")),value:pair.slice(pair.indexOf("=")+1),domain:"127.0.0.1",path:"/",httpOnly:true,sameSite:"Strict"}]);
 try{
  await page.goto("/services");
  await page.getByRole("radio",{name:"Merchant services",exact:true}).check();
  await page.getByRole("textbox",{name:"Your display name",exact:true}).fill("Journey merchant");
  await page.getByRole("checkbox").check();
  expect((await new AxeBuilder({page}).include("main").withTags(["wcag2a","wcag2aa","wcag21aa"]).analyze()).violations).toEqual([]);
  if(process.env.ETAIL_JOURNEY_SCREENSHOTS==="1"){await page.getByRole("textbox",{name:"Your display name",exact:true}).focus();await page.evaluate(()=>window.scrollTo({top:0,behavior:"instant"}));await expect(page.getByRole("link",{name:"Skip to main content",exact:true})).toHaveCount(1);await expect(page.getByRole("link",{name:"Skip to main content",exact:true})).not.toBeInViewport();await mkdir("artifacts/journey-refinement/after",{recursive:true});await page.screenshot({path:`artifacts/journey-refinement/after/welcome-${page.viewportSize()!.width}.png`,fullPage:true});}
  const bodies:unknown[]=[];
  await page.route("**/api/v1/sandbox",async route=>{
   if(route.request().method()!=="POST")return route.continue();
   bodies.push(route.request().postDataJSON());const response=await route.fetch();expect(response.status()).toBe(200);
   if(bodies.length===1)return route.abort("failed");await route.fulfill({response});
  });
  await page.getByRole("button",{name:"Continue to payments",exact:true}).click();
  await expect(page.getByRole("button",{name:"Retry sandbox setup",exact:true})).toBeEnabled();
  await expect(page.getByRole("textbox",{name:"Your display name",exact:true})).toBeDisabled();
  await expect(page.getByRole("radio",{name:"Cardholder services",exact:true})).toBeDisabled();
  await page.getByRole("button",{name:"Retry sandbox setup",exact:true}).click();
  await expect(page).toHaveURL(/\/merchant-services$/);
  await expect(page.getByRole("heading",{name:"Merchant overview",exact:true})).toBeVisible();
  expect(bodies).toHaveLength(2);expect(bodies[1]).toEqual(bodies[0]);
  expect(await getDb().select().from(sandboxParticipants).where(eq(sandboxParticipants.personId,identity.personId))).toHaveLength(1);
  expect(await getDb().select().from(services).where(eq(services.primaryPersonId,identity.personId))).toEqual([]);
  await expect(page.getByRole("complementary",{name:"Your sandbox member code",exact:true})).toHaveCount(0);
  await page.goto("/services");
  await expect(page.getByRole("heading",{name:"Your services",exact:true})).toBeVisible();
  await expect(page.getByRole("heading",{name:"Your member code",exact:true})).toHaveCount(0);
  await expect(page.getByRole("heading",{name:"Invitations",exact:true})).toHaveCount(0);
 }finally{await sessions.logout(pair);}
});

import {randomUUID} from "node:crypto";
import {eq} from "drizzle-orm";
import AxeBuilder from "@axe-core/playwright";
import {expect,test,type Page} from "@playwright/test";
import targets from "../../project-targets.json" with {type:"json"};
import {bindIdentity} from "../../src/modules/services/service";
import {SessionService} from "../../src/modules/identity/session";
import {sessionRepository} from "../../src/platform/database/session-repository";
import {closeDatabase,getDb} from "../../src/platform/database/client";
import {people,services} from "../../src/platform/database/schema";
import {sandboxParticipants} from "../../src/modules/sandbox/schema";
import {profileCommands} from "../../src/modules/identity/profile-schema";

async function useSession(page:Page,cookie:string){
  const pair=cookie.split(";",1)[0]!;
  await page.context().addCookies([{name:pair.slice(0,pair.indexOf("=")),value:pair.slice(pair.indexOf("=")+1),domain:"127.0.0.1",path:"/",httpOnly:true,sameSite:"Strict"}]);
}

test.afterAll(closeDatabase);
test("profile edit survives a lost response and client navigation without enrolling a service",async({page})=>{
  const identity=await bindIdentity(`${targets.netlify.canonical_origin}/.netlify/identity`,randomUUID(),"Profile owner");
  const sessions=new SessionService(sessionRepository,{appEnv:"test",publicOrigin:"http://127.0.0.1:3100"});
  const session=await sessions.issue(identity),pair=session.cookie.split(";",1)[0]!;
  await page.context().addCookies([{name:pair.slice(0,pair.indexOf("=")),value:pair.slice(pair.indexOf("=")+1),domain:"127.0.0.1",path:"/",httpOnly:true,sameSite:"Strict"}]);
  const bodies:unknown[]=[];
  try{
    await page.goto("/profile");
    await expect(page.getByRole("textbox",{name:"Display name",exact:true})).toHaveValue("Profile owner");
    await page.route("**/api/v1/profile",async route=>{
      if(route.request().method()!=="PUT")return route.continue();
      bodies.push(route.request().postDataJSON());const response=await route.fetch();expect(response.status()).toBe(200);
      if(bodies.length===1)return route.abort("failed");
      if(bodies.length===2)return route.fulfill({response,json:{...(await response.json()),commandId:randomUUID()}});
      await route.fulfill({response});
    });
    await page.getByRole("textbox",{name:"Display name",exact:true}).fill("Preferred alias");
    await page.getByRole("button",{name:"Save changes",exact:true}).click();
    await expect(page.getByRole("button",{name:"Retry save",exact:true})).toBeEnabled();
    await expect(page.getByRole("textbox",{name:"Display name",exact:true})).toBeDisabled();
    await page.getByRole("link",{name:"← Your dashboard",exact:true}).click();
    await expect(page).toHaveURL(/\/services$/);
    await page.getByLabel("Profile and help",{exact:true}).click();
    await page.getByRole("navigation",{name:"Your account",exact:true}).getByRole("link",{name:"Your profile",exact:true}).click();
    await expect(page.getByRole("button",{name:"Retry save",exact:true})).toBeEnabled();
    await page.getByRole("button",{name:"Retry save",exact:true}).click();
    await expect(page.locator("main").getByRole("alert")).toContainText("We couldn’t confirm the save");
    await expect(page.getByRole("textbox",{name:"Display name",exact:true})).toBeDisabled();
    await page.getByRole("button",{name:"Retry save",exact:true}).click();
    await expect(page.locator("main").getByRole("status")).toContainText("Your profile is updated");
    expect(bodies).toHaveLength(3);expect(bodies[1]).toEqual(bodies[0]);expect(bodies[2]).toEqual(bodies[0]);
    await page.reload();
    await expect(page.getByRole("region",{name:"Your details",exact:true})).toContainText("Preferred alias");
    expect((await getDb().select().from(people).where(eq(people.id,identity.personId)))[0]!.version).toBe(2);
    expect(await getDb().select().from(profileCommands).where(eq(profileCommands.personId,identity.personId))).toHaveLength(1);
    expect(await getDb().select().from(services).where(eq(services.primaryPersonId,identity.personId))).toEqual([]);
    expect(await getDb().select().from(sandboxParticipants).where(eq(sandboxParticipants.personId,identity.personId))).toEqual([]);
    await page.setViewportSize({width:320,height:900});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
    expect((await new AxeBuilder({page}).include("main").withTags(["wcag2a","wcag2aa","wcag21aa"]).analyze()).violations).toEqual([]);
  }finally{await sessions.logout(pair);}
});

test("a stale profile edit requires an exact fresh read before another change",async({page})=>{
  const identity=await bindIdentity(`${targets.netlify.canonical_origin}/.netlify/identity`,randomUUID(),"Original profile");
  const sessions=new SessionService(sessionRepository,{appEnv:"test",publicOrigin:"http://127.0.0.1:3100"});
  const session=await sessions.issue(identity),pair=session.cookie.split(";",1)[0]!;
  await page.context().addCookies([{name:pair.slice(0,pair.indexOf("=")),value:pair.slice(pair.indexOf("=")+1),domain:"127.0.0.1",path:"/",httpOnly:true,sameSite:"Strict"}]);
  try{
    await page.goto("/profile");
    const saved=await page.request.put("/api/v1/profile",{headers:{Origin:"http://127.0.0.1:3100"},data:{commandId:randomUUID(),expectedPersonId:identity.personId,expectedVersion:1,displayName:"Name from another tab"}});expect(saved.status()).toBe(200);
    await page.getByRole("textbox",{name:"Display name",exact:true}).fill("Older tab edit");
    await page.getByRole("button",{name:"Save changes",exact:true}).click();
    await expect(page.getByRole("button",{name:"Load latest details",exact:true})).toBeEnabled();
    await expect(page.getByRole("textbox",{name:"Display name",exact:true})).toBeDisabled();
    await page.route("**/api/v1/profile",async route=>{const response=await route.fetch();return route.fulfill({response,json:{...(await response.json()),personId:randomUUID()}});});
    await page.getByRole("button",{name:"Load latest details",exact:true}).click();
    await expect(page.locator("main").getByRole("alert")).toContainText("couldn’t confirm your latest profile");
    await expect(page.getByRole("textbox",{name:"Display name",exact:true})).toBeDisabled();
    await page.unroute("**/api/v1/profile");
    await page.getByRole("button",{name:"Load latest details",exact:true}).click();
    await expect(page.getByRole("textbox",{name:"Display name",exact:true})).toHaveValue("Name from another tab");
    await page.getByRole("textbox",{name:"Display name",exact:true}).fill("New reviewed name");
    await page.getByRole("button",{name:"Save changes",exact:true}).click();
    await expect(page.locator("main").getByRole("status")).toContainText("Your profile is updated");
    expect((await getDb().select().from(people).where(eq(people.id,identity.personId)))[0]!.version).toBe(3);
  }finally{await sessions.logout(pair);}
});

test("a profile editor cannot save to a newly signed-in person with the same version",async({page})=>{
  const issuer=`${targets.netlify.canonical_origin}/.netlify/identity`;
  const displayed=await bindIdentity(issuer,randomUUID(),"Displayed profile"),other=await bindIdentity(issuer,randomUUID(),"Other signed-in person");
  const sessions=new SessionService(sessionRepository,{appEnv:"test",publicOrigin:"http://127.0.0.1:3100"});
  const originalSession=await sessions.issue(displayed),otherSession=await sessions.issue(other);
  try{
    await useSession(page,originalSession.cookie);await page.goto("/profile");
    await expect(page.getByRole("textbox",{name:"Display name",exact:true})).toHaveValue("Displayed profile");
    await page.getByRole("textbox",{name:"Display name",exact:true}).fill("Only the displayed person");
    // An account switch in another tab changes the shared cookie, while this editor stays open.
    await useSession(page,otherSession.cookie);
    let verifiedDenial=false;
    await page.route("**/api/v1/profile",async route=>{
      if(route.request().method()!=="PUT"||verifiedDenial)return route.continue();
      // Read the real server rejection before forwarding it; the UI deliberately does not consume a denied body.
      const serverResponse=await route.fetch({timeout:10_000});
      expect(serverResponse.status()).toBe(403);
      expect(await serverResponse.json()).toMatchObject({error:{code:"PROFILE_PERSON_CHANGED"}});
      verifiedDenial=true;
      await route.fulfill({response:serverResponse});
    });
    const response=await test.step("Submit the displayed profile after the shared session changes",async()=>{
      const [denied]=await Promise.all([
        page.waitForResponse(value=>value.url().endsWith("/api/v1/profile")&&value.request().method()==="PUT",{timeout:10_000}),
        page.getByRole("button",{name:"Save changes",exact:true}).click(),
      ]);
      return denied;
    });
    expect(response.status()).toBe(403);expect(verifiedDenial).toBe(true);
    const originalAttempt=response.request().postDataJSON();
    expect(originalAttempt).toMatchObject({expectedPersonId:displayed.personId,expectedVersion:1,displayName:"Only the displayed person"});
    await expect(page.locator("main").getByRole("alert")).toContainText("Sign in again");
    await expect(page.getByRole("textbox",{name:"Display name",exact:true})).toBeDisabled();
    expect((await getDb().select().from(people).where(eq(people.id,other.personId)))[0]).toMatchObject({displayName:"Other signed-in person",version:1});
    expect((await getDb().select().from(people).where(eq(people.id,displayed.personId)))[0]).toMatchObject({displayName:"Displayed profile",version:1});
    expect(await getDb().select().from(profileCommands).where(eq(profileCommands.commandId,originalAttempt.commandId))).toHaveLength(0);
    // Restoring the intended session recovers the same command; the other person never receives it.
    await useSession(page,originalSession.cookie);
    await page.getByRole("link",{name:"← Your dashboard",exact:true}).click();
    await expect(page).toHaveURL(/\/services$/);
    await page.getByLabel("Profile and help",{exact:true}).click();
    await page.getByRole("navigation",{name:"Your account",exact:true}).getByRole("link",{name:"Your profile",exact:true}).click();
    await expect(page).toHaveURL(/\/profile$/);
    await expect(page.getByRole("region",{name:"Your details",exact:true})).toContainText("Displayed profile");
    await expect(page.getByRole("button",{name:"Retry save",exact:true})).toBeEnabled();
    const saved=await test.step("Retry the original profile edit after restoring its session",async()=>{
      const [recovered]=await Promise.all([
        page.waitForResponse(value=>value.url().endsWith("/api/v1/profile")&&value.request().method()==="PUT",{timeout:10_000}),
        page.getByRole("button",{name:"Retry save",exact:true}).click(),
      ]);
      return recovered;
    });
    expect(saved.status()).toBe(200);expect(saved.request().postDataJSON()).toEqual(originalAttempt);
    await expect(page.locator("main").getByRole("status")).toContainText("Your profile is updated");
    expect((await getDb().select().from(people).where(eq(people.id,other.personId)))[0]).toMatchObject({displayName:"Other signed-in person",version:1});
    expect(await getDb().select().from(profileCommands).where(eq(profileCommands.commandId,originalAttempt.commandId))).toHaveLength(1);
  }finally{await sessions.logout(originalSession.cookie.split(";",1)[0]!);await sessions.logout(otherSession.cookie.split(";",1)[0]!);}
});

test("a refreshed sign-in email keeps the same-version profile draft intact",async({page})=>{
  const issuer=`${targets.netlify.canonical_origin}/.netlify/identity`,subject=randomUUID();
  const identity=await bindIdentity(issuer,subject,"Stable profile name");
  const sessions=new SessionService(sessionRepository,{appEnv:"test",publicOrigin:"http://127.0.0.1:3100"});
  const originalSession=await sessions.issue(identity);let contactSession:Awaited<ReturnType<SessionService["issue"]>>|null=null;
  try{
    await useSession(page,originalSession.cookie);await page.goto("/profile?contact=before");
    const signIn=page.getByRole("region",{name:"Sign-in & security",exact:true});
    await expect(signIn).toContainText("No verified email is available for this sign-in.");
    await page.getByRole("textbox",{name:"Display name",exact:true}).fill("Unsubmitted preferred name");
    contactSession=await sessions.issue(identity,{issuer,subject,verifiedEmail:{emailNormalized:"refreshed-profile@example.test",verifiedAt:"2026-09-12T00:00:00.000Z",provenance:"NETLIFY_USER_CONFIRMED"}});
    // A same-page client navigation provides fresh server props without replacing the editor.
    await page.getByLabel("Profile and help",{exact:true}).click();
    await page.getByRole("navigation",{name:"Your account",exact:true}).getByRole("link",{name:"Your profile",exact:true}).click();
    await expect(page).toHaveURL(/\/profile$/);
    await expect(signIn).toContainText("refreshed-profile@example.test");
    await expect(signIn).toContainText("Verified");
    await expect(signIn.getByRole("textbox")).toHaveCount(0);
    await expect(page.getByRole("textbox",{name:"Display name",exact:true})).toHaveValue("Unsubmitted preferred name");
    await expect(page.getByRole("textbox",{name:"Display name",exact:true})).toBeEditable();
    expect((await getDb().select().from(people).where(eq(people.id,identity.personId)))[0]).toMatchObject({displayName:"Stable profile name",version:1});
    expect(await getDb().select().from(profileCommands).where(eq(profileCommands.personId,identity.personId))).toHaveLength(0);
  }finally{await sessions.logout(originalSession.cookie.split(";",1)[0]!);if(contactSession)await sessions.logout(contactSession.cookie.split(";",1)[0]!);}
});

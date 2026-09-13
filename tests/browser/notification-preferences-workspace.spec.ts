import {randomUUID} from "node:crypto";
import {and,eq} from "drizzle-orm";
import AxeBuilder from "@axe-core/playwright";
import {expect,test} from "@playwright/test";
import {closeDatabase,getDb} from "../../src/platform/database/client";
import {notificationPreferences,permissionGrants,services,workspaceCommands} from "../../src/platform/database/schema";
import {getNotificationPreferences,saveNotificationPreferences} from "../../src/modules/workspace/service";
import {notificationCommandSchema} from "../../src/modules/workspace/contracts";
import {notificationOverviewSchema} from "../../src/shared/notification-response";
import {cardPerson,cardPrimary,enrollCardholder} from "../helpers/cardholder";
import {signInPerson} from "./helpers/prepaid";

test.afterAll(closeDatabase);

test("account preferences keep an exact saved request through navigation, access loss and stale edits",async({page})=>{
  test.setTimeout(90_000);
  const owner=await cardPrimary(`Personal name ${randomUUID().slice(0,8)}`),accountName=`Travel card account ${randomUUID().slice(0,8)}`;
  await getDb().update(services).set({displayName:accountName}).where(eq(services.id,owner.serviceId));
  const holder=await cardPerson("Invited preference reader");await enrollCardholder(owner.personId,owner.serviceId,holder);
  const path=`/api/v1/cardholder-services/${owner.serviceId}/preferences/notifications`,settingsHref=`/cardholder-services/settings?context=${owner.serviceId}`;
  const attempts:unknown[]=[],readPaths:string[]=[];
  page.on("request",request=>{if(request.method()==="GET"&&new URL(request.url()).pathname.startsWith("/api/v1/"))readPaths.push(new URL(request.url()).pathname);});
  await signInPerson(page,owner.personId);await page.goto(settingsHref);
  const details=page.getByRole("region",{name:"Account details",exact:true}),preferences=page.getByRole("region",{name:"Notification preferences",exact:true});
  await expect(details.locator("dl>div").filter({has:page.getByText("Account name",{exact:true})}).locator("dd")).toHaveText(accountName);
  await expect(details.getByRole("textbox")).toHaveCount(0);
  await expect(page.getByRole("heading",{name:"Card account settings",exact:true})).toBeVisible();
  await expect(page.getByRole("link",{name:"Return unused money",exact:true})).toBeVisible();
  await expect(preferences).toContainText("Notification delivery is not available yet.");
  const activity=preferences.getByRole("checkbox",{name:/^Card activity/});
  await activity.uncheck();
  await page.route(`**${path}`,async route=>{
    if(route.request().method()!=="PUT"){await route.continue();return;}
    attempts.push(route.request().postDataJSON());const response=await route.fetch();
    if(attempts.length===1){expect(response.status()).toBe(200);await route.fulfill({status:200,json:{}});}
    else await route.fulfill({response});
  });
  await preferences.getByRole("button",{name:"Save preferences",exact:true}).click();
  const retry=preferences.getByRole("button",{name:"Retry saved preferences",exact:true});
  await expect(retry).toBeEnabled();await expect(activity).toBeDisabled();await expect(activity).not.toBeChecked();
  await expect(preferences.getByRole("button",{name:"Save preferences",exact:true})).toHaveCount(0);
  await preferences.getByRole("button",{name:"Check account access",exact:true}).click();
  await expect(retry).toBeEnabled();await expect(activity).not.toBeChecked();
  expect(readPaths).toContain(path);expect(readPaths.some(value=>value.endsWith("/workspace"))).toBe(false);
  const nav=page.getByRole("navigation",{name:"Cards and spending navigation",exact:true});
  await nav.getByRole("link",{name:"Account home",exact:true}).click();
  await expect(page.getByRole("region",{name:"Your card account",exact:true})).toContainText(accountName);
  await nav.getByRole("link",{name:"Account settings",exact:true}).click();
  await expect(retry).toBeEnabled();await expect(activity).toBeDisabled();expect(attempts).toHaveLength(1);
  const grant=and(eq(permissionGrants.personId,owner.personId),eq(permissionGrants.serviceId,owner.serviceId),eq(permissionGrants.action,"notifications.manage"));
  await getDb().update(permissionGrants).set({state:"REVOKED"}).where(grant);
  await retry.click();
  const unavailable=page.getByRole("region",{name:"Preferences unavailable",exact:true});
  await expect(unavailable).toBeVisible();await expect(details).toHaveCount(0);await expect(page.getByRole("checkbox")).toHaveCount(0);
  await unavailable.getByRole("button",{name:"Check account access",exact:true}).click();
  await expect(preferences).toBeVisible();await expect(activity).toBeDisabled();await expect(retry).toBeEnabled();
  await getDb().update(permissionGrants).set({state:"ACCEPTED"}).where(grant);
  await retry.click();await expect(preferences).toContainText("Your notification preferences are saved.");
  expect(attempts).toHaveLength(3);expect(attempts[1]).toEqual(attempts[0]);expect(attempts[2]).toEqual(attempts[0]);
  const original=notificationCommandSchema.parse(attempts[0]);
  expect(original.expectedPersonId).toBe(owner.personId);
  expect(await getDb().select().from(workspaceCommands).where(eq(workspaceCommands.commandId,original.commandId))).toHaveLength(1);
  expect((await getNotificationPreferences(owner.personId,owner.serviceId)).preferences).toMatchObject({version:2,serviceActivity:false});
  expect((await getNotificationPreferences(holder,owner.serviceId)).preferences).toMatchObject({version:1,serviceActivity:true});
  await saveNotificationPreferences(owner.personId,owner.serviceId,{commandId:randomUUID(),expectedPersonId:owner.personId,expectedVersion:2,serviceActivity:true,cardControls:true,caseUpdates:true});
  await preferences.getByRole("checkbox",{name:/^Card controls/}).uncheck();
  await preferences.getByRole("button",{name:"Save preferences",exact:true}).click();
  await expect(preferences.getByRole("button",{name:"Save preferences",exact:true})).toBeDisabled();
  await expect(preferences.getByRole("button",{name:"Retry saved preferences",exact:true})).toHaveCount(0);
  await preferences.getByRole("button",{name:"Reload saved preferences",exact:true}).click();
  await expect(activity).toBeChecked();await expect(preferences.getByRole("checkbox",{name:/^Card controls/})).toBeChecked();
  await expect(preferences.getByRole("button",{name:"Save preferences",exact:true})).toBeEnabled();
  const response=await page.request.get(path);expect(response.status()).toBe(200);
  expect(notificationOverviewSchema.parse(await response.json())).toMatchObject({personId:owner.personId,serviceId:owner.serviceId,preferences:{version:3}});
  expect(await getDb().select().from(notificationPreferences).where(and(eq(notificationPreferences.serviceId,owner.serviceId),eq(notificationPreferences.personId,owner.personId)))).toHaveLength(1);
  await page.setViewportSize({width:320,height:760});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true);
  expect((await new AxeBuilder({page}).include("main").withTags(["wcag2a","wcag2aa","wcag21aa"]).analyze()).violations).toEqual([]);
});

test("an invited cardholder changes only personal preferences in that card account",async({page})=>{
  const owner=await cardPrimary("Owner account settings"),other=await cardPrimary("Other account settings"),holder=await cardPerson("Private card preferences");
  await enrollCardholder(owner.personId,owner.serviceId,holder);await enrollCardholder(other.personId,other.serviceId,holder);
  await signInPerson(page,holder);await page.goto(`/cardholder-services/settings?context=${owner.serviceId}`);
  await expect(page.getByRole("heading",{name:"Your card preferences",exact:true})).toBeVisible();
  await expect(page.getByRole("region",{name:"Your card access",exact:true})).toContainText("Your assigned cards and their activity");
  await expect(page.getByRole("link",{name:"Return unused money",exact:true})).toHaveCount(0);
  await expect(page.getByRole("region",{name:"Card account balance",exact:true})).toHaveCount(0);
  const preferences=page.getByRole("region",{name:"Notification preferences",exact:true});
  await preferences.getByRole("checkbox",{name:/^Case updates/}).uncheck();
  await preferences.getByRole("button",{name:"Save preferences",exact:true}).click();
  await expect(preferences).toContainText("Your notification preferences are saved.");
  expect((await getNotificationPreferences(holder,owner.serviceId)).preferences.caseUpdates).toBe(false);
  expect((await getNotificationPreferences(holder,other.serviceId)).preferences.caseUpdates).toBe(true);
  expect((await getNotificationPreferences(owner.personId,owner.serviceId)).preferences.caseUpdates).toBe(true);
});

test("equal-version preferences cannot follow an account switch to another person in the same service",async({page})=>{
  const owner=await cardPrimary("Shared settings account"),displayed=await cardPerson("Displayed settings person"),current=await cardPerson("Current settings person");
  await enrollCardholder(owner.personId,owner.serviceId,displayed);await enrollCardholder(owner.personId,owner.serviceId,current);
  const path=`/api/v1/cardholder-services/${owner.serviceId}/preferences/notifications`;
  const attempts:unknown[]=[];
  await signInPerson(page,displayed);await page.goto(`/cardholder-services/settings?context=${owner.serviceId}&source=editor`);
  const preferences=page.getByRole("region",{name:"Notification preferences",exact:true}),activity=preferences.getByRole("checkbox",{name:/^Card activity/});
  await activity.uncheck();
  await page.route(`**${path}`,async route=>{
    if(route.request().method()!=="PUT")return route.continue();
    attempts.push(route.request().postDataJSON());
    // The first edit never reaches the server. Both people's saved versions remain equal.
    if(attempts.length===1)return route.abort("failed");
    await route.continue();
  });
  await preferences.getByRole("button",{name:"Save preferences",exact:true}).click();
  await expect(preferences.getByRole("button",{name:"Retry saved preferences",exact:true})).toBeEnabled();
  expect((await getNotificationPreferences(displayed,owner.serviceId)).preferences.version).toBe(1);
  expect((await getNotificationPreferences(current,owner.serviceId)).preferences.version).toBe(1);
  await signInPerson(page,current);
  const denial=page.waitForResponse(response=>response.url().endsWith(path)&&response.request().method()==="PUT");
  await preferences.getByRole("button",{name:"Retry saved preferences",exact:true}).click();
  const denied=await denial;expect(denied.status()).toBe(403);expect(await denied.json()).toMatchObject({error:{code:"PREFERENCES_PERSON_CHANGED"}});
  expect(attempts).toHaveLength(2);expect(attempts[1]).toEqual(attempts[0]);
  const original=notificationCommandSchema.parse(attempts[0]);expect(original.expectedPersonId).toBe(displayed);
  await expect(page.getByRole("region",{name:"Preferences unavailable",exact:true})).toBeVisible();
  expect((await getNotificationPreferences(current,owner.serviceId)).preferences).toMatchObject({version:1,serviceActivity:true});
  expect((await getNotificationPreferences(displayed,owner.serviceId)).preferences).toMatchObject({version:1,serviceActivity:true});
  expect(await getDb().select().from(workspaceCommands).where(eq(workspaceCommands.commandId,original.commandId))).toHaveLength(0);
  // Both invitees have the same service, role, capabilities and empty card list. A person change must still remount settings.
  const nav=page.getByRole("navigation",{name:"Cards and spending navigation",exact:true});
  await nav.getByRole("link",{name:"Preferences",exact:true}).click();
  await expect(page).toHaveURL(url=>url.pathname==="/cardholder-services/settings"&&url.searchParams.get("context")===owner.serviceId&&!url.searchParams.has("source"));
  await expect(preferences).toBeVisible();await expect(activity).toBeChecked();await expect(activity).toBeEnabled();
  await expect(page.getByRole("button",{name:"Retry saved preferences",exact:true})).toHaveCount(0);
  await expect(preferences.getByRole("button",{name:"Save preferences",exact:true})).toBeVisible();
  // Returning to the original person recovers only that person's original unconfirmed request.
  await signInPerson(page,displayed);await nav.getByRole("link",{name:"Account home",exact:true}).click();
  await nav.getByRole("link",{name:"Preferences",exact:true}).click();
  await expect(preferences.getByRole("button",{name:"Retry saved preferences",exact:true})).toBeEnabled();
  await expect(activity).not.toBeChecked();await expect(activity).toBeDisabled();
  await preferences.getByRole("button",{name:"Retry saved preferences",exact:true}).click();
  await expect(preferences).toContainText("Your notification preferences are saved.");
  expect(attempts).toHaveLength(3);expect(attempts[2]).toEqual(attempts[0]);
  expect((await getNotificationPreferences(displayed,owner.serviceId)).preferences).toMatchObject({version:2,serviceActivity:false});
  expect((await getNotificationPreferences(current,owner.serviceId)).preferences).toMatchObject({version:1,serviceActivity:true});
  expect(await getDb().select().from(workspaceCommands).where(eq(workspaceCommands.commandId,original.commandId))).toHaveLength(1);
});

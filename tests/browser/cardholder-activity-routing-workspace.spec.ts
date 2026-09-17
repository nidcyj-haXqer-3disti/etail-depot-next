import {fundCardGroup} from "../helpers/cardholder";
import {and,eq} from "drizzle-orm";
import {expect,test,type Page} from "@playwright/test";
import {closeDatabase,getDb} from "../../src/platform/database/client";
import {identityBindings} from "../../src/platform/database/schema";
import {SessionService} from "../../src/modules/identity";
import {sessionRepository} from "../../src/platform/database/session-repository";
import {cardPerson,cardPrimary,enrollCardholder,issuePracticeCard} from "../helpers/cardholder";
import {signInPerson} from "./helpers/prepaid";

test.afterAll(closeDatabase);

async function fixture(page:Page){
  const primary=await cardPrimary("Activity route primary"),holder=await cardPerson("Activity route secondary");
  await enrollCardholder(primary.personId,primary.serviceId,holder);
  const own=await (async()=>{await fundCardGroup(primary.personId,primary.serviceId,"2000");return issuePracticeCard(primary.personId, primary.serviceId, holder, "Shared activity card", "100", "1000");})();
  const foreign=await (async()=>{return issuePracticeCard(primary.personId, primary.serviceId, primary.personId, "Private activity card", "200", "1000");})();
  const [identity]=await getDb().select().from(identityBindings).where(and(eq(identityBindings.personId,holder),eq(identityBindings.issuer,"urn:etail:isolated-fixture")));
  if(!identity)throw new Error("Expected an isolated fictional identity");
  const session=await new SessionService(sessionRepository,{appEnv:"test",publicOrigin:"http://127.0.0.1:3100"}).issue({personId:holder,identityId:identity.id});
  const pair=session.cookie.split(";",1)[0]!;
  await page.context().addCookies([{name:pair.slice(0,pair.indexOf("=")),value:pair.slice(pair.indexOf("=")+1),domain:"127.0.0.1",path:"/",httpOnly:true,sameSite:"Strict",expires:Math.floor(session.record.expiresAt.getTime()/1000)}]);
  return {own,foreign,primary};
}

test("leaving card invitations opens the exact activity or a fresh Add card page without inherited invitation state",async({page})=>{
 const {own,primary}=await fixture(page);await signInPerson(page,primary.personId);
 const writes:string[]=[];page.on("request",request=>{if(request.method()==="POST")writes.push(new URL(request.url()).pathname);});
 await page.goto(`/cardholder-services/cards/${own.card.id}/invite`);
 const invitation=page.getByRole("dialog",{name:"Invite cardholder",exact:true});await expect(invitation).toBeVisible();
 await invitation.getByRole("button",{name:"Close Invite cardholder",exact:true}).click();
 const activity=page.getByRole("region",{name:"Recent activity",exact:true}).locator(`a[href*="transaction=${own.activity!.id}"]`);
 await activity.click();
 await expect(page).toHaveURL(url=>url.pathname===`/cardholder-services/cards/${own.card.id}`&&url.searchParams.get("transaction")===own.activity!.id&&!url.searchParams.has("invite"));
 await expect(page.getByRole("dialog",{name:"Transaction details",exact:true})).toContainText(own.activity!.title);
 await page.getByRole("button",{name:"Back to activity",exact:true}).click();
 await page.getByRole("link",{name:"Back to card list",exact:true}).click();
 await page.getByRole("link",{name:"Add card",exact:true}).click();
 await expect(page).toHaveURL(url=>url.pathname==="/cardholder-services/cards/new"&&!url.searchParams.has("invite")&&!url.searchParams.has("focus")&&!url.searchParams.has("transaction"));
 await expect(page.getByRole("dialog",{name:"Add card",exact:true})).toBeVisible();expect(writes).toEqual([]);
});

test("an older selected-card activity link opens the canonical activity view and exact transaction",async({page})=>{
  const {own,foreign}=await fixture(page);
  await page.goto(`/cardholder-services?activityCard=${own.card.id.toUpperCase()}&transaction=${own.activity!.id}`);
  await expect(page).toHaveURL(`/cardholder-services/cards/${own.card.id}/activity?transaction=${own.activity!.id}`);
  await expect(page.getByRole("heading",{name:"Activity",level:1,exact:true})).toBeVisible();
  await expect(page.getByRole("dialog",{name:"Transaction details",exact:true})).toContainText(own.activity!.title);
  await expect(page.locator("main")).not.toContainText(foreign.card.nickname);
  await page.reload();
  await expect(page.getByRole("dialog",{name:"Transaction details",exact:true})).toContainText(own.card.nickname);
  await page.getByRole("button",{name:"Back to activity",exact:true}).click();
  await expect(page.getByRole("combobox",{name:"Card",exact:true})).toHaveValue(own.card.id);
  // An explicit Cards selection still takes precedence over the older activity key.
  await page.goto(`/cardholder-services?view=cards&activityCard=${own.card.id}`);
  await expect(page.getByRole("heading",{name:"Card details",level:1,exact:true})).toBeVisible();
  await expect(page.getByRole("region",{name:"Selected card overview",exact:true})).toContainText(own.card.nickname);
  await expect(page.getByRole("navigation",{name:"Card ownership",exact:true})).toHaveCount(0);
  await expect(page.locator("main")).not.toContainText(foreign.card.nickname);
  expect(new URL(page.url()).pathname).toBe(`/cardholder-services/cards/${own.card.id}`);
  await page.getByRole("link",{name:"Back to card list",exact:true}).click();
  await expect(page).toHaveURL(url=>url.pathname==="/cardholder-services/cards"&&!url.searchParams.has("view")&&!url.searchParams.has("focus")&&!url.searchParams.has("activityCard"));
  await expect(page.getByRole("navigation",{name:"Card ownership",exact:true})).toHaveCount(0);
  await expect(page.getByRole("navigation",{name:"Card management",exact:true})).toHaveCount(0);
  await expect(page.getByRole("searchbox",{name:"Search cards",exact:true})).toBeVisible();
  await expect(page.getByRole("link",{name:new RegExp(`^Open ${own.card.nickname},`)})).toBeVisible();
  await expect(page.locator("main")).not.toContainText(foreign.card.nickname);
});

test("older activity links preserve unavailable and duplicate selection handling without falling back to another card",async({page})=>{
  const {own,foreign}=await fixture(page);
  for(const {query,pathname,title} of [
    {query:`activityCard=${foreign.card.id}`,pathname:`/cardholder-services/cards/${foreign.card.id}/activity`,title:"This card view is unavailable"},
    {query:"activityCard=invalid",pathname:"/cardholder-services",title:"This card page is unavailable"},
    {query:`activityCard=${own.card.id}&activityCard=${own.card.id}`,pathname:"/cardholder-services",title:"This card page is unavailable"},
    {query:`activityCard=${own.card.id}&focus=${foreign.card.id}`,pathname:"/cardholder-services",title:"This card page is unavailable"},
    {query:`activityCard=${own.card.id}&transaction=${foreign.activity!.id}`,pathname:`/cardholder-services/cards/${own.card.id}/activity`,title:"This card view is unavailable"},
  ]){
    await page.goto(`/cardholder-services?${query}`);
    await expect(page.getByRole("heading",{name:title,exact:true})).toBeVisible();
    expect(new URL(page.url()).pathname).toBe(pathname);
    await expect(page.getByRole("region",{name:"Card activity",exact:true})).toHaveCount(0);
    await expect(page.locator("main")).not.toContainText(foreign.card.nickname);
    await expect(page.locator("main")).not.toContainText(own.activity!.title);
  }
});

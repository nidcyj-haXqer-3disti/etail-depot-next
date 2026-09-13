import {fundCardGroup} from "../helpers/cardholder";
import {and,eq} from "drizzle-orm";
import {expect,test,type Page} from "@playwright/test";
import {closeDatabase,getDb} from "../../src/platform/database/client";
import {identityBindings} from "../../src/platform/database/schema";
import {SessionService} from "../../src/modules/identity";
import {sessionRepository} from "../../src/platform/database/session-repository";
import {cardPerson,cardPrimary,enrollCardholder,issuePracticeCard} from "../helpers/cardholder";

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
  return {own,foreign};
}

test("an older selected-card activity link opens the canonical activity view and exact transaction",async({page})=>{
  const {own,foreign}=await fixture(page);
  await page.goto(`/cardholder-services?activityCard=${own.card.id.toUpperCase()}&transaction=${own.activity!.id}`);
  await expect(page).toHaveURL(`/cardholder-services/activity?focus=${own.card.id}&transaction=${own.activity!.id}`);
  await expect(page.getByRole("heading",{name:"Card activity",exact:true})).toBeVisible();
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
  expect(new URL(page.url()).pathname).toBe("/cardholder-services");
  await page.getByRole("link",{name:"Back to card list",exact:true}).click();
  await expect(page).toHaveURL(url=>url.pathname==="/cardholder-services"&&url.searchParams.get("view")==="cards"&&!url.searchParams.has("focus")&&!url.searchParams.has("activityCard"));
  await expect(page.getByRole("navigation",{name:"Card ownership",exact:true})).toHaveCount(0);
  await expect(page.getByRole("navigation",{name:"Card management",exact:true})).toHaveCount(0);
  await expect(page.getByRole("searchbox",{name:"Search your cards",exact:true})).toBeVisible();
  await expect(page.getByRole("link",{name:new RegExp(`^Open ${own.card.nickname},`)})).toBeVisible();
  await expect(page.locator("main")).not.toContainText(foreign.card.nickname);
});

test("older activity links preserve unavailable and duplicate selection handling without falling back to another card",async({page})=>{
  const {own,foreign}=await fixture(page);
  for(const query of [
    `activityCard=${foreign.card.id}`,
    "activityCard=invalid",
    `activityCard=${own.card.id}&activityCard=${own.card.id}`,
    `activityCard=${own.card.id}&focus=${foreign.card.id}`,
    `activityCard=${own.card.id}&transaction=${foreign.activity!.id}`,
  ]){
    await page.goto(`/cardholder-services?${query}`);
    await expect(page.getByRole("heading",{name:"This card view is unavailable",exact:true})).toBeVisible();
    expect(new URL(page.url()).pathname).toBe("/cardholder-services/activity");
    await expect(page.getByRole("heading",{name:"Card activity",exact:true})).toHaveCount(0);
    await expect(page.locator("main")).not.toContainText(foreign.card.nickname);
    await expect(page.locator("main")).not.toContainText(own.activity!.title);
  }
});

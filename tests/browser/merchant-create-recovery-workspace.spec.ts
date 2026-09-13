import {randomUUID} from "node:crypto";
import {expect,test} from "@playwright/test";
import {merchantDashboard} from "./helpers/fresh";
import {acquiringFixture,acquiringPerson} from "../helpers/acquiring";
import {signInPerson} from "./helpers/prepaid";

for(const kind of ["merchant","terminal"] as const){
 test(`an unconfirmed ${kind} creation retains one request and permits an explained exit after access denial`,async({page})=>{
  test.setTimeout(90_000);
  const primary=kind==="terminal"?await acquiringFixture():null;
  const person=primary??await acquiringPerson();await signInPerson(page,person.personId);
  const name=`Private ${kind} request ${randomUUID().slice(0,8)}`;
  await page.goto(`/merchant-services?section=merchants${primary?`&view=merchant:${primary.serviceId}`:""}`);
  await page.getByRole(primary?"link":"button",{name:primary?"Create terminal":"Add your business",exact:true}).click();
  const edit=page.getByRole("dialog",{name:primary?"Create terminal":"Name your business",exact:true});
  if(primary)await edit.getByRole("radio",{name:/^For someone else/}).check();
  await edit.getByRole("textbox",{name:primary?"Payment terminal name":"Business name",exact:true}).fill(name);
  await expect(edit.getByRole("button",{name:"Review merchant",exact:true})).toHaveCount(0);
  await expect(edit).toContainText(primary?"You control the payment balance":"You control the payment balance, refunds and who can collect payments");
  expect((await merchantDashboard(page.request)).units.filter(unit=>unit.name===name)).toEqual([]);
  const path=primary?`/api/v1/merchants/${primary.serviceId}/terminals`:"/api/v1/merchants",requests:unknown[]=[];
  await page.route(`**${path}`,async route=>{
   if(route.request().method()!=="POST"){await route.continue();return;}
   requests.push(route.request().postDataJSON());
   if(requests.length===1){const saved=await route.fetch();expect(saved.status()).toBe(200);await route.abort("failed");}
   else await route.fulfill({status:primary?404:403,json:{error:{code:"ACTION_DENIED"}}});
  });
  await edit.getByRole("button",{name:primary?"Create terminal":"Add your business",exact:true}).click();
  await expect(edit.getByRole("button",{name:"Check request again",exact:true})).toBeVisible();
  await expect(edit.getByRole("textbox",{name:primary?"Payment terminal name":"Business name",exact:true})).toBeDisabled();
  await expect(page.getByRole("button",{name:"Leave for now",exact:true})).toHaveCount(0);
  await expect(page.locator(".mn-navigation-boundary")).toHaveAttribute("data-pending","true");
  const before=page.url();await page.locator("header a[href]").first().dispatchEvent("click");expect(page.url()).toBe(before);
  await edit.getByRole("button",{name:"Check request again",exact:true}).click();
  const recovery=page.getByRole("dialog",{name:"We couldn’t confirm this request",exact:true});
  await expect(recovery.getByRole("button",{name:"Leave for now",exact:true})).toBeEnabled();
  await expect(recovery).toContainText("Leaving this page does not cancel the request.");
  await expect(recovery).not.toContainText(name);
  await expect(recovery.getByRole("textbox")).toHaveCount(0);
  await recovery.getByRole("button",{name:"Check request again",exact:true}).click();
  await expect(recovery.getByRole("button",{name:"Leave for now",exact:true})).toBeEnabled();
  expect(requests).toHaveLength(3);expect(requests[1]).toEqual(requests[0]);expect(requests[2]).toEqual(requests[0]);
  const saved=(await merchantDashboard(page.request)).units.filter(unit=>unit.name===name);
  expect(saved).toHaveLength(1);expect(saved[0].ownerAccess).toBe(true);
  if(primary){expect(saved[0].merchantServiceId).toBe(primary.serviceId);expect(saved[0]).toMatchObject({intendedUse:"OTHER",forOthers:true});}
  await recovery.getByRole("button",{name:"Leave for now",exact:true}).click();
  await expect(page).toHaveURL(url=>url.pathname==="/services");
  await expect(recovery).toBeHidden();
  await expect(page.getByRole("heading",{name:"Your dashboard",exact:true})).toBeVisible();
  await expect(page.locator(".mn-navigation-boundary[data-pending]")).toHaveCount(0);
 });
}

test("a terminal created for someone else stays in For others before an invitation is sent",async({page})=>{
 const merchant=await acquiringFixture();await signInPerson(page,merchant.personId);
 const before=(await merchantDashboard(page.request)).moneyAccounts;
 await page.goto(`/merchant-services?section=merchants&view=merchant:${merchant.serviceId}`);
 await page.getByRole("link",{name:"Create terminal",exact:true}).click();
 await expect(page).toHaveURL(url=>url.pathname===`/merchant-services/${merchant.serviceId}/terminals/new`);
 await page.reload();
 const create=page.getByRole("dialog",{name:"Create terminal",exact:true});
 await expect(create.getByRole("radio",{name:/^For someone else/})).toBeChecked();
 const name=`Shared terminal ${randomUUID().slice(0,8)}`;
 await create.getByRole("textbox",{name:"Payment terminal name",exact:true}).fill(name);
 await create.getByRole("button",{name:"Create terminal",exact:true}).click();
 const invite=page.getByRole("dialog",{name:"Invite a person",exact:true});
 await expect(invite).toBeVisible();await expect(invite.getByRole("textbox",{name:"Recipient email",exact:true})).toHaveValue("");
 const terminal=(await merchantDashboard(page.request)).units.find(row=>row.name===name)!;
 expect(new URL(page.url()).pathname).toBe(`/merchant-services/terminals/${terminal.id}/people`);
 await page.keyboard.press("Escape");await expect(invite).toBeHidden();
 await page.getByRole("navigation",{name:"Merchant account navigation",exact:true}).getByRole("link",{name:"Terminals",exact:true}).click();
 await page.getByRole("navigation",{name:"Terminal use",exact:true}).getByRole("link",{name:"For others",exact:true}).click();
 await page.reload();await expect(page.getByRole("link",{name,exact:true})).toBeVisible();
 await page.getByRole("navigation",{name:"Terminal use",exact:true}).getByRole("link",{name:"For your use",exact:true}).click();
 await expect(page.getByRole("link",{name,exact:true})).toHaveCount(0);
 const after=await merchantDashboard(page.request);expect(after.moneyAccounts).toEqual(before);
 expect(after.units.filter(row=>row.id===terminal.id)).toHaveLength(1);
 const access=await page.request.get(`/api/v1/merchants/${terminal.id}/access`);expect(access.status()).toBe(200);
 const saved=await access.json();expect(saved.people).toEqual([]);expect(saved.invitations).toEqual([]);
});

test("a mismatched created terminal name or use cannot redirect or discard the original request",async({page})=>{
 const merchant=await acquiringFixture();await signInPerson(page,merchant.personId);
 const name=`Exact terminal ${randomUUID().slice(0,8)}`,requests:unknown[]=[];
 await page.goto(`/merchant-services?section=merchants&view=merchant:${merchant.serviceId}`);
 await page.getByRole("link",{name:"Create terminal",exact:true}).click();
 const dialog=page.getByRole("dialog",{name:"Create terminal",exact:true});
 await dialog.getByRole("textbox",{name:"Payment terminal name",exact:true}).fill(name);
 await page.route(`**/api/v1/merchants/${merchant.serviceId}/terminals`,async route=>{
  if(route.request().method()!=="POST"){await route.continue();return;}
  requests.push(route.request().postDataJSON());
  const response=await route.fetch();expect(response.status()).toBe(200);
  const result=await response.json();
  await route.fulfill({status:200,json:requests.length===1?{...result,intendedUse:"SELF"}:requests.length===2?{...result,displayName:"A different terminal"}:result});
 });
 await dialog.getByRole("button",{name:"Create terminal",exact:true}).click();
 await expect(dialog.getByRole("button",{name:"Check request again",exact:true})).toBeVisible();
 await expect(page).toHaveURL(url=>url.pathname===`/merchant-services/${merchant.serviceId}/terminals/new`);
 await expect(dialog.getByRole("textbox",{name:"Payment terminal name",exact:true})).toHaveValue(name);
 await expect(dialog.getByRole("radio",{name:/^For someone else/})).toBeChecked();
 await dialog.getByRole("button",{name:"Check request again",exact:true}).click();
 await expect(dialog.getByRole("button",{name:"Check request again",exact:true})).toBeVisible();
 await expect(page).toHaveURL(url=>url.pathname===`/merchant-services/${merchant.serviceId}/terminals/new`);
 await dialog.getByRole("button",{name:"Check request again",exact:true}).click();
 await expect(page.getByRole("dialog",{name:"Invite a person",exact:true})).toBeVisible();
 expect(requests).toHaveLength(3);expect(requests[1]).toEqual(requests[0]);expect(requests[2]).toEqual(requests[0]);
 const saved=(await merchantDashboard(page.request)).units.filter(row=>row.name===name);
 expect(saved).toHaveLength(1);expect(saved[0]).toMatchObject({intendedUse:"OTHER",forOthers:true});
 expect(new URL(page.url()).pathname).toBe(`/merchant-services/terminals/${saved[0].id}/people`);
});


test("the exact business terminal creation route reloads, cancels and follows browser Back without creating records",async({page})=>{
 const merchant=await acquiringFixture();await signInPerson(page,merchant.personId);
 const before=(await merchantDashboard(page.request)).units.map(unit=>unit.id);
 const directory=`/merchant-services/terminals?view=merchant%3A${merchant.serviceId}`;
 await page.goto(directory);await page.getByRole("link",{name:"Create terminal",exact:true}).click();
 const dialog=page.getByRole("dialog",{name:"Create terminal",exact:true});
 await expect(dialog).toBeVisible();await expect(page).toHaveURL(url=>url.pathname===`/merchant-services/${merchant.serviceId}/terminals/new`);
 await page.reload();await expect(dialog).toBeVisible();await dialog.getByRole("button",{name:"Cancel",exact:true}).click();
 await expect(dialog).toBeHidden();await expect(page).toHaveURL(url=>url.pathname==="/merchant-services/terminals"&&url.searchParams.get("view")===`merchant:${merchant.serviceId}`);
 await page.getByRole("link",{name:"Create terminal",exact:true}).click();await expect(dialog).toBeVisible();await page.goBack();await expect(dialog).toBeHidden();
 expect((await merchantDashboard(page.request)).units.map(unit=>unit.id)).toEqual(before);
});

import {randomUUID} from "node:crypto";
import {and,eq} from "drizzle-orm";
import AxeBuilder from "@axe-core/playwright";
import {expect,test} from "@playwright/test";
import {closeDatabase,getDb} from "../../src/platform/database/client";
import {permissionGrants} from "../../src/platform/database/schema";
import {merchantTestPayments} from "../../src/modules/acquiring/operations-schema";
import {getWorkspace} from "../../src/modules/workspace/service";
import {cardCheckoutReviewSchema} from "../../src/modules/acquiring/card-checkout-contracts";
import {freshPrepaidCard,freshPublishedPayment,openSavedCardReview,signInPerson} from "./helpers/prepaid";

test.afterAll(closeDatabase);

for(const phase of ["review","payment"] as const)test(`lost checkout ${phase} survives later access denial and restores the exact saved request`,async({page})=>{
 test.setTimeout(90_000);
 const {primary,card}=await freshPrepaidCard("900");
 const merchant=await freshPublishedPayment("325",`Recovery order ${randomUUID().slice(0,8)}`);
 await signInPerson(page,primary.personId);
 let path=`/api/v1/checkout/${merchant.publication.id}/card`;
 if(phase==="payment")path=(await openSavedCardReview(page,merchant.publication.id,card.id)).confirmPath;
 else{
  await page.goto(`/checkout/${merchant.publication.id}/card`);
  await page.getByRole("combobox",{name:"Your card",exact:true}).selectOption(card.id);
 }
 const attempts:Array<{path:string;body:unknown}>=[],statuses:number[]=[];
 await page.route(`**${path}`,async route=>{
  if(route.request().method()!=="POST"){await route.continue();return;}
  attempts.push({path:new URL(route.request().url()).pathname,body:route.request().postDataJSON()});
  const response=await route.fetch();statuses.push(response.status());
  if(attempts.length===1){
   expect(response.status()).toBe(200);
   // Save the real operation, then lose a valid response: malformed review JSON
   // and a dropped payment transport both require exact retry identity.
   if(phase==="review")await route.fulfill({status:200,contentType:"application/json",body:""});
   else await route.abort("connectionfailed");
  }else await route.fulfill({response});
 });
 await page.getByRole("button",{name:phase==="review"?"Review payment":"Pay $3.25",exact:true}).click();
 await expect(page.getByRole("button",{name:phase==="review"?"Retry saved review":"Retry saved payment",exact:true})).toBeEnabled();
 await expect(page.getByRole("link",{name:"Reload cards and choose again",exact:true})).toHaveCount(0);
 if(phase==="review")await expect(page.getByRole("combobox",{name:"Your card",exact:true})).toBeDisabled();
 await getDb().update(permissionGrants).set({state:"REVOKED"}).where(and(eq(permissionGrants.serviceId,primary.serviceId),eq(permissionGrants.personId,primary.personId),eq(permissionGrants.action,"cards.read")));
 await page.getByRole("button",{name:phase==="review"?"Retry saved review":"Retry saved payment",exact:true}).click();
 await expect.poll(()=>statuses.length).toBe(2);expect(statuses[1]).toBe(403);
 await expect(page.getByRole("heading",{name:"Card access unavailable",exact:true})).toBeVisible();
 await expect(page.locator("main")).not.toContainText(card.nickname);
 await expect(page.locator("main")).not.toContainText(card.lastFour);
 await expect(page.getByRole("combobox",{name:"Your card",exact:true})).toHaveCount(0);
 await expect(page.getByRole("link",{name:"Reload cards and choose again",exact:true})).toHaveCount(0);
 const retry=page.getByRole("button",{name:"Retry saved request",exact:true});await expect(retry).toBeEnabled();
 const viewport=page.viewportSize();await page.setViewportSize({width:320,height:568});
 expect((await new AxeBuilder({page}).include("main").withTags(["wcag2a","wcag2aa","wcag21aa"]).analyze()).violations).toEqual([]);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true);
 if(viewport)await page.setViewportSize(viewport);
 await getDb().update(permissionGrants).set({state:"ACCEPTED"}).where(and(eq(permissionGrants.serviceId,primary.serviceId),eq(permissionGrants.personId,primary.personId),eq(permissionGrants.action,"cards.read")));
 await retry.click();
 if(phase==="review"){
  await expect(page.getByRole("heading",{name:"Review your payment",exact:true})).toBeVisible();
  await page.getByRole("button",{name:"Pay $3.25",exact:true}).click();
 }
 await expect(page.getByRole("heading",{name:"Payment complete",exact:true})).toBeVisible();
 expect(statuses).toEqual([200,403,200]);expect(attempts[1]).toEqual(attempts[0]);expect(attempts[2]).toEqual(attempts[0]);
 const savedUrl=page.url(),reviewId=new URL(savedUrl).searchParams.get("review");expect(reviewId).not.toBeNull();
 const response=await page.request.get(`/api/v1/checkout/${merchant.publication.id}/card/${reviewId}`);expect(response.status()).toBe(200);
 const saved=cardCheckoutReviewSchema.parse(await response.json());expect(saved.receipt).not.toBeNull();
 await expect(page.locator("main")).toContainText(saved.receipt!.reference);
 await page.reload();await expect(page.getByRole("heading",{name:"Payment complete",exact:true})).toBeVisible();
 await expect(page.locator("main")).toContainText(saved.receipt!.reference);expect(page.url()).toBe(savedUrl);
 const workspace=await getWorkspace(primary.personId,primary.serviceId);
 expect(workspace.cards.find(row=>row.id===card.id)?.available.minor).toBe("575");
 expect(workspace.activity.filter(row=>row.cardId===card.id&&row.direction==="DEBIT")).toHaveLength(1);
 expect(await getDb().select().from(merchantTestPayments).where(eq(merchantTestPayments.cardCheckoutId,saved.id))).toHaveLength(1);
});

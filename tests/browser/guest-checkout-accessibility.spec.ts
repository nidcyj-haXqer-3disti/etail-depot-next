import AxeBuilder from "@axe-core/playwright";
import {expect,test,type Page} from "@playwright/test";
import {closeDatabase} from "../../src/platform/database/client";
import {controlCard} from "../../src/modules/workspace/service";
import {randomUUID} from "node:crypto";
import {freshPrepaidCard,freshPublishedPayment,signInPerson,openSavedCardReview} from "./helpers/prepaid";
test.afterAll(closeDatabase);
async function accessible(page:Page){const result=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21aa","wcag22aa"]).analyze();expect(result.violations.map(({id,nodes})=>({id,nodes:nodes.map(node=>node.target)}))).toEqual([]);expect(await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-window.innerWidth)).toBeLessThanOrEqual(1);}
for(const width of [1440,320])test(`offer, real card review, freeze refusal and saved receipt are accessible at ${width}px`,async({page})=>{
 test.setTimeout(90_000);await page.setViewportSize({width,height:900});
 const merchant=await freshPublishedPayment("500"),payer=await freshPrepaidCard("1000");await signInPerson(page,payer.primary.personId);
 await page.goto(merchant.publication.publicHref);await expect(page.getByRole("link",{name:"Choose a card",exact:true})).toBeVisible();await accessible(page);
 await openSavedCardReview(page,merchant.publication.id,payer.card.id);await accessible(page);
 await controlCard(payer.primary.personId,payer.primary.serviceId,payer.card.id,{commandId:randomUUID(),expectedVersion:payer.card.version,action:"freeze"});
 await page.getByRole("button",{name:"Pay $5.00",exact:true}).click();await expect(page.getByRole("alert")).toBeVisible();await accessible(page);
 // The declined command created no debit; a fresh review uses the restored current version.
 await controlCard(payer.primary.personId,payer.primary.serviceId,payer.card.id,{commandId:randomUUID(),expectedVersion:payer.card.version+1,action:"unfreeze"});
 await openSavedCardReview(page,merchant.publication.id,payer.card.id);await page.getByRole("button",{name:"Pay $5.00",exact:true}).click();await expect(page.getByRole("heading",{name:"Payment complete",exact:true})).toBeVisible();await accessible(page);
 await page.reload();await expect(page.getByRole("heading",{name:"Payment complete",exact:true})).toBeVisible();await accessible(page);
});

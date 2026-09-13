import {randomUUID} from "node:crypto";
import {expect,test} from "@playwright/test";
import {cardDashboard,headers,merchantDashboard} from "./helpers/fresh";
import {acquiringFixture} from "../helpers/acquiring";
import {freshConnectedPayment,merchantOperations} from "./helpers/merchant-payments";
import {eq} from "drizzle-orm";
import {closeDatabase,getDb} from "../../src/platform/database/client";
import {ledgerEntries} from "../../src/modules/ledger/schema";
import {operatorServiceAccess} from "../../src/modules/operations/schema";
import {cardPerson,enrollCardholder,issuePracticeCard} from "../helpers/cardholder";
import {freshPrepaidCard,signInPerson} from "./helpers/prepaid";
test.afterAll(closeDatabase);

test("selected card keeps balance, activity and reversible controls together",async({page})=>{
 const {primary,card}=await freshPrepaidCard();await signInPerson(page,primary.personId);await page.goto(`/cardholder-services?focus=${card.id}`);const overview=page.getByRole("region",{name:"Selected card overview"});
 await expect(overview).toContainText(card.available.formatted);await expect(overview).toContainText(card.nickname);
 const first=card.status==="FROZEN"?"Unfreeze":"Freeze",second=first==="Freeze"?"Unfreeze":"Freeze";
 for(const action of [first,second]){await overview.getByRole("button",{name:`${action} card`,exact:true}).click();const dialog=page.getByRole("dialog");await expect(dialog.getByRole("heading",{name:`${action} card?`,exact:true})).toBeVisible();await dialog.getByRole("button",{name:`${action} card`,exact:true}).click();await expect(dialog.getByRole("button",{name:action==="Freeze"?"Unfreeze":"Freeze",exact:true})).toBeVisible();await page.keyboard.press("Escape");await expect(dialog).toHaveCount(0);}
 expect((await cardDashboard(page.request)).cards.find(row=>row.id===card.id)!.available.minor).toBe(card.available.minor);
 await page.getByRole("region",{name:"Recent activity",exact:true}).getByRole("link",{name:"View activity",exact:true}).click();await expect(page).toHaveURL(new RegExp(`/cardholder-services/activity\\?focus=${card.id}`));await expect(page.locator("main")).not.toContainText(/Household|Seller account|Personal account/);
});

test("primary issues a named card through one review without adding money or changing their shared limit",async({page})=>{
 const {primary}=await freshPrepaidCard();await signInPerson(page,primary.personId);const data=await cardDashboard(page.request);
 const before=await getDb().select().from(ledgerEntries).where(eq(ledgerEntries.serviceId,primary.serviceId)).orderBy(ledgerEntries.journalId,ledgerEntries.lineNumber);
 const name=`Travel ${randomUUID().slice(0,8)}`;await page.goto("/cardholder-services");await page.getByRole("navigation",{name:"Cards and spending navigation"}).getByRole("link",{name:"Cards",exact:true}).click();await page.getByRole("link",{name:"Add card",exact:true}).click();
 const dialog=page.getByRole("dialog");await expect(dialog.getByRole("heading",{name:"Create a card"})).toBeVisible();const holderChoice=dialog.getByRole("radio",{name:new RegExp(data.person.displayName)});if(await holderChoice.count())await holderChoice.check();
 await expect(dialog.getByRole("textbox",{name:"Starting balance (USD)"})).toHaveCount(0);
 await dialog.getByRole("textbox",{name:"Card name",exact:true}).fill(name);await dialog.getByRole("textbox",{name:"Total spending limit (USD)",exact:true}).fill("25.00");await dialog.getByRole("button",{name:"Review card",exact:true}).click();
 await expect(dialog).toContainText("Review your card");await expect(dialog).toContainText(name);
 await dialog.getByRole("button",{name:"Create card",exact:true}).click();await expect(dialog).toHaveCount(0);
 await expect(page.getByRole("region",{name:"Selected card overview",exact:true})).toContainText(name);
 const directory=await cardDashboard(page.request),created=directory.cards.filter(row=>row.nickname===name);expect(created).toHaveLength(1);
 expect(created[0]).toMatchObject({available:{minor:"2500"},spending:{allowance:{minor:"2500"},used:{minor:"0"}}});
 expect(new URL(page.url()).searchParams.get("focus")).toBe(created[0]!.id);
 expect(await getDb().select().from(ledgerEntries).where(eq(ledgerEntries.serviceId,primary.serviceId)).orderBy(ledgerEntries.journalId,ledgerEntries.lineNumber)).toEqual(before);
});

test("secondary sees only assigned cards and reports and cannot open a guessed primary card",async({page})=>{
 const {primary,card:foreign}=await freshPrepaidCard();const secondary=await cardPerson(`Secondary ${randomUUID().slice(0,8)}`);
 await enrollCardholder(primary.personId,primary.serviceId,secondary);
 const {card}=await issuePracticeCard(primary.personId, primary.serviceId, secondary, "Secondary reporting card", undefined, "2000");await signInPerson(page,secondary);await page.goto(`/cardholder-services?focus=${card.id}`);
 await expect(page.getByLabel("Selected card").locator("option[value]:not([value=''])")).toHaveCount(1);await expect(page.getByRole("link",{name:"Add card",exact:true})).toHaveCount(0);await expect(page.getByRole("link",{name:"People",exact:true})).toHaveCount(0);
 await page.getByRole("region",{name:"Selected card overview",exact:true}).getByRole("link",{name:"Card settings",exact:true}).click();
 await page.getByRole("dialog").getByRole("link",{name:"Statements & reports",exact:true}).click();await expect(page).toHaveURL(new RegExp(`reports\\?focus=${card.id}`));await expect(page.locator("main")).not.toContainText(foreign.nickname);
 const download=page.waitForEvent("download");await page.getByRole("button",{name:"Download CSV"}).click();expect((await download).suggestedFilename()).toMatch(/^etail-card-activity-/);
 await page.goto(`/cardholder-services?focus=${foreign.id}`);await expect(page.getByRole("heading",{name:"This card is unavailable",exact:true})).toBeVisible();await expect(page.getByRole("region",{name:"Selected card overview"})).toHaveCount(0);
});

test("merchant payment filters survive refresh and receipt links reopen the exact connected record",async({page})=>{
 test.setTimeout(90_000);
 const {merchant,payment}=await freshConnectedPayment(page),unit=merchant.unit;
 await page.goto(`/merchants/${unit.id}?tab=payments`);await page.getByRole("searchbox",{name:"Search payments"}).fill(payment.testReference);await expect(page.getByRole("table")).toContainText(payment.testReference);await page.getByLabel("Payment status").selectOption(payment.status);await page.reload();await expect(page.getByRole("searchbox",{name:"Search payments"})).toHaveValue(payment.testReference);await expect(page.getByLabel("Payment status")).toHaveValue(payment.status);
 await page.getByRole("button",{name:new RegExp(`View .*${payment.testReference}`)}).click();await expect(page.getByRole("dialog",{name:"Payment details",exact:true})).toContainText(payment.testReference);const exact=page.url();expect(new URL(exact).searchParams.get("payment")).toBe(payment.id);await page.reload();await expect(page.getByRole("dialog",{name:"Payment details",exact:true})).toContainText(payment.testReference);await page.getByRole("button",{name:"Back to payments"}).click();await expect(page.getByRole("searchbox",{name:"Search payments"})).toHaveValue(payment.testReference);
 await page.getByRole("button",{name:"Refunds",exact:true}).click();await expect(page).toHaveURL(/activity=refunds/);await page.getByRole("button",{name:"Deposits",exact:true}).click();await expect(page.getByRole("searchbox",{name:"Search deposits"})).toBeVisible();
 expect((await merchantOperations(page,unit.id)).payments.map(row=>row.id)).toEqual([payment.id]);
});

test("owner adds a terminal without enrolling a cardholder service",async({page})=>{
 const merchant=await acquiringFixture();await signInPerson(page,merchant.personId);
 const before=await(await page.request.get("/api/v1/services")).json();expect(before.services).toHaveLength(1);expect(before.services[0]).toMatchObject({id:merchant.serviceId,kind:"MERCHANT"});
 const directory=await merchantDashboard(page.request),unit=directory.units.find(row=>row.id===merchant.merchantId)!,name=`Studio ${randomUUID().slice(0,8)}`;
 await page.goto(`/merchant-services?view=unit:${unit.id}&section=merchants`);await page.getByRole("button",{name:"Add payment terminal",exact:true}).click();
 const dialog=page.getByRole("dialog");await dialog.getByRole("textbox",{name:"Payment terminal name"}).fill(name);await expect(dialog).toContainText(`All payments belong to ${unit.merchantName}`);await dialog.getByRole("button",{name:"Add payment terminal",exact:true}).click();await expect(page.getByRole("heading",{name,exact:true})).toBeVisible();
 const created=(await merchantDashboard(page.request)).units.find(row=>row.name===name)!;expect(created.merchantServiceId).toBe(merchant.serviceId);expect(new URL(page.url()).pathname).toBe(`/merchants/${created.id}`);
 expect(await(await page.request.get("/api/v1/services")).json()).toEqual(before);
 const cards=await cardDashboard(page.request);expect(cards.cards).toEqual([]);expect(cards.primaryService).toBeNull();
});

test("terminal users see only their own payment workspace and cannot request deposits or refunds",async({page})=>{
 test.setTimeout(90_000);
 const {merchant,payment}=await freshConnectedPayment(page);await signInPerson(page,merchant.operator.personId);
 const directory=await merchantDashboard(page.request);expect(directory.merchants.every(item=>!item.ownerAccess)).toBe(true);expect(directory.units.map(unit=>unit.id)).toEqual([merchant.unit.id]);
 await page.goto(`/merchants/${merchant.unit.id}?tab=payments&payment=${payment.id}`);await expect(page.getByRole("heading",{name:merchant.unit.displayName,exact:true})).toBeVisible();
 await expect(page.getByRole("dialog",{name:"Payment details",exact:true})).toContainText(payment.testReference);
 await expect(page.getByRole("button",{name:"Request deposit",exact:true})).toHaveCount(0);await expect(page.getByRole("button",{name:"Refund payment",exact:true})).toHaveCount(0);await expect(page.getByRole("button",{name:"Add payment terminal",exact:true})).toHaveCount(0);await expect(page.getByRole("button",{name:"Turn off payments",exact:true})).toHaveCount(0);
 const operations=await merchantOperations(page,merchant.unit.id);expect(operations.canPayout).toBe(false);expect(operations.payments.every(row=>row.merchantUnitId===merchant.unit.id)).toBe(true);
 await page.goto(`/merchants/${merchant.master.id}?tab=payments`);await expect(page.getByRole("dialog",{name:"Payment details",exact:true})).toHaveCount(0);await expect(page.locator("main")).not.toContainText(payment.testReference);
});

test("customer care reads and resolves a private customer question",async({page})=>{
 const {primary}=await freshPrepaidCard();const operator=await cardPerson(`Care operator ${randomUUID().slice(0,8)}`);
 await getDb().insert(operatorServiceAccess).values({serviceId:primary.serviceId,personId:operator,state:"ACCEPTED",canRespond:true});
 await signInPerson(page,primary.personId);const service=primary.serviceId,subject=`Care ${randomUUID().slice(0,8)}`;
 const response=await page.request.post(`/api/v1/cardholder-services/${service}/cases`,{headers,data:{commandId:randomUUID(),topic:"CARD",subject,message:"Please explain my card controls.",transactionId:null}});expect(response.status()).toBe(200);const ticket=await response.json();
 await signInPerson(page,operator);await page.goto(`/operations?case=${ticket.id}`);await expect(page.getByRole("heading",{name:subject,exact:true})).toBeVisible();
 await page.getByRole("textbox",{name:"Reply to customer"}).fill("You can freeze the selected card from its overview.");await page.getByRole("checkbox",{name:"Resolve this case with my reply"}).check();await page.getByRole("button",{name:"Save reply",exact:true}).click();
 await expect(page.locator("main")).toContainText("You can freeze the selected card from its overview.");await expect(page.getByRole("textbox",{name:"Reply to customer"})).toHaveCount(0);
 await signInPerson(page,primary.personId);const saved=await(await page.request.get(`/api/v1/cardholder-services/${service}/cases/${ticket.id}`)).json();expect(saved.status).toBe("RESOLVED");expect(saved.messages.at(-1).author).toBe("SUPPORT");
});

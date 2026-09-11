import {randomUUID} from "node:crypto";
import {expect,test} from "@playwright/test";
import {cardDashboard,headers,merchantDashboard,openCardholder,signIn} from "./helpers/fresh";
import type {MerchantOperationsProjection} from "../../src/modules/acquiring/operations-contracts";

test("selected card keeps balance, activity and reversible controls together",async({page})=>{
 const {card}=await openCardholder(page);const overview=page.getByRole("region",{name:"Selected card overview"});
 await expect(overview).toContainText(card.available.formatted);await expect(overview).toContainText(card.nickname);
 const first=card.status==="FROZEN"?"Unfreeze":"Freeze",second=first==="Freeze"?"Unfreeze":"Freeze";
 for(const action of [first,second]){await overview.getByRole("button",{name:`${action} card`,exact:true}).click();const dialog=page.getByRole("dialog");await expect(dialog.getByRole("heading",{name:`${action} card?`,exact:true})).toBeVisible();await dialog.getByRole("button",{name:`${action} card`,exact:true}).click();await expect(dialog.getByRole("button",{name:action==="Freeze"?"Unfreeze":"Freeze",exact:true})).toBeVisible();await page.keyboard.press("Escape");await expect(dialog).toHaveCount(0);}
 expect((await cardDashboard(page.request)).cards.find(row=>row.id===card.id)!.available.minor).toBe(card.available.minor);
 await overview.getByRole("link",{name:/View this card’s activity/}).click();await expect(page).toHaveURL(new RegExp(`/cardholder-services/activity\\?focus=${card.id}`));await expect(page.locator("main")).not.toContainText(/Household|Seller account|Personal account/);
});

test("primary can issue a named card through one reviewed request",async({page})=>{
 const {data}=await openCardholder(page),name=`Travel ${randomUUID().slice(0,8)}`;await page.getByRole("link",{name:"Add card",exact:true}).click();
 const dialog=page.getByRole("dialog");await expect(dialog.getByRole("heading",{name:"Who is this card for?"})).toBeVisible();const holderChoice=dialog.getByRole("radio",{name:new RegExp(data.person.displayName)});if(await holderChoice.count())await holderChoice.check();
 await dialog.getByRole("textbox",{name:"Card name",exact:true}).fill(name);await dialog.getByRole("textbox",{name:"Starting balance (USD)"}).fill("25.00");await dialog.getByRole("button",{name:"Review card",exact:true}).click();await expect(dialog).toContainText("Review your card");await expect(dialog).toContainText("$25.00");await dialog.getByRole("button",{name:"Create card",exact:true}).click();await expect(dialog).toHaveCount(0);await expect(page.getByRole("region",{name:"Selected card overview",exact:true})).toContainText(name);let directory=await cardDashboard(page.request);const cards=directory.cards.filter(row=>row.nickname===name);while(directory.cardsHasMore){directory=await cardDashboard(page.request,directory.cardsPage+1);cards.push(...directory.cards.filter(row=>row.nickname===name));}expect(cards).toHaveLength(1);expect(cards[0]!.available.minor).toBe("2500");expect(new URL(page.url()).searchParams.get("focus")).toBe(cards[0]!.id);

});

test("secondary sees only assigned cards and reports and cannot open a guessed primary card",async({page})=>{
 await signIn(page.request);const primary=await cardDashboard(page.request),foreign=primary.cards.find(card=>card.holderId===primary.person.id)!;const {card}=await openCardholder(page,"viewer");
 await expect(page.getByLabel("Selected card").locator("option[value]:not([value=''])")).toHaveCount(1);await expect(page.getByRole("link",{name:"Add card",exact:true})).toHaveCount(0);await expect(page.getByRole("link",{name:"Cardholders",exact:true})).toHaveCount(0);
 await page.getByRole("link",{name:/Statements & reports/}).first().click();await expect(page).toHaveURL(new RegExp(`reports\\?focus=${card.id}`));await expect(page.locator("main")).not.toContainText(foreign.nickname);
 const download=page.waitForEvent("download");await page.getByRole("button",{name:"Download CSV"}).click();expect((await download).suggestedFilename()).toMatch(/^etail-card-activity-/);
 await page.goto(`/cardholder-services?focus=${foreign.id}`);await expect(page.getByRole("heading",{name:"This card is unavailable",exact:true})).toBeVisible();await expect(page.getByRole("region",{name:"Selected card overview"})).toHaveCount(0);
});

test("merchant payment filters survive refresh and receipt links reopen the exact record",async({page})=>{
 await signIn(page.request);const directory=await merchantDashboard(page.request),unit=directory.units.find(row=>row.kind==="SUB"&&row.primaryAccess)!;const operations=await(await page.request.get(`/api/v1/merchants/${unit.id}/operations`)).json() as MerchantOperationsProjection;const payment=operations.payments[0]!;
 await page.goto(`/merchants/${unit.id}?tab=payments`);await page.getByRole("searchbox",{name:"Search payments"}).fill(payment.testReference);await expect(page.getByRole("table")).toContainText(payment.testReference);await page.getByLabel("Payment status").selectOption(payment.status);await page.reload();await expect(page.getByRole("searchbox",{name:"Search payments"})).toHaveValue(payment.testReference);await expect(page.getByLabel("Payment status")).toHaveValue(payment.status);
 await page.getByRole("button",{name:new RegExp(`View .*${payment.testReference}`)}).click();await expect(page.getByRole("dialog")).toContainText(payment.testReference);const exact=page.url();expect(new URL(exact).searchParams.get("payment")).toBe(payment.id);await page.reload();await expect(page.getByRole("dialog")).toContainText(payment.testReference);await page.getByRole("button",{name:"Back to payments"}).click();await expect(page.getByRole("searchbox",{name:"Search payments"})).toHaveValue(payment.testReference);
 await page.getByRole("button",{name:"Refunds",exact:true}).click();await expect(page).toHaveURL(/activity=refunds/);await page.getByRole("button",{name:"Transfers",exact:true}).click();await expect(page.getByRole("searchbox",{name:"Search transfers"})).toBeVisible();
});

test("primary adds a submerchant without enrolling a cardholder service",async({page})=>{
 await signIn(page.request);const before=await cardDashboard(page.request),directory=await merchantDashboard(page.request),unit=directory.units.find(row=>row.kind==="MASTER")!,name=`Studio ${randomUUID().slice(0,8)}`;await page.goto(`/merchant-services?view=unit:${unit.id}`);await page.getByRole("button",{name:"Add submerchant",exact:true}).click();const dialog=page.getByRole("dialog");await dialog.getByRole("textbox",{name:"Submerchant name"}).fill(name);await dialog.getByRole("button",{name:"Review merchant"}).click();await expect(dialog).toContainText(unit.name);await dialog.getByRole("button",{name:"Create submerchant",exact:true}).click();await expect(page.getByRole("heading",{name,exact:true})).toBeVisible();expect(new URL(page.url()).pathname).not.toBe(`/merchants/${unit.id}`);const created=(await merchantDashboard(page.request)).units.find(row=>row.name===name)!;expect(created.primaryId).toBe(unit.id);expect((await cardDashboard(page.request)).primaryService!.id).toBe(before.primaryService!.id);
});

test("submerchant has its own payment workspace without primary controls",async({page})=>{
 await signIn(page.request,"viewer");const directory=await merchantDashboard(page.request),unit=directory.units[0]!;await page.goto(`/merchants/${unit.id}?tab=payments`);await expect(page.getByRole("heading",{name:unit.name,exact:true})).toBeVisible();await expect(page.getByRole("button",{name:"Transfer out",exact:true})).toHaveCount(0);await expect(page.getByRole("button",{name:"Add submerchant",exact:true})).toHaveCount(0);await expect(page.getByRole("button",{name:"Turn off payments",exact:true})).toHaveCount(0);await expect(page.locator("main")).not.toContainText(/Household|Seller account|Personal account/);
});

test("customer care reads and resolves a private customer question",async({page})=>{
 await signIn(page.request);const data=await cardDashboard(page.request),service=data.primaryService!.id,subject=`Care ${randomUUID().slice(0,8)}`;const response=await page.request.post(`/api/v1/cardholder-services/${service}/cases`,{headers,data:{commandId:randomUUID(),topic:"CARD",subject,message:"Please explain my card controls.",transactionId:null}});expect(response.status()).toBe(200);const ticket=await response.json();await signIn(page.request,"operator");await page.goto(`/operations?case=${ticket.id}`);await expect(page.getByRole("heading",{name:subject,exact:true})).toBeVisible();await page.getByRole("textbox",{name:"Reply to customer"}).fill("You can freeze the selected card from its overview.");await page.getByRole("checkbox",{name:"Resolve this case with my reply"}).check();await page.getByRole("button",{name:"Save reply",exact:true}).click();await expect(page.locator("main")).toContainText("You can freeze the selected card from its overview.");await expect(page.getByRole("textbox",{name:"Reply to customer"})).toHaveCount(0);await signIn(page.request);const saved=await(await page.request.get(`/api/v1/cardholder-services/${service}/cases/${ticket.id}`)).json();expect(saved.status).toBe("RESOLVED");expect(saved.messages.at(-1).author).toBe("SUPPORT");
});

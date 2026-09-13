import {randomUUID} from "node:crypto";
import AxeBuilder from "@axe-core/playwright";
import {expect,test} from "@playwright/test";
import {getDb,closeDatabase} from "../../src/platform/database/client";
import {operatorServiceAccess} from "../../src/modules/operations/schema";
import {terminalCheckoutFixture,payTerminal} from "../helpers/terminal-checkout";
import {signInPerson} from "./helpers/prepaid";
import {getMerchantOperations} from "../../src/modules/acquiring/operations-service";
import {getPayerDispute,openPaymentDispute,listTerminalDisputes} from "../../src/modules/disputes/service";
import {readServiceMoneyAvailable} from "../../src/modules/money/service";
test.afterAll(closeDatabase);
test("customer reports a payment, terminal user supplies evidence, and an assigned reviewer resolves without moving funds",async({page})=>{
 test.setTimeout(90000);const f=await terminalCheckoutFixture(),payment=await payTerminal(f);
 await signInPerson(page,f.payer.personId);await page.goto(`/payments/${payment.paymentId}/dispute`);await expect(page.getByRole("heading",{name:"Payment help",exact:true})).toBeVisible();await page.getByRole("combobox",{name:"What happened?",exact:true}).selectOption("NOT_RECEIVED");await page.getByRole("textbox",{name:"Tell us what happened",exact:true}).fill("My order has not arrived.");await page.getByRole("button",{name:"Send report",exact:true}).click();await expect(page.getByText("Waiting for a response",{exact:true})).toBeVisible();
 await signInPerson(page,f.operator.personId);await page.goto(`/merchants/${f.unit.id}?tab=disputes`);await expect(page.getByText("My order has not arrived.",{exact:true})).toBeVisible();await page.getByRole("textbox",{name:"Your response",exact:true}).fill("We checked the delivery.");await page.getByRole("textbox",{name:"Evidence",exact:true}).fill("Dispatch record 500 shows the parcel was returned to us.");await page.getByRole("button",{name:"Submit response",exact:true}).click();await expect(page.getByText("In review",{exact:true})).toBeVisible();
 await expect(page.getByRole("link",{name:"Team access",exact:true})).toHaveCount(0);await expect(page.getByRole("link",{name:"Terminal settings",exact:true})).toHaveCount(0);await expect(page.getByRole("button",{name:/Refund|Review settlement/})).toHaveCount(0);
 expect((await new AxeBuilder({page}).include("main").withTags(["wcag2a","wcag2aa","wcag21aa"]).analyze()).violations).toEqual([]);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true);
 await getDb().insert(operatorServiceAccess).values({serviceId:f.merchant.serviceId,personId:f.helper.personId,state:"ACCEPTED",canResolveDisputes:true});await signInPerson(page,f.helper.personId);await page.goto("/operations/disputes");await page.getByRole("combobox",{name:"Review outcome",exact:true}).selectOption("REFUND_RECOMMENDED");await page.getByRole("textbox",{name:"Review notes",exact:true}).fill("The goods were returned. The owner should review a refund.");await page.getByRole("button",{name:"Save review",exact:true}).click();await expect(page.getByText("Review completed",{exact:true})).toBeVisible();await expect(page.getByText(/A refund is recommended/)).toBeVisible();
 expect(await getDb().transaction(tx=>readServiceMoneyAvailable(tx,f.payer.serviceId))).toBe(18750n);expect((await getMerchantOperations(f.merchant.personId,f.unit.id)).payments[0]?.status).toBe("APPROVED");
});
test("owner settlement requires the exact reviewed request and terminal users cannot see funds",async({page})=>{
 const f=await terminalCheckoutFixture();await payTerminal(f);await signInPerson(page,f.merchant.personId);await page.goto(`/merchant-services?section=funds&view=unit:${f.unit.id}`);await page.getByRole("region",{name:`Settlement for ${f.unit.displayName}`,exact:true}).getByRole("button",{name:"Review settlement",exact:true}).click();const details=page.getByRole("dialog",{name:"Settle received payments",exact:true});await details.getByRole("button",{name:"Review settlement",exact:true}).click();const dialog=page.getByRole("dialog",{name:"Review settlement",exact:true});await expect(dialog).toContainText("$12.50");await dialog.getByRole("button",{name:"Confirm settlement",exact:true}).click();await expect(dialog).toBeHidden();expect(await getDb().transaction(tx=>readServiceMoneyAvailable(tx,f.merchant.serviceId))).toBe(1250n);
 await signInPerson(page,f.operator.personId);await page.goto(`/merchants/${f.unit.id}?tab=payments`);await expect(page.getByRole("button",{name:"Confirm settlement",exact:true})).toHaveCount(0);await expect(page.getByText("Payment balance",{exact:true})).toHaveCount(0);const response=await page.request.post(`/api/v1/merchants/${f.unit.id}/settlements`,{headers:{Origin:"http://127.0.0.1:3100"},data:{commandId:randomUUID(),reviewToken:"0".repeat(64)}});expect(response.status()).toBe(403);
});

test("a lost payment report hides private text after denied retry and offers an explicit exit without creating another report",async({page})=>{
 const f=await terminalCheckoutFixture(),payment=await payTerminal(f),message=`Private customer report ${randomUUID()}`;
 await signInPerson(page,f.payer.personId);await page.goto(`/payments/${payment.paymentId}/dispute`);
 const requests:unknown[]=[];await page.route(`**/api/v1/payments/${payment.paymentId}/dispute`,async route=>{
  if(route.request().method()!=="POST"){await route.continue();return;}
  requests.push(route.request().postDataJSON());if(requests.length===1){const response=await route.fetch();expect(response.status()).toBe(200);await route.abort("failed");}else await route.fulfill({status:403,json:{error:{code:"ACTION_DENIED"}}});
 });
 await page.getByRole("textbox",{name:"Tell us what happened",exact:true}).fill(message);await page.getByRole("button",{name:"Send report",exact:true}).click();
 await page.getByRole("button",{name:"Retry same report",exact:true}).click();await expect(page.getByRole("heading",{name:"Payment report unavailable",exact:true})).toBeVisible();
 await expect(page.locator("main")).not.toContainText(message);await expect(page.getByRole("textbox")).toHaveCount(0);
 await page.getByRole("button",{name:"Retry same report",exact:true}).click();await expect.poll(()=>requests.length).toBe(3);expect(requests[1]).toEqual(requests[0]);expect(requests[2]).toEqual(requests[0]);
 await expect(page.getByRole("button",{name:"Leave unconfirmed report",exact:true})).toBeEnabled();await page.getByRole("button",{name:"Leave unconfirmed report",exact:true}).click();await expect(page).toHaveURL(/\/services$/);
 const saved=await getPayerDispute(f.payer.personId,payment.paymentId);expect(saved.dispute?.messages).toHaveLength(1);expect(saved.dispute?.messages[0]?.message).toBe(message);
});

test("an unknown terminal response keeps its exact request, hides evidence after access denial and allows an explained exit",async({page})=>{
 const f=await terminalCheckoutFixture(),payment=await payTerminal(f),claim=await openPaymentDispute(f.payer.personId,payment.paymentId,{commandId:randomUUID(),reason:"OTHER",message:"Please check the order."});
 await signInPerson(page,f.operator.personId);await page.goto(`/merchants/${f.unit.id}?tab=disputes`);
 const message=`Private terminal response ${randomUUID()}`,evidence=`Private delivery evidence ${randomUUID()}`,requests:unknown[]=[];
 await page.route(`**/api/v1/merchants/${f.unit.id}/disputes/${claim.id}/respond`,async route=>{requests.push(route.request().postDataJSON());if(requests.length===1){const response=await route.fetch();expect(response.status()).toBe(200);await route.abort("failed");}else await route.fulfill({status:404,json:{error:{code:"NOT_FOUND"}}});});
 await page.getByRole("textbox",{name:"Your response",exact:true}).fill(message);await page.getByRole("textbox",{name:"Evidence",exact:true}).fill(evidence);await page.getByRole("button",{name:"Submit response",exact:true}).click();
 await page.getByRole("button",{name:"Retry same response",exact:true}).click();await expect(page.getByRole("heading",{name:"Dispute unavailable",exact:true})).toBeVisible();
 await expect(page.locator("main")).not.toContainText(message);await expect(page.locator("main")).not.toContainText(evidence);await expect(page.getByRole("textbox")).toHaveCount(0);
 await page.getByRole("button",{name:"Retry same response",exact:true}).click();await expect.poll(()=>requests.length).toBe(3);expect(requests[1]).toEqual(requests[0]);expect(requests[2]).toEqual(requests[0]);
 await expect(page.getByRole("button",{name:"Leave unconfirmed response",exact:true})).toBeEnabled();await page.getByRole("button",{name:"Leave unconfirmed response",exact:true}).click();await expect(page).toHaveURL(/\/services$/);
 expect((await listTerminalDisputes(f.merchant.personId,f.unit.id))[0]?.messages.filter(item=>item.kind==="RESPONSE")).toHaveLength(1);
});

test("a direct dispute route reveals its active terminal tab at320px and keyboard movement stays in the horizontal navigation",async({page})=>{
 const f=await terminalCheckoutFixture();await signInPerson(page,f.merchant.personId);await page.setViewportSize({width:320,height:900});
 const route=`/merchants/${f.unit.id}?tab=disputes`;await page.goto(route);
 const nav=page.getByRole("navigation",{name:"Payment terminal navigation",exact:true}),current=nav.getByRole("link",{name:"Disputes",exact:true});
 const fullyVisible=async(link:typeof current)=>{
  await expect(link).toBeInViewport({ratio:0.99});
  const clipped=await link.evaluate(node=>{const item=node.getBoundingClientRect(),container=node.closest("nav")!.getBoundingClientRect();return Math.max(container.left-item.left,item.right-container.right,0);});
  expect(clipped).toBeLessThanOrEqual(1); // Browser scroll positions round to device pixels.
 };
 await expect(current).toHaveAttribute("aria-current","page");await fullyVisible(current);
 expect(await nav.evaluate(node=>node.scrollLeft)).toBeGreaterThan(0);expect(await page.evaluate(()=>window.scrollY)).toBe(0);const originalUrl=page.url();
 await current.focus();
 for(const [key,label] of [["Tab","Terminal settings"],["Tab","Contact support"],["Shift+Tab","Terminal settings"],["Shift+Tab","Disputes"],["Shift+Tab","Team access"],["Shift+Tab","Payments"],["Shift+Tab","Payment links"]] as const){
  await page.keyboard.press(key);const focused=nav.getByRole("link",{name:label,exact:true});await expect(focused).toBeFocused();await fullyVisible(focused);expect(page.url()).toBe(originalUrl);expect(await page.evaluate(()=>window.scrollY)).toBe(0);
 }
 expect(await nav.evaluate(node=>node.scrollLeft)).toBe(0);
 await page.reload();await fullyVisible(current);expect(page.url()).toBe(originalUrl);expect(await page.evaluate(()=>window.scrollY)).toBe(0);
});

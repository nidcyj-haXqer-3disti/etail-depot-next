import {randomUUID} from "node:crypto";
import {expect,test,type Page} from "@playwright/test";
import {merchantOperationsProjectionSchema} from "../../src/modules/acquiring/operations-api-contracts";
import {supportCaseDetailSchema,supportCaseListSchema} from "../../src/modules/cases/api-contracts";
import {formatDate} from "../../src/ui/workspace/format-date";
import {merchantDashboard,signIn} from "./helpers/fresh";

async function merchantPayment(page:Page,persona:"owner"|"viewer") {
  await signIn(page.request,persona);
  const dashboard=await merchantDashboard(page.request);
  const unit=dashboard.units.find(row=>persona==="owner"?row.ownerAccess&&row.name==="Online store":!row.ownerAccess&&row.name==="Pop-up shop");
  expect(unit).toBeTruthy();
  const response=await page.request.get(`/api/v1/merchants/${unit!.id}/operations`);expect(response.status()).toBe(200);
  const operations=merchantOperationsProjectionSchema.parse(await response.json());
  const payment=operations.payments.find(row=>persona==="owner"?row.refund!==null:row.status==="APPROVED");expect(payment).toBeTruthy();
  return {unit:unit!,payment:payment!};
}
async function explain(page:Page,subject:string) {
  await expect(page.getByRole("heading",{name:"What can we help with?",exact:true})).toBeVisible();
  await expect(page.getByRole("combobox",{name:"Topic",exact:true})).toHaveValue("PAYMENT");
  await page.getByRole("textbox",{name:"Subject",exact:true}).fill(subject);
  await page.getByRole("textbox",{name:"Your explanation",exact:true}).fill("Please explain when this payment and its refund appear in activity.");
  await page.getByRole("button",{name:"Review case",exact:true}).click();
  await expect(page.getByRole("heading",{name:"Ready to save your question?",exact:true})).toBeVisible();
}
async function savedCase(page:Page,merchantId:string,action:()=>Promise<void>,caseId?:string,suffix="") {
  const path=`/api/v1/merchants/${merchantId}/cases${caseId?`/${caseId}${suffix}`:""}`;
  const pending=page.waitForResponse(response=>new URL(response.url()).pathname===path&&response.request().method()==="POST");
  await action();const response=await pending;expect(response.status()).toBe(200);return supportCaseDetailSchema.parse(await response.json());
}

test("a payment question carries exact refund dates through assigned support and returns to the same payment",async({page})=>{
  test.setTimeout(90_000);
  const {unit,payment}=await merchantPayment(page,"owner"),subject=`Payment support ${randomUUID().slice(0,8)}`;
  const original=`/merchants/${unit.id}?tab=payments&activity=refunds&payment=${payment.id}&q=${encodeURIComponent(payment.testReference)}`;
  await page.goto(original);
  const receipt=page.getByRole("dialog",{name:"Payment details",exact:true});await expect(receipt).toContainText(payment.testReference);
  await receipt.getByRole("link",{name:"Get help with this payment",exact:true}).click();
  await expect(page.getByRole("navigation",{name:"Merchant navigation"}).getByRole("link",{name:"Help",exact:true})).toHaveAttribute("aria-current","page");
  await explain(page,subject);
  const context=page.getByRole("region",{name:"Related payment",exact:true});
  await expect(context).toContainText(unit.name);await expect(context).toContainText(unit.merchantName);await expect(context).toContainText(payment.testReference);
  await expect(context).toContainText(formatDate(payment.createdAt));await expect(context).toContainText(formatDate(payment.refund!.createdAt));
  const ticket=await savedCase(page,unit.id,()=>page.getByRole("button",{name:"Create case",exact:true}).click());
  expect(ticket.payment?.id).toBe(payment.id);expect(ticket.nextActor).toBe("SUPPORT");
  await expect(page).toHaveURL(url=>url.searchParams.get("case")===ticket.id);
  await page.reload();await expect(page.getByRole("heading",{name:subject,exact:true})).toBeVisible();
  await page.getByRole("link",{name:"Return to payment",exact:true}).click();
  await expect(receipt).toContainText(payment.testReference);
  expect(new URL(page.url()).searchParams.get("activity")).toBe("refunds");expect(new URL(page.url()).searchParams.get("q")).toBe(payment.testReference);
  await signIn(page.request,"operator");await page.goto(`/operations?case=${ticket.id}`);
  const operator=page.getByRole("region",{name:"Selected case"});await expect(operator).toContainText(subject);
  const financialContext=operator.getByRole("region",{name:"Related payment"});
  await expect(financialContext).toContainText(payment.testReference);await expect(financialContext).toContainText(payment.refund!.testReference);
  await expect(financialContext).toContainText(payment.amount.formatted);await expect(financialContext).toContainText(formatDate(payment.createdAt));await expect(financialContext).toContainText(formatDate(payment.refund!.createdAt));
  await expect(operator.getByRole("button",{name:/Refund payment|Request deposit/})).toHaveCount(0);
  const reply="The refund is shown on its completion date, separately from the original payment date.";
  await operator.getByRole("textbox",{name:"Reply to customer",exact:true}).fill(reply);await operator.getByRole("button",{name:"Save reply",exact:true}).click();await expect(operator).toContainText(reply);
  await signIn(page.request,"owner");await page.goto(`/merchants/${unit.id}?tab=help&case=${ticket.id}`);
  await expect(page.getByText("Next step: review the support reply",{exact:true})).toBeVisible();
  await page.getByRole("textbox",{name:"Add an update",exact:true}).fill("Thank you. The dates explain the difference.");
  const updated=await savedCase(page,unit.id,()=>page.getByRole("button",{name:"Save update",exact:true}).click(),ticket.id,"/messages");expect(updated.nextActor).toBe("SUPPORT");
  await signIn(page.request,"operator");await page.goto(`/operations?case=${ticket.id}`);
  await operator.getByRole("textbox",{name:"Reply to customer",exact:true}).fill("Resolved with the payment and refund dates explained.");await operator.getByRole("checkbox",{name:"Resolve this case with my reply",exact:true}).check();await operator.getByRole("button",{name:"Save reply",exact:true}).click();await expect(operator.getByRole("textbox",{name:"Reply to customer",exact:true})).toHaveCount(0);
  await signIn(page.request,"owner");await page.goto(`/merchants/${unit.id}?tab=help&case=${ticket.id}`);await expect(page.getByText("Resolved by support",{exact:true})).toBeVisible();await expect(page.getByRole("textbox",{name:"Add an update",exact:true})).toHaveCount(0);
});

test("a collector recovers one saved case after a lost response, keeps it private and can withdraw it",async({page})=>{
  test.setTimeout(90_000);const {unit,payment}=await merchantPayment(page,"viewer"),subject=`Collector question ${randomUUID().slice(0,8)}`;
  await page.goto(`/merchants/${unit.id}?tab=help&new=1&payment=${payment.id}`);await explain(page,subject);
  const commands:unknown[]=[];let requests=0;const path=`/api/v1/merchants/${unit.id}/cases`;
  await page.route(`**${path}`,async route=>{
    if(route.request().method()!=="POST")return route.continue();
    commands.push(route.request().postDataJSON());requests+=1;
    if(requests===1){const response=await route.fetch();expect(response.status()).toBe(200);await route.abort("failed");}
    else if(requests===2)await route.fulfill({status:403,contentType:"application/json",body:JSON.stringify({error:{code:"ACTION_DENIED"}})});
    else await route.continue();
  });
  await page.getByRole("button",{name:"Create case",exact:true}).click();await expect(page.getByRole("button",{name:"Retry same request",exact:true})).toBeEnabled();
  await page.getByRole("button",{name:"Retry same request",exact:true}).click();await expect(page.getByRole("main").getByRole("alert")).toContainText("no longer available");
  await page.getByRole("button",{name:"Retry same request",exact:true}).click();await expect(page).toHaveURL(url=>Boolean(url.searchParams.get("case")));
  const caseId=new URL(page.url()).searchParams.get("case")!;expect(commands).toHaveLength(3);expect(commands[1]).toEqual(commands[0]);expect(commands[2]).toEqual(commands[0]);
  const response=await page.request.get(`${path}?q=${encodeURIComponent(subject)}`);expect(response.status()).toBe(200);
  const listed=supportCaseListSchema.parse(await response.json());expect(listed.cases.filter(item=>item.subject===subject)).toHaveLength(1);
  await page.reload();await expect(page.getByRole("heading",{name:subject,exact:true})).toBeVisible();
  await page.getByRole("button",{name:"Withdraw case",exact:true}).click();const dialog=page.getByRole("dialog",{name:"Withdraw this case?",exact:true});
  await dialog.getByRole("textbox",{name:"Reason for withdrawing",exact:true}).fill("I found the answer in this merchant’s payment receipt.");
  const withdrawn=await savedCase(page,unit.id,()=>dialog.getByRole("button",{name:"Withdraw case",exact:true}).click(),caseId,"/withdraw");expect(withdrawn.status).toBe("WITHDRAWN");expect(withdrawn.nextActor).toBe("NONE");
  await expect(dialog).toBeHidden();await page.reload();await expect(page.getByText("Withdrawn by you",{exact:true})).toBeVisible();
  await signIn(page.request,"owner");expect((await page.request.get(`${path}/${caseId}`)).status()).toBe(404);
  await page.goto(`/merchants/${unit.id}?tab=help&case=${caseId}`);await expect(page.getByRole("main").getByRole("alert")).toContainText("no longer available");await expect(page.getByRole("heading",{name:subject,exact:true})).toHaveCount(0);
});

test("a payment from another merchant is never substituted into the case form",async({page})=>{
  const {payment}=await merchantPayment(page,"owner");const dashboard=await merchantDashboard(page.request),other=dashboard.units.find(unit=>unit.ownerAccess&&unit.name==="Pop-up shop")!;
  await page.goto(`/merchants/${other.id}?tab=help&new=1&payment=${payment.id}`);
  await expect(page.getByRole("heading",{level:1,name:other.name,exact:true})).toBeVisible();
  await expect(page.getByText("That payment is unavailable with your current access. It will not be attached to this case.",{exact:true})).toBeVisible();
  await expect(page.getByRole("region",{name:"Related payment"})).toHaveCount(0);await expect(page.getByRole("main")).not.toContainText(payment.testReference);
  await expect(page.getByRole("checkbox",{name:"Include this payment with my question",exact:true})).toHaveCount(0);
});

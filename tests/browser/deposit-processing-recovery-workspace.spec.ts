import {eq} from "drizzle-orm";
import {expect,test} from "@playwright/test";
import {closeDatabase,getDb} from "../../src/platform/database/client";
import {getMerchantOperations} from "../../src/modules/acquiring/operations-service";
import {merchantDepositEvents,merchantDeposits} from "../../src/modules/acquiring/settlement-schema";
import {ledgerJournals} from "../../src/modules/ledger/schema";
import {merchantTestPayoutProjectionSchema} from "../../src/shared/deposit-response";
import {startHistoricalDepositBrowser,type HistoricalDepositBrowser} from "./helpers/historical-deposit";

let fixture:HistoricalDepositBrowser;
test.beforeAll(async()=>{test.setTimeout(90_000);fixture=await startHistoricalDepositBrowser();});
test.afterAll(async()=>{await closeDatabase();await fixture?.close();});

test("an operator retries a committed deposit result after valid JSON with a malformed success shape",async({page})=>{
 test.setTimeout(90_000);
 const m={merchant:{personId:fixture.ownerId,serviceId:fixture.serviceId},unit:{id:fixture.terminalId}};
 const before=await getMerchantOperations(m.merchant.personId,m.unit.id);
 const deposit=before.payouts.find(row=>row.id===fixture.depositId)!;
 expect(deposit).toMatchObject({status:"PENDING",amount:{minor:"1250"}});
 await fixture.signIn(page);
 await page.goto(`${fixture.origin}/operations/deposits`);
 await expect(page.getByRole("heading",{name:"Deposit processing",exact:true})).toBeVisible();
 const row=page.getByRole("article").filter({hasText:deposit.testReference});
 await expect(row).toBeVisible();await expect(row).toContainText("$12.50");
 await row.getByText("Included payments",{exact:true}).click();await expect(row).toContainText(fixture.paymentReference);
 await row.getByRole("button",{name:"Complete deposit",exact:true}).click();
 await expect(row).toContainText("Record this deposit as completed?");
 const attempts:Array<{path:string;body:unknown}>=[],statuses:number[]=[];
 const path=`/api/v1/operations/deposits/${deposit.id}`;
 await page.route(`**${path}`,async route=>{
  if(route.request().method()!=="POST"){await route.continue();return;}
  attempts.push({path:new URL(route.request().url()).pathname,body:route.request().postDataJSON()});
  const response=await route.fetch();statuses.push(response.status());expect(response.status()).toBe(200);
  const saved=merchantTestPayoutProjectionSchema.parse(await response.json());
  expect(saved).toMatchObject({id:deposit.id,merchantUnitId:m.unit.id,status:"COMPLETED",amount:{minor:"1250"}});
  if(attempts.length===1)await route.fulfill({status:200,json:{}});else await route.fulfill({response});
 });
 await row.getByRole("button",{name:"Confirm result",exact:true}).click();
 await expect(row.getByRole("button",{name:"Retry processing",exact:true})).toBeEnabled();
 await expect(row).toContainText("Processing could not be confirmed");
 // A malformed body must not refresh away the unresolved row or allow the
 // operator to choose a different outcome after the first command committed.
 await expect(row.getByRole("button",{name:"Record failure",exact:true})).toHaveCount(0);
 await expect(row.getByRole("button",{name:"Complete deposit",exact:true})).toHaveCount(0);
 await expect(row.getByRole("button",{name:"Cancel",exact:true})).toHaveCount(0);
 expect(await getMerchantOperations(m.merchant.personId,m.unit.id)).toMatchObject({pendingDeposits:{minor:"0"},bankFunds:{minor:"1250"}});
 expect(await getDb().select().from(merchantDepositEvents).where(eq(merchantDepositEvents.depositId,deposit.id))).toHaveLength(1);
 await row.getByRole("button",{name:"Retry processing",exact:true}).click();
 await expect(row).toHaveCount(0);
 await expect(page.getByText("No pending deposits for your assigned merchants.",{exact:true})).toBeVisible();
 expect(statuses).toEqual([200,200]);expect(attempts[1]).toEqual(attempts[0]);expect(attempts[0]!.body).toMatchObject({outcome:"COMPLETED"});
 expect(attempts[0]!.path).toBe(path);
 const events=await getDb().select().from(merchantDepositEvents).where(eq(merchantDepositEvents.depositId,deposit.id));
 expect(events).toHaveLength(1);expect(events[0]!.commandId).toBe((attempts[0]!.body as {commandId:string}).commandId);
 expect(await getDb().select().from(merchantDeposits).where(eq(merchantDeposits.merchantUnitId,m.unit.id))).toHaveLength(1);
 const journals=await getDb().select().from(ledgerJournals).where(eq(ledgerJournals.referenceId,deposit.id));
 expect(journals.filter(journal=>journal.kind==="MERCHANT_PAYOUT")).toHaveLength(1);
 expect(await getMerchantOperations(m.merchant.personId,m.unit.id)).toMatchObject({pendingDeposits:{minor:"0"},bankFunds:{minor:"1250"},payouts:[{id:deposit.id,status:"COMPLETED"}]});
 await page.reload();await expect(row).toHaveCount(0);
});

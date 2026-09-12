import {randomUUID} from "node:crypto";
import {eq} from "drizzle-orm";
import {expect,test} from "@playwright/test";
import {closeDatabase,getDb} from "../../src/platform/database/client";
import {getMerchantOperations,createMerchantSettlement} from "../../src/modules/acquiring/operations-service";
import {listOwnedMoneyAccounts,prepareMoneyWithdrawal,confirmMoneyWithdrawal,getMoneyAccountOverview} from "../../src/modules/money/service";
import {moneyWithdrawalEvents,moneyWithdrawals} from "../../src/modules/money/schema";
import {ledgerJournals} from "../../src/modules/ledger/schema";
import {moneyWithdrawalReceiptSchema} from "../../src/shared/money-response";
import {freshPrepaidCard,freshPublishedPayment,payPublishedWithCard,signInPerson} from "./helpers/prepaid";
import {explicitDepositOperator} from "./helpers/merchant-payments";

test.afterAll(closeDatabase);

test("an operator retries a committed withdrawal result after valid JSON with a malformed success shape",async({page})=>{
 test.setTimeout(90_000);
 const m=await freshPublishedPayment("1250"),payer=await freshPrepaidCard("10000");
 const paid=await payPublishedWithCard(m.publication.id,payer);expect(paid.receipt).not.toBeNull();
 const before=await getMerchantOperations(m.merchant.personId,m.unit.id);
 await createMerchantSettlement(m.merchant.personId,m.unit.id,{commandId:randomUUID(),reviewToken:before.depositReview!.token});
 const [account]=await listOwnedMoneyAccounts(m.merchant.personId),review=await prepareMoneyWithdrawal(m.merchant.personId,account!.id,{commandId:randomUUID(),amountMinor:"1250"}),deposit=await confirmMoneyWithdrawal(m.merchant.personId,account!.id,review.id);
 expect(deposit).toMatchObject({status:"PENDING",amount:{minor:"1250"}});
 const operatorId=await explicitDepositOperator(m.merchant.serviceId);await signInPerson(page,operatorId);
 await page.goto("/operations/money-withdrawals");
 await expect(page.getByRole("heading",{name:"Withdrawal processing",exact:true})).toBeVisible();
 const row=page.getByRole("article").filter({hasText:deposit.reference});
 await expect(row).toBeVisible();await expect(row).toContainText("$12.50");
 await row.getByRole("button",{name:"Complete withdrawal",exact:true}).click();
 await expect(row).toContainText("Record this withdrawal as completed?");
 const attempts:Array<{path:string;body:unknown}>=[],statuses:number[]=[];
 const path=`/api/v1/operations/money-withdrawals/${deposit.id}`;
 await page.route(`**${path}`,async route=>{
  if(route.request().method()!=="POST"){await route.continue();return;}
  attempts.push({path:new URL(route.request().url()).pathname,body:route.request().postDataJSON()});
  const response=await route.fetch();statuses.push(response.status());expect(response.status()).toBe(200);
  const saved=moneyWithdrawalReceiptSchema.parse(await response.json());
  expect(saved).toMatchObject({id:deposit.id,moneyAccountId:account!.id,status:"COMPLETED",amount:{minor:"1250"}});
  if(attempts.length===1)await route.fulfill({status:200,json:{}});else await route.fulfill({response});
 });
 await row.getByRole("button",{name:"Confirm result",exact:true}).click();
 await expect(row.getByRole("button",{name:"Retry the same result",exact:true})).toBeEnabled();
 await expect(row).toContainText("We couldn’t verify this result");
 // A malformed body must not refresh away the unresolved row or allow the
 // operator to choose a different outcome after the first command committed.
 await expect(row.getByRole("button",{name:"Return money",exact:true})).toHaveCount(0);
 await expect(row.getByRole("button",{name:"Complete withdrawal",exact:true})).toHaveCount(0);
 await expect(row.getByRole("button",{name:"Cancel",exact:true})).toHaveCount(0);
 expect(await getMoneyAccountOverview(m.merchant.personId,account!.id)).toMatchObject({pendingWithdrawals:{minor:"0"},available:{minor:"0"}});
 expect(await getDb().select().from(moneyWithdrawalEvents).where(eq(moneyWithdrawalEvents.withdrawalId,deposit.id))).toHaveLength(1);
 await row.getByRole("button",{name:"Retry the same result",exact:true}).click();
 await expect(row).toHaveCount(0);
 await expect(page.getByText("No withdrawals are waiting for your review.",{exact:true})).toBeVisible();
 expect(statuses).toEqual([200,200]);expect(attempts[1]).toEqual(attempts[0]);expect(attempts[0]!.body).toMatchObject({outcome:"COMPLETED"});
 expect(attempts[0]!.path).toBe(path);
 const events=await getDb().select().from(moneyWithdrawalEvents).where(eq(moneyWithdrawalEvents.withdrawalId,deposit.id));
 expect(events).toHaveLength(1);expect(events[0]!.commandId).toBe((attempts[0]!.body as {commandId:string}).commandId);
 expect(await getDb().select().from(moneyWithdrawals).where(eq(moneyWithdrawals.moneyAccountId,account!.id))).toHaveLength(1);
 const journals=await getDb().select().from(ledgerJournals).where(eq(ledgerJournals.referenceId,deposit.id));
 expect(journals.filter(journal=>journal.kind==="MONEY_WITHDRAWAL_COMPLETE")).toHaveLength(1);
 expect(await getMoneyAccountOverview(m.merchant.personId,account!.id)).toMatchObject({pendingWithdrawals:{minor:"0"},available:{minor:"0"}});
 await page.reload();await expect(row).toHaveCount(0);
});

import {randomUUID} from "node:crypto";
import {eq} from "drizzle-orm";
import {afterAll,expect,it,vi} from "vitest";
import {closeDatabase,getDb} from "../../src/platform/database/client";
import * as merchantClock from "../../src/modules/access/merchant-scope";
import {operatorServiceAccess} from "../../src/modules/operations/schema";
import {createChannel} from "../../src/modules/acquiring/service";
import {
  configureTestGateway,enrollTestMerchant,setChannelActivation,simulateMerchantPayment,
  getMerchantOperations,createMerchantPayout,processMerchantDeposit,
} from "../../src/modules/acquiring/operations-service";
import {merchantDeposits,merchantDepositEvents} from "../../src/modules/acquiring/settlement-schema";
import {getMerchantDashboard} from "../../src/modules/acquiring/dashboard-service";
import {merchantActivityCsv} from "../../src/modules/acquiring/activity-service";
import {merchantDashboardProjectionSchema} from "../../src/modules/acquiring/dashboard-contracts";
import {merchantAccessFixture} from "../helpers/merchant-access";
import {paymentInput} from "../helpers/acquiring";

afterAll(closeDatabase);

it.each(["COMPLETED","FAILED"] as const)("dates a %s deposit by its processing event, retaining the original request and exact filtered export",async(outcome)=>{
  const f=await merchantAccessFixture();
  await configureTestGateway(f.merchant.personId,f.master.id,{commandId:randomUUID(),expectedVersion:0,enabled:true});
  await enrollTestMerchant(f.merchant.personId,f.unit.id,{commandId:randomUUID(),expectedVersion:0,enabled:true});
  const channel=await createChannel(f.operator.personId,f.unit.id,{
    ...paymentInput(),usage:"REUSABLE",description:"Deposit date regression",
    presentations:["WEB"],visibility:"CREATOR_PRIVATE",
  });
  await setChannelActivation(f.operator.personId,f.unit.id,channel.id,{
    commandId:randomUUID(),expectedVersion:0,expectedChannelVersion:channel.version,active:true,
  });
  await simulateMerchantPayment(f.operator.personId,f.unit.id,channel.id,{
    commandId:randomUUID(),expectedChannelVersion:channel.version,outcome:"APPROVED",
  });
  const review=(await getMerchantOperations(f.merchant.personId,f.unit.id)).depositReview!;
  const deposit=await createMerchantPayout(f.merchant.personId,f.unit.id,{commandId:randomUUID(),reviewToken:review.token});
  const requestDay=deposit.createdAt.slice(0,10);
  const eventTime=new Date(requestDay+"T12:00:00.000Z");
  eventTime.setUTCDate(eventTime.getUTCDate()+1);
  const eventDay=eventTime.toISOString().slice(0,10),view=`network:${f.master.id}`;
  const query=(day:string)=>({view,activity:"transfers",period:"custom",from:day,to:day,q:deposit.testReference});
  const request=await getDb().select().from(merchantDeposits).where(eq(merchantDeposits.id,deposit.id));
  const pending=await getMerchantDashboard(f.merchant.personId,query(requestDay));
  expect(pending.activity.rows).toHaveLength(1);
  expect(pending.activity.rows[0]).toMatchObject({id:deposit.id,status:"PENDING",at:deposit.createdAt});
  expect(pending.activity.periodTotals.transferred?.minor).toBe("0");
  expect((await getMerchantDashboard(f.merchant.personId,query(eventDay))).activity.rows).toEqual([]);

  // The setup fixture's operator has no processing right until this separate explicit assignment.
  await getDb().insert(operatorServiceAccess).values({
    serviceId:f.merchant.serviceId,personId:f.operator.personId,state:"ACCEPTED",
    canRespond:false,canProcessDeposits:true,
  });
  // Advance only the command's clock seam. Both immutable event and journal are created
  // through the canonical processor; no historical timestamps or records are rewritten.
  const clock=vi.spyOn(merchantClock,"merchantNow").mockResolvedValue(eventTime);
  try{
    const processed=await processMerchantDeposit(f.operator.personId,deposit.id,{commandId:randomUUID(),outcome});
    expect(processed).toMatchObject({id:deposit.id,status:outcome,createdAt:deposit.createdAt,processedAt:eventTime.toISOString()});
  }finally{clock.mockRestore();}

  expect(await getDb().select().from(merchantDeposits).where(eq(merchantDeposits.id,deposit.id))).toEqual(request);
  const events=await getDb().select().from(merchantDepositEvents).where(eq(merchantDepositEvents.depositId,deposit.id));
  expect(events).toHaveLength(1);expect(events[0]).toMatchObject({outcome,createdAt:eventTime});
  const originalDay=await getMerchantDashboard(f.merchant.personId,query(requestDay));
  expect(originalDay.activity.rows).toEqual([]);
  expect(originalDay.activity.periodTotals.transferred?.minor).toBe("0");
  const onEventDay=merchantDashboardProjectionSchema.parse(await getMerchantDashboard(f.merchant.personId,query(eventDay)));
  expect(onEventDay.activity.rows).toHaveLength(1);
  expect(onEventDay.activity.rows[0]).toMatchObject({id:deposit.id,merchantId:f.unit.id,status:outcome,at:eventTime.toISOString(),amount:{minor:"1250"}});
  expect(onEventDay.activity.periodTotals.transferred?.minor).toBe(outcome==="COMPLETED"?"1250":"0");
  const summary=onEventDay.views.find(row=>row.id===view)!.transfers.find(row=>row.id===deposit.id)!;
  expect(summary).toMatchObject({status:outcome,at:eventTime.toISOString()});
  const exact=new URL(onEventDay.activity.rows[0]!.href,"https://etail.invalid");
  expect(exact.pathname).toBe(`/merchants/${f.unit.id}`);
  expect(exact.searchParams.get("transfer")).toBe(deposit.id);
  const exported=await getMerchantDashboard(f.merchant.personId,query(eventDay),{exportRows:true});
  expect(exported.activity.rows).toHaveLength(1);
  const csv=merchantActivityCsv(exported.activity);
  expect(csv).toContain(`"${eventTime.toISOString()}"`);
  expect(csv).toContain(`"${deposit.testReference}"`);
  expect(csv).not.toContain(`"${deposit.createdAt}"`);
  expect(await getDb().select().from(merchantDepositEvents).where(eq(merchantDepositEvents.depositId,deposit.id))).toEqual(events);
});

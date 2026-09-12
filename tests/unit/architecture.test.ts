import { beforeAll, describe, expect, it } from "vitest";

let probe: (filename: string, source: string) => string[];
beforeAll(async () => {
  const moduleUrl = new URL("../../tools/verify-architecture.mjs", import.meta.url).href;
  const detector = await import(/* @vite-ignore */ moduleUrl) as { inspectArchitectureSource: typeof probe };
  probe = detector.inspectArchitectureSource;
});
const workspace = "src/modules/workspace/service.ts";
const ledger = "src/modules/ledger/service.ts";
const operations = "src/modules/acquiring/operations-service.ts";
const ui = "src/ui/workspace/merchant-operations.tsx";

describe("fresh service enrollment and support boundaries",()=>{
  it("keeps guest authority separate while sharing the single payment writer",()=>{
    const guest="src/modules/acquiring/guest-service.ts";
    const call='import {recordMerchantSandboxPayment as record} from "./operations-service"; async function confirmGuestAttempt(){return record(tx,input);}';
    expect(probe(guest,call)).toEqual([]);
    expect(probe(guest,call.replace("confirmGuestAttempt","bypass"))).toContain("PAYMENT_PERSISTENCE_BOUNDARY");
    expect(probe(guest,'import {postJournal} from "../ledger/service"; function confirmGuestAttempt(){return postJournal(tx,input);}')).toContain("LEDGER_POSTING_BOUNDARY");
    expect(probe(guest,'import {guestOrders} from "./guest-schema"; function createGuestOrder(){tx.insert(guestOrders).values({});}')).toEqual([]);
    expect(probe(guest,'import {guestOrders} from "./guest-schema"; function createGuestOrder(){tx.update(guestOrders).set({});}')).toContain("GUEST_WRITER_OWNERSHIP");
    expect(probe(guest,'function bypass(){tx.execute(sql`UPDATE merchant_guest_orders SET amount=1`);}')).toContain("RAW_GUEST_WRITE");
    const route='import {confirmGuestAttempt} from "@/modules/acquiring/guest-service"; export async function POST(){return confirmGuestAttempt();}';
    expect(probe("src/app/api/v1/guest/orders/[orderId]/attempts/[attemptId]/confirm/route.ts",route)).toContain("RETIRED_SIMULATOR_ROUTE");
    expect(probe("src/app/api/v1/guest/pay/route.ts",route)).toContain("RETIRED_SIMULATOR_COMMAND");
    const ui='"use client"; async function guestRequest(){return fetch("/api/v1/guest/session",{method:"POST"});}';
    expect(probe("src/ui/guest-checkout.tsx",ui)).toContain("RETIRED_GUEST_SIMULATOR_UI");
    expect(probe("src/ui/other.tsx",ui)).toContain("RETIRED_GUEST_SIMULATOR_UI");
  });
  it("keeps the shared case engine's writes and both exact list routes finite",()=>{
    const owner="src/modules/cases/service.ts";
    const source='import {supportCases,supportCaseMessages,supportCaseCommands} from "./schema"; async function createCase(){tx.insert(supportCases).values({});tx.insert(supportCaseMessages).values({});} async function updateCase(){tx.update(supportCases).set({});tx.insert(supportCaseMessages).values({});} async function execute(){tx.insert(supportCaseCommands).values({});}';
    expect(probe(owner,source)).toEqual([]);
    expect(probe(owner,source.replace("function createCase","function bypass"))).toContain("SUPPORT_WRITER_OWNERSHIP");
    for(const service of ["cardholder-services","merchants"]){
      const list='"use client"; function list(id,query){fetch(`/api/v1/'+service+'/${encodeURIComponent(id)}/cases?${query}`,{cache:"no-store"});}';
      expect(probe("src/ui/workspace/cases.tsx",list)).toEqual([]);
      expect(probe("src/ui/workspace/cases.tsx",list.replace('cache:"no-store"','method:"POST"'))).toContain("UNINSPECTABLE_UI_COMMAND_PATH");
    }
  });
  it("creates primary responsibility only in its explicit enrollment owner",()=>{
    const create='import {services,serviceMembers} from "@/platform/database/schema"; export async function createCardholderService(){tx.insert(services).values({});tx.insert(serviceMembers).values({});}';
    expect(probe("src/modules/services/service.ts",create)).toEqual([]);
    expect(probe("src/modules/services/service.ts",create.replaceAll("createCardholderService","bindIdentity"))).toContain("SERVICE_RESPONSIBILITY_OWNER");
    expect(probe("src/modules/access/merchant-service.ts",create)).toContain("SERVICE_MEMBERSHIP_OWNER");
    expect(probe("src/modules/services/service.ts",create.replace("tx.insert(services)","tx.update(services)"))).toContain("SERVICE_RESPONSIBILITY_OWNER");
    const route='import {createCardholderService} from "@/modules/services/service"; export async function POST(){return createCardholderService();}';
    expect(probe("src/app/api/v1/cardholder-services/route.ts",route)).toEqual([]);
    expect(probe("src/app/api/v1/auth/enroll/route.ts",route)).toContain("PARALLEL_CARDHOLDER_CREATION_ROUTE");
  });
  it("allows the exact support response writer while rejecting grant, history and ledger bypasses",()=>{
    const owner="src/modules/operations/service.ts";
    const source='import {supportCases,supportCaseMessages} from "@/modules/cases/schema"; import {operatorCommands} from "./schema"; export async function respondToCase(){tx.update(supportCases).set({});tx.insert(supportCaseMessages).values({});tx.insert(operatorCommands).values({});}';
    expect(probe(owner,source)).toEqual([]);
    expect(probe("src/modules/cases/another.ts",source)).toContain("SUPPORT_WRITER_OWNERSHIP");
    expect(probe(owner,source.replace("tx.insert(supportCaseMessages)","tx.delete(supportCaseMessages)"))).toContain("SUPPORT_WRITER_OWNERSHIP");
    expect(probe(owner,'import {operatorServiceAccess} from "./schema"; function grant(){tx.insert(operatorServiceAccess).values({});}')).toContain("OPERATOR_WRITER_OWNERSHIP");
    expect(probe(owner,'function bypass(){tx.execute(sql`UPDATE operator_service_access SET state=accepted`);}')).toContain("RAW_SUPPORT_WRITE");
    expect(probe(owner,'import {postJournal} from "../ledger"; function respondToCase(){return postJournal(tx,input);}')).toContain("LEDGER_POSTING_BOUNDARY");
  });
  it("pins submerchant, pause/resume and support response endpoints",()=>{
    for(const [command,suffix] of [["createOwnedSubmerchant","submerchants"],["pauseMerchant","pause"],["resumeMerchant","resume"]]){
      const source=`import {${command}} from "@/modules/acquiring/service"; export async function POST(){return ${command}();}`;
      expect(probe(`src/app/api/v1/merchants/[merchantId]/${suffix}/route.ts`,source)).toEqual([]);
      expect(probe(`src/app/api/v1/cardholder-services/[serviceId]/${suffix}/route.ts`,source)).toContain("PARALLEL_MERCHANT_UNIT_ROUTE");
    }
    const support='import {respondToCase} from "@/modules/operations/service"; export async function POST(){return respondToCase();}';
    expect(probe("src/app/api/v1/operations/cases/[caseId]/responses/route.ts",support)).toEqual([]);
    expect(probe("src/app/api/v1/cardholder-services/[serviceId]/cases/[caseId]/responses/route.ts",support)).toContain("PARALLEL_OPERATOR_ROUTE");
  });
});

describe("retired dispute and illustrative data boundaries",()=>{
  it("rejects typed, namespace and raw readers while retaining actual card/support reads",()=>{
    for(const table of ["disputes","disputeTimeline","settlements","workspaceBalances"]) {
      expect(probe(workspace,`import {${table} as old} from "@/platform/database/schema"; function read(){return tx.select().from(old);}`)).toContain("RETIRED_WORKSPACE_TABLE");
      expect(probe(workspace,`import * as db from "@/platform/database/schema"; function read(){return tx.select().from(db.${table});}`)).toContain("RETIRED_WORKSPACE_TABLE");
    }
    expect(probe(workspace,'function read(){return tx.execute(sql`SELECT * FROM dispute_timeline`);}')).toContain("RETIRED_WORKSPACE_TABLE");
    expect(probe(workspace,'import {serviceActivity} from "@/platform/database/schema"; function read(){return tx.select().from(serviceActivity);}')).toEqual([]);
  });
});

describe("financial source ownership mutation probes", () => {
  it("retires direct purchase routes and permits only canonical transactional card writers", () => {
    const route = 'import {purchaseCard as buy} from "@/modules/workspace/service"; export async function POST(){return buy();}';
    expect(probe("src/app/api/v1/cardholder-services/[serviceId]/cards/[cardId]/purchase/route.ts", route)).toContain("RETIRED_SIMULATOR_ROUTE");
    expect(probe("src/app/api/v1/cardholder-services/[serviceId]/cards/[cardId]/spend/route.ts", route)).toContain("RETIRED_SIMULATOR_COMMAND");
    const write = 'import {cards,serviceActivity} from "@/platform/database/schema"; export async function purchaseCardInTransaction(){tx.update(cards).set({version:2});tx.insert(serviceActivity).values({});}';
    expect(probe(workspace, write)).toEqual([]);
    expect(probe("src/modules/issuing/another.ts", write)).toContain("WORKSPACE_WRITER_OWNERSHIP");
  });

  it("accepts the exclusive blocked/issued branches and rejects sequential or copied writes", () => {
    const source = 'import {cardRequests} from "@/platform/database/schema"; export async function submitCardRequest(){await command(async()=>{if(blocked){await tx.update(cardRequests).set({status:"BLOCKED"});return id;}await tx.update(cardRequests).set({status:"ISSUED"});});}';
    expect(probe(workspace, source)).toEqual([]);
    expect(probe(workspace, source.replace("return id;", ""))).toContain("DUPLICATE_CANONICAL_WRITER");
    expect(probe(workspace, source.replace('status:"ISSUED"', 'status:"BLOCKED"'))).toContain("DUPLICATE_CANONICAL_WRITER");
  });

  it("protects journal inserts from aliases, side doors, duplicates and raw SQL", () => {
    const good = 'import {ledgerJournals as journals,ledgerEntries as lines} from "./schema"; export async function postJournal(){tx.insert(journals).values({});tx.insert(lines).values({});}';
    expect(probe(ledger, good)).toEqual([]);
    expect(probe(ledger, good.replace("tx.insert(lines).values({});", "tx.insert(lines).values({});tx.insert(lines).values({});"))).toContain("DUPLICATE_CANONICAL_WRITER");
    expect(probe("src/modules/other/service.ts", 'import * as db from "@/modules/ledger/schema"; function sideDoor(){const {ledgerEntries:rows}=db;tx.insert(rows).values({});}')).toContain("LEDGER_WRITER_OWNERSHIP");
    expect(probe(ledger, 'function sideDoor(){tx.execute(sql`INSERT INTO "public"."ledger_entries" VALUES (1)`);}')).toContain("RAW_FINANCIAL_WRITE");
    expect(probe("src/modules/other/bridge.ts", 'export {ledgerEntries} from "@/modules/ledger/schema";')).toContain("FINANCIAL_TABLE_REEXPORT");
  });

  it("allows only reviewed commands to post and rejects adapter callers outside domain owners", () => {
    expect(probe(workspace, 'import {postJournal} from "../ledger"; export async function purchaseCardInTransaction(){return postJournal(tx,input);}')).toEqual([]);
    expect(probe("src/app/api/money/route.ts", 'import {postJournal as post} from "@/modules/ledger/service"; export async function POST(){return post(tx,input);}')).toContain("LEDGER_POSTING_BOUNDARY");
    expect(probe("src/modules/other/service.ts", 'import {issueSandboxCard} from "@/modules/issuing/sandbox-adapter"; function bypass(){return issueSandboxCard(id);}')).toContain("ISSUING_ADAPTER_BOUNDARY");
    expect(probe("src/app/api/pay/route.ts", 'import {testPayment} from "@/modules/acquiring/adapters/sandbox"; function POST(){return testPayment(id,"APPROVED");}')).toContain("ACQUIRING_ADAPTER_BOUNDARY");
    expect(probe(operations, 'import {testPayment} from "./adapters/sandbox"; export async function recordMerchantSandboxPayment(){return testPayment(id,"APPROVED");}')).toEqual([]);
    expect(probe(operations, 'import {testPayment} from "./adapters/sandbox"; export async function simulateMerchantPayment(){return testPayment(id,"APPROVED");}')).toContain("ACQUIRING_ADAPTER_BOUNDARY");
  });

  it("pins operation tables to each exact command and never allows history mutation", () => {
    const good = 'import {merchantTestPayments as payments} from "./operations-schema"; export async function recordMerchantSandboxPayment(){tx.insert(payments).values({});}';
    expect(probe(operations, good)).toEqual([]);
    expect(probe(operations, good.replace("tx.insert(payments).values({})", "tx.update(payments).set({})"))).toContain("OPERATION_WRITER_OWNERSHIP");
    expect(probe(operations, good.replace("recordMerchantSandboxPayment", "unreviewedPayment"))).toContain("OPERATION_WRITER_OWNERSHIP");
    expect(probe("src/modules/other/service.ts", 'import {testGateways} from "@/modules/acquiring/operations-schema"; function setup(){tx.insert(testGateways).values({});}')).toContain("OPERATION_WRITER_OWNERSHIP");
    expect(probe(operations, 'function bypass(){tx.execute(sql`DELETE FROM merchant_operation_commands`);}')).toContain("RAW_FINANCIAL_WRITE");
  });

  it("checks each operation route's function and method rather than accepting any operations import", () => {
    const cases = [
      ["merchants/[merchantId]/gateway", "PUT", "configureTestGateway"],
      ["merchants/[merchantId]/test-enrollment", "PUT", "enrollTestMerchant"],
      ["merchants/[merchantId]/channels/[channelId]/activation", "PUT", "setChannelActivation"],
      ["operations/deposits/[depositId]", "POST", "processMerchantDeposit"],
      ["merchants/[merchantId]/payments/[paymentId]/refund", "POST", "refundMerchantPayment"],
      ["merchants/[merchantId]/payouts", "POST", "createMerchantPayout"],
      ["merchants/[merchantId]/operations", "GET", "getMerchantOperations"],
    ];
    for (const [route, method, command] of cases) {
      const source = `import {${command} as run} from "@/modules/acquiring/operations-service"; export async function ${method}(){return run();}`;
      expect(probe(`src/app/api/v1/${route}/route.ts`, source)).toEqual([]);
      expect(probe("src/app/api/v1/bypass/route.ts", source)).toContain("PARALLEL_OPERATION_ROUTE");
      expect(probe(`src/app/api/v1/${route}/route.ts`, source.replace(`function ${method}`, "function DELETE"))).toContain("PARALLEL_OPERATION_ROUTE");
    }
  });
});

describe("finite operation and purchase UI mutation probes", () => {
  it("accepts reviewed attempt paths but rejects wrong method, scope, source and retry rewrites", () => {
    const source = '"use client"; export function MerchantOperations(){function confirm(){send({kind:"gateway",path:"/gateway",method:"PUT",body:{}});}function send(command){setAttempt(command);}return <button onClick={()=>send(attempt)}/>;}';
    expect(probe(ui, source)).toEqual([]);
    expect(probe(ui, source.replace('method:"PUT"', 'method:"POST"'))).toContain("OPERATION_UI_ROUTE");
    expect(probe(ui, source.replace('kind:"gateway"', 'target:"service",kind:"gateway"'))).toContain("OPERATION_UI_ROUTE");
    expect(probe(ui, source.replace('path:"/gateway"', 'path:externalPath'))).toContain("OPERATION_UI_ROUTE");
    expect(probe(ui, source.replace("setAttempt(command)", "setAttempt(rewritten)"))).toContain("OPERATION_ATTEMPT_SOURCE");
    expect(probe(ui, source.replace("send(attempt)", "send(rewritten)"))).toContain("OPERATION_ATTEMPT_SOURCE");
  });

  it("requires unchanged service/unit identity and all saved attempt fields in the forwarding wrapper", () => {
    const source = '"use client"; import {merchantCommand} from "./primitives"; export function MerchantOperations(){async function send(command){return await merchantCommand(merchant.id,command.path,command.method,command.body);}}';
    expect(probe(ui, source)).toEqual([]);
    for (const changed of [source.replace("merchant.id", "other.id"), source.replace("command.path", '"/bypass"'), source.replace("command.body", "otherBody"), source.replace("merchant.id", "operations.serviceId")]) expect(probe(ui, changed)).toContain("OPERATION_COMMAND_FORWARDING");
  });

  it("pins checkout and card purchase to their original form and exact route", () => {
    const checkout = '"use client"; import {merchantCommand} from "./primitives"; export function MerchantCheckout(){async function pay(input){return merchantCommand(workspace.merchant.id,`/channels/${channel.id}/test-payments`,"POST",input);}}';
    expect(probe(ui, checkout)).toContain("RETIRED_SIMULATOR_UI");
    expect(probe("src/ui/workspace/another-checkout.tsx", checkout)).toContain("PARALLEL_OPERATION_UI");
    expect(probe(ui, checkout.replace('"POST"', '"PUT"'))).toContain("PARALLEL_OPERATION_UI");
    const card = '"use client"; function CardPurchaseForm(){async function purchase(){return command(`/cards/${card.id}/purchase`,"POST",{});}}';
    expect(probe("src/ui/workspace/cards.tsx", card)).toContain("RETIRED_SIMULATOR_UI");
    expect(probe("src/ui/another-purchase.tsx", card)).toContain("PARALLEL_CARD_PURCHASE_UI");
  });
});


describe("prepaid review, funding and settlement ownership",()=>{
 it("binds every connected checkout route to its exact method and owner",()=>{
  for(const [command,suffix,method] of [["prepareCardCheckout","card","POST"],["getCardCheckoutReview","card/[attemptId]","GET"],["confirmCardCheckout","card/[attemptId]","POST"]]){
   const source=`import {${command}} from "@/modules/acquiring/card-checkout-service";export async function ${method}(){return ${command}();}`;
   expect(probe(`src/app/api/v1/checkout/[publicationId]/${suffix}/route.ts`,source)).toEqual([]);
   expect(probe("src/app/api/v1/bypass/route.ts",source)).toContain("PARALLEL_CONNECTED_ROUTE");
   expect(probe(`src/app/api/v1/checkout/[publicationId]/${suffix}/route.ts`,source.replace(`function ${method}`,"function DELETE"))).toContain("PARALLEL_CONNECTED_ROUTE");
  }
 });
 it("allows one explicit funding owner and rejects issuance funding or a direct HTTP top-up",()=>{
  const funding='import {cardholderTopups} from "./funding-schema";export async function addCardholderFunds(){tx.insert(cardholderTopups).values({});}';
  expect(probe(workspace,funding)).toEqual([]);
  expect(probe(workspace,funding.replace("addCardholderFunds","submitCardRequest"))).toContain("FUNDING_WRITER_OWNERSHIP");
  expect(probe(workspace,'import {postJournal} from "../ledger";function submitCardRequest(){postJournal(tx,input);}')).toContain("LEDGER_POSTING_BOUNDARY");
  const direct='import {addCardholderFunds} from "@/modules/workspace/service";export async function POST(){addCardholderFunds();}';
  expect(probe("src/app/api/v1/add-money/route.ts",direct)).toContain("FUNDING_CONFIRMATION_BOUNDARY");
 });
 it("makes exact deposit snapshots and event writes exclusive and immutable",()=>{
  for(const [table,owner] of [["merchantDeposits","createMerchantPayout"],["merchantDepositItems","createMerchantPayout"],["merchantDepositEvents","processMerchantDeposit"]]){
   const source=`import {${table}} from "./settlement-schema";export async function ${owner}(){tx.insert(${table}).values({});}`;
   expect(probe(operations,source)).toEqual([]);
   expect(probe(operations,source.replace('tx.insert','tx.update'))).toContain("SETTLEMENT_WRITER_OWNERSHIP");
   expect(probe("src/modules/other/service.ts",source.replace('./settlement-schema','@/modules/acquiring/settlement-schema'))).toContain("SETTLEMENT_WRITER_OWNERSHIP");
  }
 });
});

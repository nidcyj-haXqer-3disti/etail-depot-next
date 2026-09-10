import { createHash, randomUUID } from "node:crypto";
import { and, asc, desc, eq, ilike, or, sql } from "drizzle-orm";
import type { z } from "zod";
import { getDb } from "../../platform/database/client";
import { serviceActivity, cards } from "../../platform/database/schema";
import { requireSandboxParticipant } from "../sandbox/service";
import { SecurityError } from "../../platform/security/origin";
import { loadServiceScope, type ScopedTransaction } from "../access/scope";
import { evaluate } from "../policy/evaluate";
import { canReadCardholderActivity } from "../workspace/service";
import { supportCases, supportCaseMessages, supportCaseCommands } from "./schema";
import { createSupportCaseSchema, addSupportMessageSchema, withdrawSupportCaseSchema, supportCaseQuerySchema, type CreateSupportCaseCommand, type AddSupportMessageCommand, type WithdrawSupportCaseCommand, type SupportCaseQuery, type SupportCaseSummary, type SupportCaseDetail, type SupportCaseList } from "./contracts";

type Scope = Awaited<ReturnType<typeof loadServiceScope>>;
type CaseRow = typeof supportCases.$inferSelect;
async function supportScope(tx:ScopedTransaction,personId:string,serviceId:string,write=false) {
  try {await requireSandboxParticipant(tx,personId);}catch(error){if(error instanceof SecurityError)throw new SecurityError("SUPPORT_UNAVAILABLE",404);throw error;}
  const scope=await loadServiceScope(tx,personId,serviceId,write);
  if(scope.service.kind!=="CARDHOLDER")throw new SecurityError("SUPPORT_UNAVAILABLE",404);
  return scope;
}

function validate<T>(schema:z.ZodType<T>,input:unknown):T {const result=schema.safeParse(input);if(!result.success)throw new SecurityError("INVALID_REQUEST",422);return result.data;}
function requireAction(scope:Scope,action:string) {if(!evaluate(scope.policy,action).allowed)throw new SecurityError("ACTION_DENIED",403);}
const ownerWhere=(personId:string,serviceId:string) => and(eq(supportCases.serviceId,serviceId),eq(supportCases.creatorId,personId));
function summary(row:CaseRow,scope:Scope):SupportCaseSummary {return {id:row.id,serviceId:row.serviceId,reference:row.reference,topic:row.topic,subject:row.subject,status:row.status,version:row.version,createdAt:row.createdAt.toISOString(),updatedAt:row.updatedAt.toISOString(),canUpdate:row.status==="OPEN"&&evaluate(scope.policy,"support.cases.manage").allowed,nextActor:row.status==="OPEN"?"SUPPORT":"NONE",delivery:"SANDBOX_SUPPORT",privacy:"CUSTOMER_AND_ASSIGNED_SUPPORT"};}
async function ownedCase(tx:ScopedTransaction,personId:string,serviceId:string,id:string,write=false) {
  const query=tx.select().from(supportCases).where(and(ownerWhere(personId,serviceId),eq(supportCases.id,id)));
  const [row]=write?await query.for("update"):await query;
  if(!row)throw new SecurityError("RESOURCE_UNAVAILABLE",404);return row;
}
async function detail(tx:ScopedTransaction,scope:Scope,row:CaseRow):Promise<SupportCaseDetail> {
  const messages=await tx.select().from(supportCaseMessages).where(and(eq(supportCaseMessages.caseId,row.id),eq(supportCaseMessages.creatorId,row.creatorId),eq(supportCaseMessages.serviceId,row.serviceId))).orderBy(asc(supportCaseMessages.sequence));
  let transaction:SupportCaseDetail["transaction"]=null;
  if(row.transactionId&&evaluate(scope.policy,"activity.read").allowed) {
    const [activity]=await tx.select({id:serviceActivity.id,title:serviceActivity.title,cardId:serviceActivity.cardId,holderId:cards.holderId}).from(serviceActivity).leftJoin(cards,and(eq(cards.id,serviceActivity.cardId),eq(cards.serviceId,serviceActivity.serviceId))).where(and(eq(serviceActivity.id,row.transactionId),eq(serviceActivity.serviceId,row.serviceId)));
    if(activity&&canReadCardholderActivity(scope.policy,activity))transaction={id:activity.id,title:activity.title};
  }
  return {...summary(row,scope),transaction,transactionUnavailable:Boolean(row.transactionId&&!transaction),messages:messages.map(item=>({id:item.id,kind:item.kind,body:item.body,sequence:item.sequence,createdAt:item.createdAt.toISOString(),author:item.authorKind === "SUPPORT" ? "SUPPORT" : "YOU"}))};
}
export async function listSupportCases(personId:string,serviceId:string,raw:SupportCaseQuery):Promise<SupportCaseList> {
  const query=validate(supportCaseQuerySchema,raw);
  return getDb().transaction(async tx=>{
    const scope=await supportScope(tx,personId,serviceId);requireAction(scope,"support.cases.read");
    if(query.cursor)await ownedCase(tx,personId,serviceId,query.cursor);
    const needle=`%${query.q.replace(/[\\%_]/g,"\\$&")}%`;
    const rows=await tx.select().from(supportCases).where(and(ownerWhere(personId,serviceId),query.status?eq(supportCases.status,query.status):undefined,query.q?or(ilike(supportCases.subject,needle),ilike(supportCases.reference,needle)):undefined,
      query.cursor?sql`(${supportCases.createdAt},${supportCases.id}) < (select "createdAt", id from support_cases where id=${query.cursor})`:undefined)).orderBy(desc(supportCases.createdAt),desc(supportCases.id)).limit(26);
    const page=rows.slice(0,25);
    return {cases:page.map(row=>summary(row,scope)),nextCursor:rows.length>25?page.at(-1)!.id:null,canCreate:evaluate(scope.policy,"support.cases.manage").allowed};
  });
}
export async function getSupportCase(personId:string,serviceId:string,id:string):Promise<SupportCaseDetail> {
  return getDb().transaction(async tx=>{const scope=await supportScope(tx,personId,serviceId);requireAction(scope,"support.cases.read");return detail(tx,scope,await ownedCase(tx,personId,serviceId,id));});
}
async function execute<T extends {commandId:string}>(personId:string,serviceId:string,kind:string,targetId:string|null,input:T,mutate:(tx:ScopedTransaction,scope:Scope)=>Promise<CaseRow>):Promise<SupportCaseDetail> {
  return getDb().transaction(async tx=>{
    const scope=await supportScope(tx,personId,serviceId,true);requireAction(scope,"support.cases.manage");
    await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${"support-command:"+input.commandId},0))`);
    const digest=createHash("sha256").update(JSON.stringify({kind,targetId,input})).digest("hex");
    const [receipt]=await tx.select().from(supportCaseCommands).where(eq(supportCaseCommands.commandId,input.commandId));
    if(receipt) {
      if(receipt.serviceId!==serviceId||receipt.creatorId!==personId||receipt.kind!==kind||receipt.digest!==digest)throw new SecurityError("IDEMPOTENCY_CONFLICT",409);
      return detail(tx,scope,await ownedCase(tx,personId,serviceId,receipt.caseId));
    }
    const row=await mutate(tx,scope);
    await tx.insert(supportCaseCommands).values({commandId:input.commandId,caseId:row.id,serviceId,creatorId:personId,kind,digest});
    return detail(tx,scope,row);
  });
}
export async function createSupportCase(personId:string,serviceId:string,raw:CreateSupportCaseCommand) {
  const input=validate(createSupportCaseSchema,raw);
  return execute(personId,serviceId,"create",null,input,async(tx,scope)=>{
    if(input.transactionId) {
      requireAction(scope,"activity.read");
      const [transaction]=await tx.select({id:serviceActivity.id,cardId:serviceActivity.cardId,holderId:cards.holderId}).from(serviceActivity).leftJoin(cards,and(eq(cards.id,serviceActivity.cardId),eq(cards.serviceId,serviceActivity.serviceId))).where(and(eq(serviceActivity.id,input.transactionId),eq(serviceActivity.serviceId,serviceId))).for("share",{of:serviceActivity});
      if(!transaction||!canReadCardholderActivity(scope.policy,transaction))throw new SecurityError("RESOURCE_UNAVAILABLE",404);
    }
    const id=randomUUID();
    const [row]=await tx.insert(supportCases).values({id,serviceId,creatorId:personId,transactionId:input.transactionId,topic:input.topic,subject:input.subject,reference:`CASE-${id.toUpperCase()}`}).returning();
    await tx.insert(supportCaseMessages).values({caseId:id,serviceId,creatorId:personId,authorId:personId,authorKind:"CUSTOMER",kind:"OPENED",body:input.message,sequence:1});
    return row!;
  });
}
export async function addSupportMessage(personId:string,serviceId:string,id:string,raw:AddSupportMessageCommand) {
  const input=validate(addSupportMessageSchema,raw);
  return execute(personId,serviceId,"message",id,input,async tx=>{
    const row=await ownedCase(tx,personId,serviceId,id,true);
    if(row.version!==input.expectedVersion)throw new SecurityError("STALE_VERSION",409);
    if(row.status!=="OPEN")throw new SecurityError("INVALID_STATE",422);
    if(row.version>=100)throw new SecurityError("MESSAGE_LIMIT_REACHED",422);
    const [updated]=await tx.update(supportCases).set({version:row.version+1,updatedAt:sql`clock_timestamp()`}).where(eq(supportCases.id,id)).returning();
    await tx.insert(supportCaseMessages).values({caseId:id,serviceId,creatorId:personId,authorId:personId,authorKind:"CUSTOMER",kind:"MESSAGE",body:input.message,sequence:updated!.version});
    return updated!;
  });
}
export async function withdrawSupportCase(personId:string,serviceId:string,id:string,raw:WithdrawSupportCaseCommand) {
  const input=validate(withdrawSupportCaseSchema,raw);
  return execute(personId,serviceId,"withdraw",id,input,async tx=>{
    const row=await ownedCase(tx,personId,serviceId,id,true);
    if(row.version!==input.expectedVersion)throw new SecurityError("STALE_VERSION",409);
    if(row.status!=="OPEN")throw new SecurityError("INVALID_STATE",422);
    const [updated]=await tx.update(supportCases).set({status:"WITHDRAWN",version:row.version+1,updatedAt:sql`clock_timestamp()`}).where(eq(supportCases.id,id)).returning();
    await tx.insert(supportCaseMessages).values({caseId:id,serviceId,creatorId:personId,authorId:personId,authorKind:"CUSTOMER",kind:"WITHDRAWN",body:input.reason,sequence:updated!.version});
    return updated!;
  });
}

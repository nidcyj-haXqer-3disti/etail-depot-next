import { createHash } from "node:crypto";
import { and, eq, sql } from "drizzle-orm";
import { getDb } from "../../platform/database/client";
import { services, serviceMembers, identityBindings, people, eventOutbox, cards, permissionGrants, cardholderCreationCommands } from "../../platform/database/schema";
import { SecurityError } from "../../platform/security/origin";
import { ACTIONS, evaluate, type ServiceKind, type Role } from "../policy/evaluate";
import {cardholderRole, type CardholderRole} from "../policy/cardholder-scope";
import { loadServiceScope,type ScopedTransaction } from "../access/scope";
import { requireMerchantApplicant } from "./merchant-eligibility";
import {createCardholderServiceSchema,type CreateCardholderServiceInput,type CreatedCardholderService} from "./cardholder-contracts";
import {attachServiceMoneyAccount,lockMoneyAccount} from "../money/service";
export interface ServiceSummary {id:string;kind:ServiceKind;primaryPersonId:string;displayName:string;role:Role;status:string;version:number;cardholderRole:CardholderRole}
export interface ServiceProjection extends ServiceSummary {capabilities:ReturnType<typeof evaluate>[];peopleCount:number|null}
/** Binding identity never enrolls someone in a service. */
export async function bindIdentity(issuer:string,subject:string,displayName="New member") {
 if(!issuer||!subject)throw new SecurityError("INVALID_VERIFIED_IDENTITY",422);
 return getDb().transaction(async tx=>{
  await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${issuer+":"+subject},0))`);
  const [existing]=await tx.select().from(identityBindings).where(and(eq(identityBindings.issuer,issuer),eq(identityBindings.subject,subject)));
  if(existing)return {identityId:existing.id,personId:existing.personId};
  const [person]=await tx.insert(people).values({displayName}).returning();
  const [identity]=await tx.insert(identityBindings).values({personId:person!.id,issuer,subject}).returning();
  await tx.insert(eventOutbox).values({businessKey:`identity-bound:${identity!.id}`,kind:"identity.bound",aggregateId:identity!.id});
  return {identityId:identity!.id,personId:person!.id};
 });
}
export const PRIMARY_CARDHOLDER_PERMISSIONS=["cardholder.funds.read","cardholder.funds.add","cardholder.limits.manage","cards.read","cards.hold","cards.request","cards.create","cards.purchase","cards.freeze","cards.unfreeze","cards.manageMembers","activity.read","people.read","people.invite","people.changeRole","people.revoke","notifications.manage"] as const;
/** Sole enrollment writer for a primary Cardholder service. No card or money is created here. */
export async function createCardholderService(personId:string,raw:CreateCardholderServiceInput):Promise<CreatedCardholderService> {
 const parsed=createCardholderServiceSchema.safeParse(raw);if(!parsed.success)throw new SecurityError("INVALID_REQUEST",422);const input=parsed.data;
 const digest=createHash("sha256").update(JSON.stringify({personId,displayName:input.displayName,...(input.moneyAccountId?{moneyAccountId:input.moneyAccountId}:{})})).digest("hex");
 return getDb().transaction(async tx=>{
  if(input.moneyAccountId)await lockMoneyAccount(tx,input.moneyAccountId);
  await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${"cardholder-enrollment:"+personId},0))`);
  await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${"cardholder-command:"+input.commandId},0))`);
  await requireMerchantApplicant(tx,personId);
  const [receipt]=await tx.select().from(cardholderCreationCommands).where(eq(cardholderCreationCommands.commandId,input.commandId));
  if(receipt){
   if(receipt.actorId!==personId||receipt.digest!==digest)throw new SecurityError("IDEMPOTENCY_CONFLICT",409);
   const current=await loadServiceScope(tx,personId,receipt.serviceId,true);
   if(cardholderRole(current.policy)!=="OWNER")throw new SecurityError("ACTION_DENIED",403);
   return {serviceId:receipt.serviceId,kind:"CARDHOLDER",nextHref:"/cardholder-services"};
  }
  const [existing]=await tx.select().from(services).where(and(eq(services.kind,"CARDHOLDER"),eq(services.primaryPersonId,personId)));
  if(existing)throw new SecurityError("CARDHOLDER_SERVICE_EXISTS",409);
  const [service]=await tx.insert(services).values({kind:"CARDHOLDER",primaryPersonId:personId,displayName:input.displayName,status:"ACTIVE"}).returning();
  await attachServiceMoneyAccount(tx,service!.id,personId,"CARDHOLDER",input.displayName,input.moneyAccountId);
  await tx.insert(serviceMembers).values({serviceId:service!.id,personId,state:"ACCEPTED"});
  await tx.insert(permissionGrants).values(PRIMARY_CARDHOLDER_PERMISSIONS.map(action=>({serviceId:service!.id,personId,action,delegable:true})));
  await tx.insert(cardholderCreationCommands).values({commandId:input.commandId,actorId:personId,serviceId:service!.id,digest});
  await tx.insert(eventOutbox).values({businessKey:`cardholder-service-created:${service!.id}`,kind:"cardholder.service.created",aggregateId:service!.id});
  return {serviceId:service!.id,kind:"CARDHOLDER",nextHref:"/cardholder-services"};
 });
}
function summary(scope:Awaited<ReturnType<typeof loadServiceScope>>):ServiceSummary {
 const {service,membership,policy}=scope;return {id:service.id,kind:service.kind,primaryPersonId:service.primaryPersonId,displayName:service.displayName,role:membership.role,status:service.status,version:service.version,cardholderRole:cardholderRole(policy)};
}
export async function getCardholderContextPolicies(tx:ScopedTransaction,personId:string) {
 const rows=await tx.select({id:services.id}).from(serviceMembers).innerJoin(services,eq(services.id,serviceMembers.serviceId)).where(and(eq(serviceMembers.personId,personId),eq(serviceMembers.state,"ACCEPTED"),eq(services.kind,"CARDHOLDER"))).orderBy(services.id);
 const result=[];for(const row of rows)try{const scope=await loadServiceScope(tx,personId,row.id);if(cardholderRole(scope.policy)!=="NONE")result.push({serviceId:row.id,primaryPersonId:scope.service.primaryPersonId,policy:scope.policy});}catch(error){if(!(error instanceof SecurityError&&[403,404].includes(error.status)))throw error;}return result;
}
export async function listServicesForPersonInTransaction(tx:ScopedTransaction,personId:string):Promise<ServiceSummary[]> {
 const rows=await tx.select({serviceId:serviceMembers.serviceId}).from(serviceMembers).where(and(eq(serviceMembers.personId,personId),eq(serviceMembers.state,"ACCEPTED"))).orderBy(serviceMembers.serviceId);
 const result:ServiceSummary[]=[];for(const row of rows)try{result.push(summary(await loadServiceScope(tx,personId,row.serviceId)));}catch(error){if(!(error instanceof SecurityError&&[403,404].includes(error.status)))throw error;}return result;
}
export async function listServicesForPerson(personId:string):Promise<ServiceSummary[]>{return getDb().transaction(tx=>listServicesForPersonInTransaction(tx,personId));}
export interface CardholderDirectoryEntry {id:string;displayName:string;cardholderRole:CardholderRole;cards:{id:string;nickname:string;lastFour:string;relationship:"OWNER"|"CARDHOLDER"}[]}
export async function getCardholderDirectory(personId:string):Promise<CardholderDirectoryEntry[]> {
 return getDb().transaction(async tx=>{
  const result:CardholderDirectoryEntry[]=[];
  for(const context of await getCardholderContextPolicies(tx,personId)){
   const scope=await loadServiceScope(tx,personId,context.serviceId),role=cardholderRole(scope.policy);
   const rows=evaluate(scope.policy,"cards.read").allowed?await tx.select().from(cards).where(and(eq(cards.serviceId,context.serviceId),role==="OWNER"?undefined:eq(cards.holderId,personId))).orderBy(cards.nickname,cards.id).limit(3):[];
   result.push({id:context.serviceId,displayName:scope.service.displayName,cardholderRole:role,cards:rows.map(card=>({id:card.id,nickname:card.nickname,lastFour:card.lastFour,relationship:card.holderId===scope.service.primaryPersonId?"OWNER":"CARDHOLDER"}))});
  }return result;
 });
}
export async function getServiceForPerson(personId:string,serviceId:string):Promise<ServiceProjection>{
 return getDb().transaction(async tx=>{
  const scope=await loadServiceScope(tx,personId,serviceId),capabilities=ACTIONS.map(action=>evaluate(scope.policy,action));
  const members=evaluate(scope.policy,"people.read").allowed?await tx.select().from(serviceMembers).where(and(eq(serviceMembers.serviceId,serviceId),eq(serviceMembers.state,"ACCEPTED"))):null;
  return {...summary(scope),capabilities,peopleCount:members?.length??null};
 });
}

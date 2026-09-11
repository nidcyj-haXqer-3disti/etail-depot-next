import { createHash, randomUUID } from "node:crypto";
import { and, desc, eq, sql } from "drizzle-orm";
import type { z } from "zod";
import { getDb } from "../../platform/database/client";
import { serviceMembers, people, permissionGrants, cards, cardRequests, serviceActivity, notificationPreferences, workspaceCommands } from "../../platform/database/schema";
import { SecurityError } from "../../platform/security/origin";
import { ACTIONS, evaluate, type PolicyScope } from "../policy/evaluate";
import { cardholderRole, canReadCardholderData, isCardholderPermission } from "../policy/cardholder-scope";
import { loadServiceScope } from "../access/scope";
import { requireServiceReader } from "../services/service-reader";
import { requireSandboxAdult, requireSandboxParticipant, sandboxPersona } from "../sandbox/service";
import { getBalance, postJournal } from "../ledger";
import { ledgerJournals } from "../ledger/schema";
import { issueSandboxCard } from "../issuing/sandbox-adapter";
import { listServicesForPersonInTransaction } from "../services/service";
import {cardholderFundingIntents,cardholderTopups,cardholderSpendingLimits,cardholderLimitChanges} from "./funding-schema";
import {readPersonSpending} from "./funding-reader";
import {topupCommandSchema,spendingLimitCommandSchema,type TopupCommand,type SpendingLimitCommand,type FundingIntent,type TopupReceipt,type CardholderFunds,type PersonSpending} from "./funding-contracts";
import { cardControlCommandSchema, cardPurchaseCommandSchema, startCardRequestSchema, cardDraftCommandSchema, versionedCommandSchema, notificationCommandSchema, type Money, type WorkspaceProjection, type WorkspaceCard, type WorkspaceActivity, type CardRequestProjection, type NotificationPreferences, type CardControlCommand, type CardPurchaseCommand, type CardPurchaseResult, type StartCardRequestCommand, type CardDraftCommand, type VersionedCommand, type NotificationCommand } from "./contracts";

type Transaction = Parameters<Parameters<ReturnType<typeof getDb>["transaction"]>[0]>[0];
type Scope = Awaited<ReturnType<typeof loadServiceScope>> & { actor: typeof people.$inferSelect };

export function formatMoney(minor: bigint): Money {
  const magnitude = minor < 0n ? -minor : minor;
  const dollars = (magnitude / 100n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return { minor: minor.toString(), currency: "USD", formatted: `${minor < 0n ? "-" : ""}$${dollars}.${(magnitude % 100n).toString().padStart(2, "0")}` };
}

function spendingProjection(row:Awaited<ReturnType<typeof readPersonSpending>>):PersonSpending {
 return {personId:row.personId,monthlyLimit:formatMoney(row.monthlyLimit),spentThisMonth:formatMoney(row.spent),remainingThisMonth:formatMoney(row.remaining),available:formatMoney(row.available),version:row.version,periodStart:row.start.toISOString(),periodEnd:row.end.toISOString(),timeZone:"UTC"};
}
function requireFundingPrimary(scope:Scope,action:string){
 if(scope.service.kind!=="CARDHOLDER"||scope.service.primaryPersonId!==scope.actor.id)throw new SecurityError("ACTION_DENIED",403);
 requireAction(scope,action);
}
function topupProjection(row:typeof cardholderTopups.$inferSelect):TopupReceipt {
 return {id:row.id,serviceId:row.serviceId,amount:formatMoney(row.amountMinor),source:"SANDBOX_BANK",sourceLabel:"Sandbox bank",status:"COMPLETED",createdAt:row.createdAt.toISOString(),reference:`ADD-${row.id.slice(0,8).toUpperCase()}`};
}
export async function getCardholderFunds(personId:string,serviceId:string,page=0):Promise<CardholderFunds>{
 if(!Number.isInteger(page)||page<0||page>10000)throw new SecurityError("INVALID_REQUEST",422);
 return getDb().transaction(async tx=>{
  const scope=await loadScope(tx,personId,serviceId);requireFundingPrimary(scope,"cardholder.funds.read");
  const now=await databaseNow(tx),members=permits(scope,"people.read")&&permits(scope,"cards.read")?await peopleInService(tx,serviceId):[];
  const topups=await tx.select().from(cardholderTopups).where(eq(cardholderTopups.serviceId,serviceId)).orderBy(desc(cardholderTopups.createdAt),cardholderTopups.id).limit(101).offset(page*100);
  const result:CardholderFunds={serviceId,serviceName:scope.service.displayName,available:formatMoney(await getBalance(tx,{serviceId,bucket:"GROUP_AVAILABLE"})),source:"SANDBOX_BANK",sourceLabel:"Sandbox bank",topups:topups.slice(0,100).map(topupProjection),page,hasMore:topups.length>100,people:[]};
  for(const {person,membership} of members)if(membership.state==="ACCEPTED")result.people.push({id:person.id,name:person.displayName,spending:spendingProjection(await readPersonSpending(tx,serviceId,person.id,now))});
  return result;
 },{isolationLevel:"repeatable read"});
}
export async function getCardholderTopup(personId:string,serviceId:string,topupId:string):Promise<TopupReceipt>{
 return getDb().transaction(async tx=>{
  const scope=await loadScope(tx,personId,serviceId);requireFundingPrimary(scope,"cardholder.funds.read");
  const [row]=await tx.select().from(cardholderTopups).where(and(eq(cardholderTopups.serviceId,serviceId),eq(cardholderTopups.id,topupId)));
  if(!row)throw new SecurityError("RESOURCE_UNAVAILABLE",404);return topupProjection(row);
 });
}
export async function addCardholderFunds(personId:string,serviceId:string,raw:TopupCommand):Promise<TopupReceipt>{
 const input=validate(topupCommandSchema,raw);
 const id=await command(personId,serviceId,"funds.add","cardholder.funds.add",null,input,async tx=>{
  const id=input.commandId,now=await databaseNow(tx),amount=BigInt(input.amountMinor);
  const journalId=await postJournal(tx,{businessKey:`group-funding:${input.commandId}`,kind:"GROUP_FUNDING",referenceId:id,occurredAt:now,lines:[{serviceId,bucket:"PRACTICE_SOURCE",deltaMinor:-amount},{serviceId,bucket:"GROUP_AVAILABLE",deltaMinor:amount}]});
  await tx.insert(cardholderTopups).values({id,serviceId,actorId:personId,amountMinor:amount,journalId,createdAt:now});return id;
 },async(tx,scope)=>{requireFundingPrimary(scope,"cardholder.funds.add");requireAction(scope,"cardholder.funds.read");await requireAdultCreator(tx,scope);});
 return getCardholderTopup(personId,serviceId,id);
}
export async function prepareCardholderFunding(personId:string,serviceId:string,raw:TopupCommand):Promise<FundingIntent>{
 const input=validate(topupCommandSchema,raw);
 const id=await command(personId,serviceId,"funds.prepare","cardholder.funds.add",null,input,async tx=>{
  await tx.insert(cardholderFundingIntents).values({id:input.commandId,serviceId,actorId:personId,amountMinor:BigInt(input.amountMinor),confirmCommandId:randomUUID(),createdAt:await databaseNow(tx)});return input.commandId;
 },async(tx,scope)=>{requireFundingPrimary(scope,"cardholder.funds.add");requireAction(scope,"cardholder.funds.read");await requireAdultCreator(tx,scope);});
 return getCardholderFundingIntent(personId,serviceId,id);
}
export async function getCardholderFundingIntent(personId:string,serviceId:string,intentId:string):Promise<FundingIntent>{
 return getDb().transaction(async tx=>{
  const scope=await loadScope(tx,personId,serviceId);requireFundingPrimary(scope,"cardholder.funds.read");
  const [row]=await tx.select().from(cardholderFundingIntents).where(and(eq(cardholderFundingIntents.id,intentId),eq(cardholderFundingIntents.serviceId,serviceId),eq(cardholderFundingIntents.actorId,personId)));
  if(!row)throw new SecurityError("RESOURCE_UNAVAILABLE",404);
  const [receipt]=await tx.select().from(cardholderTopups).where(and(eq(cardholderTopups.id,row.confirmCommandId),eq(cardholderTopups.serviceId,serviceId)));
  return {id:row.id,serviceId,amount:formatMoney(row.amountMinor),sourceLabel:"Sandbox bank",createdAt:row.createdAt.toISOString(),receipt:receipt?topupProjection(receipt):null};
 });
}
export async function confirmCardholderFunding(personId:string,serviceId:string,intentId:string):Promise<TopupReceipt>{
 const input=await getDb().transaction(async tx=>{
  const scope=await loadScope(tx,personId,serviceId);requireFundingPrimary(scope,"cardholder.funds.add");
  const [row]=await tx.select().from(cardholderFundingIntents).where(and(eq(cardholderFundingIntents.id,intentId),eq(cardholderFundingIntents.serviceId,serviceId),eq(cardholderFundingIntents.actorId,personId)));
  if(!row)throw new SecurityError("RESOURCE_UNAVAILABLE",404);
  return {commandId:row.confirmCommandId,amountMinor:row.amountMinor.toString(),currency:"USD" as const,source:"SANDBOX_BANK" as const};
 });
 return addCardholderFunds(personId,serviceId,input);
}
export async function getPersonSpending(personId:string,serviceId:string,holderId:string):Promise<PersonSpending>{
 return getDb().transaction(async tx=>{
  const scope=await loadScope(tx,personId,serviceId);requireAction(scope,"cards.read");
  if(!canReadCardholderData(scope.policy,holderId))throw new SecurityError("RESOURCE_UNAVAILABLE",404);
  const [member]=await tx.select().from(serviceMembers).where(and(eq(serviceMembers.serviceId,serviceId),eq(serviceMembers.personId,holderId),eq(serviceMembers.state,"ACCEPTED")));
  if(!member)throw new SecurityError("RESOURCE_UNAVAILABLE",404);
  return spendingProjection(await readPersonSpending(tx,serviceId,holderId,await databaseNow(tx)));
 });
}
export async function setCardholderSpendingLimit(personId:string,serviceId:string,holderId:string,raw:SpendingLimitCommand):Promise<PersonSpending>{
 const input=validate(spendingLimitCommandSchema,raw);
 await command(personId,serviceId,"spending-limit.set","cardholder.limits.manage",holderId,input,async tx=>{
  const [previous]=await tx.select().from(cardholderSpendingLimits).where(and(eq(cardholderSpendingLimits.serviceId,serviceId),eq(cardholderSpendingLimits.personId,holderId))).for("update");
  requireVersion(previous?.version??0,input.expectedVersion);
  const now=await databaseNow(tx),version=(previous?.version??0)+1,monthlyLimitMinor=BigInt(input.monthlyLimitMinor);
  if(previous)await tx.update(cardholderSpendingLimits).set({monthlyLimitMinor,version,updatedBy:personId,updatedAt:now}).where(and(eq(cardholderSpendingLimits.serviceId,serviceId),eq(cardholderSpendingLimits.personId,holderId)));else await tx.insert(cardholderSpendingLimits).values({serviceId,personId:holderId,monthlyLimitMinor,version,updatedBy:personId,updatedAt:now});
  await tx.insert(cardholderLimitChanges).values({serviceId,personId:holderId,actorId:personId,previousMinor:previous?.monthlyLimitMinor??0n,monthlyLimitMinor,version,createdAt:now});
  return holderId;
 },async(tx,scope)=>{requireFundingPrimary(scope,"cardholder.limits.manage");requireAction(scope,"cards.read");await requireHolder(tx,serviceId,holderId);});
 return getPersonSpending(personId,serviceId,holderId);
}

export async function loadCardholderWorkspaceScope(tx: Transaction, personId: string, serviceId: string, mutation = false): Promise<Scope> {
  if (mutation) {
    try { await requireSandboxParticipant(tx, personId); }
    catch (error) { if (error instanceof SecurityError) throw new SecurityError("WORKSPACE_UNAVAILABLE", 404); throw error; }
  } else await requireServiceReader(tx, personId);
  const scope = await loadServiceScope(tx, personId, serviceId, mutation);
  const [actor] = await tx.select().from(people).where(eq(people.id, personId));
  if (!actor) throw new SecurityError("SERVICE_UNAVAILABLE", 404);
  // A newly created service has no historical samples. Its empty projection remains usable
  // for setup without inserting made-up money, cards, services or activity.
  return { ...scope, actor };
}
const loadScope=loadCardholderWorkspaceScope;
function permits(scope: Scope, action: string) { return evaluate(scope.policy, action).allowed; }
function requireAction(scope: Scope, action: string) { if (!permits(scope, action)) throw new SecurityError("ACTION_DENIED", 403); }
function requireVersion(actual: number, expected: number) { if (actual !== expected) throw new SecurityError("STALE_VERSION", 409); }
function validate<T>(schema: z.ZodType<T>, input: unknown): T {
  const parsed = schema.safeParse(input);
  if (!parsed.success) throw new SecurityError("INVALID_REQUEST", 422);
  return parsed.data;
}

function canManageHolder(scope: Scope, holderId: string) {
  return canReadCardholderData(scope.policy, holderId) && (holderId === scope.actor.id || permits(scope, "cards.manageMembers"));
}
function requireManageHolder(scope: Scope, holderId: string) {
  if (!canManageHolder(scope, holderId)) throw new SecurityError("ACTION_DENIED", 403);
}
async function holderReadiness(tx: Transaction, serviceId: string, holderId: string, lock = false) {
  const membershipQuery = tx.select().from(serviceMembers).where(and(eq(serviceMembers.serviceId, serviceId), eq(serviceMembers.personId, holderId)));
  const grantQuery = tx.select().from(permissionGrants).where(and(eq(permissionGrants.serviceId, serviceId), eq(permissionGrants.personId, holderId), eq(permissionGrants.action, "cards.hold"), eq(permissionGrants.state, "ACCEPTED")));
  const [membership] = lock ? await membershipQuery.for("share") : await membershipQuery;
  const [grant] = lock ? await grantQuery.for("share") : await grantQuery;
  const persona = await sandboxPersona(tx, holderId);
  return { allowed: membership?.state === "ACCEPTED" && Boolean(grant), persona };
}
async function requireAdultCreator(tx: Transaction, scope: Scope) {
  if (await sandboxPersona(tx, scope.actor.id) !== "FICTIONAL_ADULT") throw new SecurityError("CARD_APPLICANT_REQUIRED", 403);
  await requireSandboxAdult(tx, scope.actor.id);
}
async function requestPrerequisites(tx: Transaction, scope: Scope, row: typeof cardRequests.$inferSelect) {
  const result: CardRequestProjection["prerequisites"] = [];
  if (!permits(scope, "cards.create")) result.push({ code: "CARD_CREATE_PERMISSION_REQUIRED", title: "Card creation permission is required", detail: "You can save this request, but you need permission to create the card." });
  if (await sandboxPersona(tx, scope.actor.id) !== "FICTIONAL_ADULT") result.push({ code: "ADULT_APPLICANT_REQUIRED", title: "Sandbox setup is required", detail: "Complete sandbox setup before creating practice cards." });
  const holder = await holderReadiness(tx, row.serviceId, row.holderId);
  if (!holder.allowed) result.push({ code: "CARDHOLDER_UNAVAILABLE", title: "Cardholder access needs attention", detail: "The person named on this card needs active cardholder access and permission to use a card." });
  if (!canManageHolder(scope, row.holderId)) result.push({ code: "MEMBER_MANAGEMENT_REQUIRED", title: "Permission to manage secondary cards is required", detail: "The primary cardholder needs permission to manage secondary cards." });
  if (holder.persona !== "FICTIONAL_ADULT") result.push(holder.persona === "FICTIONAL_SUPERVISED" ? { code: "GUARDIAN_REQUIRED", title: "Guardian setup is required", detail: "A supervised card needs a named guardian and funding arrangement. That setup is not available yet." } : { code: "HOLDER_ELIGIBILITY_REQUIRED", title: "Cardholder setup is required", detail: "The person named on this card needs to complete sandbox setup." });
  return result;
}

async function peopleInService(tx: Transaction, serviceId: string) {
  return tx.select({ person: people, membership: serviceMembers }).from(serviceMembers).innerJoin(people, eq(people.id, serviceMembers.personId)).where(eq(serviceMembers.serviceId, serviceId)).orderBy(people.displayName, people.id);
}
export async function getCardProjection(tx: Transaction, scope: Scope, row: typeof cards.$inferSelect): Promise<WorkspaceCard> {
  const [holder] = await tx.select().from(people).where(eq(people.id, row.holderId));
  const spending=spendingProjection(await readPersonSpending(tx,row.serviceId,row.holderId,await databaseNow(tx)));
  const available=BigInt(spending.available.minor);
  const readiness = await holderReadiness(tx, row.serviceId, row.holderId);
  const manageable = canManageHolder(scope, row.holderId);
  const primary=scope.actor.id===scope.policy.primaryPersonId;
  const primaryRestriction=row.primaryFrozen||row.freezeReviewRequired;
  const reasons=[row.primaryFrozen?"Paused by the primary cardholder.":"",row.holderFrozen?"Paused by the person named on the card.":"",row.freezeReviewRequired?"An earlier freeze needs review by the primary cardholder.":""].filter(Boolean);
  const canUnfreeze=manageable && (primary?row.status === "FROZEN":row.holderFrozen) && permits(scope, "cards.unfreeze");
  // Explain the same current gates that permit a purchase. Management authority
  // never substitutes for being the person named on the card.
  const purchaseAvailability:WorkspaceCard["purchaseAvailability"]=row.holderId!==scope.actor.id
    ?{code:"OTHER_CARDHOLDER",title:`${holder!.displayName}’s card`,description:`${holder!.displayName} makes purchases when signed in to their own login. You can review this card and use the controls available to you.`}
    :!readiness.allowed||!permits(scope,"cards.purchase")
      ?{code:"ACCESS_RESTRICTED",title:"Purchases are not enabled for your access",description:primary?"Review your card access or contact support before making a purchase.":"Ask your primary cardholder to review your card access before making a purchase."}
      :readiness.persona!=="FICTIONAL_ADULT"
        ?{code:"SETUP_REQUIRED",title:"Cardholder setup needs attention",description:readiness.persona==="FICTIONAL_SUPERVISED"?"This card needs guardian funding before purchases can be enabled. That setup is not available in this sandbox yet.":"Complete your sandbox setup before making a purchase."}
        :row.status==="FROZEN"
          ?{code:"FROZEN",title:"This card is frozen",description:!primary&&primaryRestriction?"Ask your primary cardholder to review the freeze before making a purchase.":canUnfreeze?"Unfreeze this card when you are ready to use it again.":"Ask your primary cardholder or support to review the freeze before making a purchase."}
          :available<=0n
            ?{code:"NO_FUNDS",title:"No spending available",description:"Your primary can add money to the group or review your monthly spending limit."}
            :{code:"READY",title:"Ready to use",description:"Use this card at checkout within your monthly spending limit and the group’s available funds."};
  return { id: row.id, serviceId: row.serviceId, holderId: row.holderId, holderName: holder!.displayName, nickname: row.nickname,
    relationship: row.holderId === scope.policy.primaryPersonId ? "PRIMARY" : "SECONDARY",
    lastFour: row.lastFour, format: row.format, status: row.status, version: row.version, spending, available: formatMoney(available),
    freeze:{primary:row.primaryFrozen,holder:row.holderFrozen,reviewRequired:row.freezeReviewRequired,description:reasons.join(" ")||"Ready for permitted sandbox purchases.",freezeLabel:row.status==="ACTIVE"?"Freeze card":primary?"Keep card frozen":"Add your freeze",unfreezeLabel:!primary&&primaryRestriction?"Remove your freeze":"Unfreeze card",unfreezeDescription:primary?"This removes all current freezes on this card. New purchases will be available to the named cardholder, within their permissions and available funds.":primaryRestriction?"Your own freeze will be removed. The card will stay frozen until the primary cardholder removes the remaining restriction.":"Your freeze will be removed. New purchases will be available within your permissions and available funds."},
    canFreeze: manageable && !(primary?row.primaryFrozen:row.holderFrozen) && permits(scope, "cards.freeze"), canUnfreeze,
    canPurchase: purchaseAvailability.code==="READY", purchaseAvailability, fictional: true };
}

export function activityProjection(row: typeof serviceActivity.$inferSelect): WorkspaceActivity {
  return { id: row.id, serviceId: row.serviceId, cardId: row.cardId, title: row.title, category: row.category, occurredAt: row.occurredAt.toISOString(),
    status: row.status, direction: row.direction, amount: formatMoney(row.amountMinor), description: row.description, fictional: true };
}
/** Card activity requires an attributed card in the exact Cardholder service. */
export function canReadCardholderActivity(scope: PolicyScope, row: { cardId: string | null; holderId: string | null }): boolean {
  return scope.serviceKind === "CARDHOLDER" && row.cardId !== null && canReadCardholderData(scope, row.holderId);
}
export async function requestProjection(tx: Transaction, scope: Scope, row: typeof cardRequests.$inferSelect): Promise<CardRequestProjection> {
  const [holder] = await tx.select().from(people).where(eq(people.id, row.holderId));
  const [issued] = await tx.select({ id: cards.id }).from(cards).where(and(eq(cards.requestId, row.id), eq(cards.serviceId, row.serviceId)));
  const prerequisites = row.status === "CANCELED" || row.status === "ISSUED" ? [] : await requestPrerequisites(tx, scope, row);
  return { id: row.id, serviceId: row.serviceId, holderId: row.holderId, holderName: holder!.displayName, nickname: row.nickname, format: row.format,
    currency: "USD", status: row.status, version: row.version, issuedCardId: issued?.id ?? null,
    canSubmit: (row.status === "DRAFT" || row.status === "BLOCKED") && prerequisites.length === 0,
    updatedAt: row.updatedAt.toISOString(), prerequisites };
}

function preferenceProjection(row?: typeof notificationPreferences.$inferSelect): NotificationPreferences {
  return { serviceActivity: row?.serviceActivity ?? true, cardControls: row?.cardControls ?? true, caseUpdates: row?.caseUpdates ?? true, version: row?.version ?? 1, delivery: "SAVED_ONLY" };
}
async function databaseNow(tx: Transaction): Promise<Date> {
  const result = await tx.execute(sql`select clock_timestamp() as now`);
  return new Date(result.rows[0]!.now as string | Date);
}

export async function getWorkspace(personId: string, serviceId: string): Promise<WorkspaceProjection> {
  return getDb().transaction(tx => getWorkspaceInTransaction(tx, personId, serviceId));
}

/** Shared server projection for reports; no previously loaded financial rows cross the scope check. */
export async function getWorkspaceInTransaction(tx: Transaction, personId: string, serviceId: string): Promise<WorkspaceProjection> {
  const directory = await listServicesForPersonInTransaction(tx,personId);
    const scope = await loadScope(tx, personId, serviceId);
    const { service, membership, actor } = scope;
    const relationship = cardholderRole(scope.policy);
    if(service.kind!=="CARDHOLDER")throw new SecurityError("RESOURCE_UNAVAILABLE",404);
    const [primary]=await tx.select({primaryName:people.displayName}).from(people).where(eq(people.id,service.primaryPersonId));
    const result: WorkspaceProjection = {
      service: { id: service.id, kind: service.kind, primaryPersonId:service.primaryPersonId, displayName: service.displayName, status: service.status, version: service.version, role: membership.role, cardholderRole: relationship },
      member: { id: actor.id, displayName: actor.displayName }, services: directory, cardholderRole: relationship, fictional: true,
      customerService:{id:service.id,primaryName:primary!.primaryName,displayName:relationship==="PRIMARY"?"Your cardholder service":`Cards with ${primary!.primaryName}`},
      notice: "Sandbox cards use practice funds. No real money moves.",
      capabilities: ACTIONS.map(action => { const {allowed,reasonCode,reason}=evaluate(scope.policy,action);return {action,allowed,reasonCode,reason}; }), cards: [], cardRequests: [], cardholderOptions: [], activity: [], people: [], preferences: preferenceProjection(),
    };
    if (permits(scope, "cards.read")) {
      const rows = await tx.select().from(cards).where(and(eq(cards.serviceId, serviceId), relationship === "PRIMARY" ? undefined : eq(cards.holderId, personId))).orderBy(cards.nickname, cards.id);
      for (const row of rows) if (canReadCardholderData(scope.policy, row.holderId)) result.cards.push(await getCardProjection(tx, scope, row));
    }
    if (permits(scope, "activity.read")) {
      const rows = await tx.select({ activity: serviceActivity, holderId: cards.holderId }).from(serviceActivity).leftJoin(cards, and(eq(cards.id, serviceActivity.cardId), eq(cards.serviceId, serviceActivity.serviceId))).where(and(eq(serviceActivity.serviceId, serviceId), relationship === "PRIMARY" ? undefined : eq(cards.holderId, personId))).orderBy(desc(serviceActivity.occurredAt), serviceActivity.id);
      result.activity = rows.filter(row => canReadCardholderActivity(scope.policy, { cardId: row.activity.cardId, holderId: row.holderId })).map(row => activityProjection(row.activity));
    }
    if (permits(scope, "people.read") || permits(scope, "cards.request")) {
      const members = await peopleInService(tx, serviceId);
      const grants = await tx.select().from(permissionGrants).where(and(eq(permissionGrants.serviceId, serviceId), eq(permissionGrants.state, "ACCEPTED")));
      if (permits(scope, "people.read")) result.people = members.filter(({person}) => relationship !== "SECONDARY" || person.id === personId).map(({ person, membership: member }) => {
        const role=person.id===scope.policy.primaryPersonId?"PRIMARY":"SECONDARY";
        const memberPolicy:PolicyScope = {...scope.policy,actorPersonId:person.id,membershipPersonId:person.id,membershipState:member.state,role,grants:grants.filter(grant=>grant.personId===person.id).map(grant=>grant.action)};
        return { id: person.id, displayName: person.displayName, role,state:member.state,
          permissions: ACTIONS.filter(action=>isCardholderPermission(action)&&evaluate(memberPolicy,action).allowed), isCurrentPerson: person.id === personId };
      });
      if (permits(scope, "cards.request")) {
        result.cardholderOptions = members.filter(({person, membership:member}) => member.state === "ACCEPTED" && grants.some(grant => grant.personId === person.id && grant.action === "cards.hold") && canManageHolder(scope, person.id))
          .map(({person}) => ({id:person.id,displayName:person.displayName,description:"Current cardholding access. Eligibility is checked before creation."}));
        const requests = await tx.select().from(cardRequests).where(eq(cardRequests.serviceId, serviceId)).orderBy(desc(cardRequests.updatedAt), cardRequests.id);
        for (const request of requests) result.cardRequests.push(await requestProjection(tx, scope, request));
      }
    }
    const [preferences] = await tx.select().from(notificationPreferences).where(and(eq(notificationPreferences.serviceId, serviceId), eq(notificationPreferences.personId, personId)));
    result.preferences = preferenceProjection(preferences);
    return result;
}

async function command<T extends {commandId:string}>(personId:string,serviceId:string,kind:string,action:string,targetId:string|null,input:T,mutate:(tx:Transaction,scope:Scope)=>Promise<string>,authorize?:(tx:Transaction,scope:Scope)=>Promise<void>):Promise<string>{
 return getDb().transaction(tx=>commandInTransaction(tx,personId,serviceId,kind,action,targetId,input,mutate,authorize));
}
async function commandInTransaction<T extends {commandId:string}>(tx:Transaction, personId: string, serviceId: string, kind: string, action: string, targetId: string | null, input: T,
  mutate: (tx: Transaction, scope: Scope) => Promise<string>, authorize?: (tx: Transaction, scope: Scope) => Promise<void>): Promise<string> {
    // One service lock orders commands before actor/holder locks and avoids cross-holder deadlocks.
    await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${"workspace:" + serviceId}, 0))`);
    const scope = await loadScope(tx, personId, serviceId, true);
    requireAction(scope, action);
    await authorize?.(tx, scope);
    await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${input.commandId}, 0))`);
    const digest = createHash("sha256").update(JSON.stringify({ kind, targetId, input })).digest("hex");
    const [receipt] = await tx.select().from(workspaceCommands).where(eq(workspaceCommands.commandId, input.commandId));
    if (receipt) {
      if (receipt.serviceId !== serviceId || receipt.actorId !== personId || receipt.kind !== kind || receipt.digest !== digest) throw new SecurityError("IDEMPOTENCY_CONFLICT", 409);
      return receipt.resourceId;
    }
    const resourceId = await mutate(tx, scope);
    await tx.insert(workspaceCommands).values({ commandId: input.commandId, serviceId, actorId: personId, kind, resourceId, digest });
    return resourceId;
}

export async function controlCard(personId: string, serviceId: string, cardId: string, raw: CardControlCommand): Promise<WorkspaceCard> {
  const input = validate(cardControlCommandSchema, raw);
  await command(personId, serviceId, `card.${input.action}`, `cards.${input.action}`, cardId, input, async (tx,scope) => {
    const [card] = await tx.select().from(cards).where(and(eq(cards.id, cardId), eq(cards.serviceId, serviceId))).for("update");
    if (!card) throw new SecurityError("RESOURCE_UNAVAILABLE", 404);
    requireVersion(card.version, input.expectedVersion);
    const primary=scope.actor.id===scope.policy.primaryPersonId;
    let primaryFrozen=card.primaryFrozen,holderFrozen=card.holderFrozen,freezeReviewRequired=card.freezeReviewRequired;
    if(input.action==="freeze"){
      if(primary?primaryFrozen:holderFrozen)throw new SecurityError("INVALID_STATE",422);
      if(primary)primaryFrozen=true;else holderFrozen=true;
    }else if(primary){
      if(card.status!=="FROZEN")throw new SecurityError("INVALID_STATE",422);
      primaryFrozen=false;holderFrozen=false;freezeReviewRequired=false;
    }else{
      if(!holderFrozen)throw new SecurityError(primaryFrozen||freezeReviewRequired?"PRIMARY_FREEZE_ACTIVE":"INVALID_STATE",422);
      holderFrozen=false;
    }
    const status=primaryFrozen||holderFrozen||freezeReviewRequired?"FROZEN":"ACTIVE";
    await tx.update(cards).set({ status,primaryFrozen,holderFrozen,freezeReviewRequired, version: card.version + 1 }).where(eq(cards.id, card.id));
    return card.id;
  }, async (tx, scope) => {
    const [card] = await tx.select().from(cards).where(and(eq(cards.id, cardId), eq(cards.serviceId, serviceId))).for("update");
    if (!card) throw new SecurityError("RESOURCE_UNAVAILABLE", 404);
    requireManageHolder(scope, card.holderId);
  });
  const result = (await getWorkspace(personId, serviceId)).cards.find(card => card.id === cardId);
  if (!result) throw new SecurityError("RESOURCE_UNAVAILABLE", 404);
  return result;
}

async function requireHolder(tx: Transaction, serviceId: string, holderId: string) {
  const [holder] = await tx.select().from(serviceMembers).where(and(eq(serviceMembers.serviceId, serviceId), eq(serviceMembers.personId, holderId), eq(serviceMembers.state, "ACCEPTED"))).for("share");
  const [grant] = await tx.select().from(permissionGrants).where(and(eq(permissionGrants.serviceId, serviceId), eq(permissionGrants.personId, holderId), eq(permissionGrants.action, "cards.hold"), eq(permissionGrants.state, "ACCEPTED"))).for("share");
  if (!holder || !grant) throw new SecurityError("CARDHOLDER_UNAVAILABLE", 422);
}
async function managedRequest(tx: Transaction, serviceId: string, requestId: string) {
  // Every caller first requires the primary-only request/create capability. Creator remains audit provenance.
  const [request] = await tx.select().from(cardRequests).where(and(eq(cardRequests.id, requestId), eq(cardRequests.serviceId, serviceId))).for("update");
  if (!request) throw new SecurityError("RESOURCE_UNAVAILABLE", 404);
  return request;
}
async function updatedRequest(personId: string, serviceId: string, requestId: string) {
  const result = (await getWorkspace(personId, serviceId)).cardRequests.find(request => request.id === requestId);
  if (!result) throw new SecurityError("RESOURCE_UNAVAILABLE", 404);
  return result;
}
export async function startCardRequest(personId: string, serviceId: string, raw: StartCardRequestCommand): Promise<CardRequestProjection> {
  const input = validate(startCardRequestSchema, raw);
  const requestId = await command(personId, serviceId, "card-request.start", "cards.request", null, input, async (tx, scope) => {
    const members = await peopleInService(tx, serviceId);
    const grants = await tx.select().from(permissionGrants).where(and(eq(permissionGrants.serviceId,serviceId),eq(permissionGrants.action,"cards.hold"),eq(permissionGrants.state,"ACCEPTED")));
    const eligible = members.filter(({person,membership})=>membership.state === "ACCEPTED" && grants.some(grant=>grant.personId === person.id) && canManageHolder(scope, person.id));
    const holderId = eligible.find(({person})=>person.id === personId)?.person.id ?? eligible[0]?.person.id;
    if (!holderId) throw new SecurityError("CARDHOLDER_UNAVAILABLE",422);
    await requireHolder(tx, serviceId, holderId);
    // This explicit draft choice is displayed in the form/review; requesting never grants holder access.
    const [request] = await tx.insert(cardRequests).values({ id: randomUUID(), serviceId, creatorId: personId, holderId }).returning();
    return request!.id;
  });
  return updatedRequest(personId, serviceId, requestId);
}
export async function updateCardRequest(personId: string, serviceId: string, requestId: string, raw: CardDraftCommand): Promise<CardRequestProjection> {
  const input = validate(cardDraftCommandSchema, raw);
  await command(personId, serviceId, "card-request.update", "cards.request", requestId, input, async (tx, scope) => {
    const request = await managedRequest(tx, serviceId, requestId);
    requireVersion(request.version, input.expectedVersion);
    if (request.status === "CANCELED" || request.status === "ISSUED") throw new SecurityError("INVALID_STATE", 422);
    await requireHolder(tx, serviceId, input.holderId);
    requireManageHolder(scope, input.holderId);
    await tx.update(cardRequests).set({ holderId: input.holderId, nickname: input.nickname, format: input.format, status: "DRAFT", version: request.version + 1, updatedAt: await databaseNow(tx) }).where(eq(cardRequests.id, requestId));
    return requestId;
  });
  return updatedRequest(personId, serviceId, requestId);
}
export async function submitCardRequest(personId: string, serviceId: string, requestId: string, raw: VersionedCommand): Promise<CardRequestProjection> {
  const input = validate(versionedCommandSchema, raw);
  await command(personId, serviceId, "card-request.submit", "cards.create", requestId, input, async (tx, scope) => {
    const request = await managedRequest(tx, serviceId, requestId);
    requireVersion(request.version, input.expectedVersion);
    if (request.status === "CANCELED" || request.status === "ISSUED") throw new SecurityError("INVALID_STATE", 422);
    const prerequisites = await requestPrerequisites(tx, scope, request);
    if (prerequisites.length) {
      await tx.update(cardRequests).set({ status: "BLOCKED", version: request.version + 1, updatedAt: await databaseNow(tx) }).where(eq(cardRequests.id, requestId));
      return requestId;
    }
    const issued = issueSandboxCard(requestId);
    await tx.insert(cards).values({ ...issued, requestId, serviceId, holderId: request.holderId, nickname: request.nickname, format: request.format, status: "ACTIVE", limitMinor: 0n });
    await tx.update(cardRequests).set({ status: "ISSUED", version: request.version + 1, updatedAt: await databaseNow(tx) }).where(eq(cardRequests.id, requestId));
    return requestId;
  }, async (tx, scope) => {
    requireAction(scope, "cards.request");
    await requireAdultCreator(tx, scope);
    const request = await managedRequest(tx, serviceId, requestId);
    await requireHolder(tx, serviceId, request.holderId);
    requireManageHolder(scope, request.holderId);
    // Issuance never creates funds. Guardian-less supervised holders remain blocked.
    await holderReadiness(tx, serviceId, request.holderId, true);
  });
  return updatedRequest(personId, serviceId, requestId);
}

export async function purchaseCard(personId:string,serviceId:string,cardId:string,raw:CardPurchaseCommand):Promise<CardPurchaseResult>{
 return getDb().transaction(tx=>purchaseCardInTransaction(tx,personId,serviceId,cardId,raw));
}
export async function purchaseCardInTransaction(tx:Transaction,personId: string, serviceId: string, cardId: string, raw: CardPurchaseCommand): Promise<CardPurchaseResult> {
  const input = validate(cardPurchaseCommandSchema, raw);
  const activityId = await commandInTransaction(tx,personId, serviceId, "card.purchase", "cards.purchase", cardId, input, async tx => {
    const [card] = await tx.select().from(cards).where(and(eq(cards.id, cardId), eq(cards.serviceId, serviceId))).for("update");
    if (!card) throw new SecurityError("RESOURCE_UNAVAILABLE", 404);
    requireVersion(card.version, input.expectedVersion);
    if (card.status !== "ACTIVE") throw new SecurityError("CARD_FROZEN", 422);
    const amount = BigInt(input.amountMinor);
    const now=await databaseNow(tx),spending=await readPersonSpending(tx,serviceId,card.holderId,now);
    if(spending.remaining<amount)throw new SecurityError("SPENDING_LIMIT_EXCEEDED",422);
    if(spending.available<amount)throw new SecurityError("INSUFFICIENT_PRACTICE_FUNDS",422);
    const id = randomUUID();
    await postJournal(tx, { businessKey: `card-purchase:${input.commandId}`, kind: "CARD_PURCHASE", referenceId: id, occurredAt:now, lines: [
      { serviceId, bucket: "GROUP_AVAILABLE", deltaMinor: -amount },
      { serviceId, bucket: "CARD_SPENT", cardId, deltaMinor: amount },
    ] });
    await tx.insert(serviceActivity).values({ id, serviceId, cardId, title: input.description, category: "Card purchase", occurredAt: now, status: "POSTED", direction: "DEBIT", amountMinor: amount, description: "Paid from your card group’s prepaid balance." });
    await tx.update(cards).set({ version: card.version + 1 }).where(eq(cards.id, cardId));
    return id;
  }, async (tx, scope) => {
    const [card] = await tx.select().from(cards).where(and(eq(cards.id, cardId), eq(cards.serviceId, serviceId))).for("update");
    if (!card) throw new SecurityError("RESOURCE_UNAVAILABLE", 404);
    if (card.holderId !== personId) throw new SecurityError("ACTION_DENIED", 403);
    await requireHolder(tx, serviceId, card.holderId);
    await requireAdultCreator(tx, scope);
  });
  {
    const scope = await loadScope(tx, personId, serviceId);
    requireAction(scope, "cards.purchase");
    const [card] = await tx.select().from(cards).where(and(eq(cards.id, cardId), eq(cards.serviceId, serviceId), eq(cards.holderId, personId)));
    const [activity] = await tx.select().from(serviceActivity).where(and(eq(serviceActivity.id, activityId), eq(serviceActivity.serviceId, serviceId), eq(serviceActivity.cardId, cardId)));
    const [journal] = await tx.select({ id: ledgerJournals.id }).from(ledgerJournals).where(and(eq(ledgerJournals.kind, "CARD_PURCHASE"), eq(ledgerJournals.referenceId, activityId)));
    if (!card || !activity || !journal) throw new SecurityError("RESOURCE_UNAVAILABLE", 404);
    return { card: await getCardProjection(tx, scope, card), activity: activityProjection(activity), journalId: journal.id, fictional: true };
  }
}

export async function cancelCardRequest(personId: string, serviceId: string, requestId: string, raw: VersionedCommand): Promise<CardRequestProjection> {
  const input = validate(versionedCommandSchema, raw);
  await command(personId, serviceId, "card-request.cancel", "cards.request", requestId, input, async tx => {
    const request = await managedRequest(tx, serviceId, requestId);
    requireVersion(request.version, input.expectedVersion);
    if (request.status === "CANCELED" || request.status === "ISSUED") throw new SecurityError("INVALID_STATE", 422);
    await tx.update(cardRequests).set({ status: "CANCELED", version: request.version + 1, updatedAt: await databaseNow(tx) }).where(eq(cardRequests.id, requestId));
    return requestId;
  });
  return updatedRequest(personId, serviceId, requestId);
}

export async function saveNotificationPreferences(personId: string, serviceId: string, raw: NotificationCommand): Promise<NotificationPreferences> {
  const input = validate(notificationCommandSchema, raw);
  await command(personId, serviceId, "notifications.save", "notifications.manage", personId, input, async tx => {
    await tx.insert(notificationPreferences).values({ serviceId, personId }).onConflictDoNothing();
    const [current] = await tx.select().from(notificationPreferences).where(and(eq(notificationPreferences.serviceId, serviceId), eq(notificationPreferences.personId, personId))).for("update");
    requireVersion(current!.version, input.expectedVersion);
    await tx.update(notificationPreferences).set({ serviceActivity: input.serviceActivity, cardControls: input.cardControls, caseUpdates: input.caseUpdates, version: current!.version + 1 }).where(and(eq(notificationPreferences.serviceId, serviceId), eq(notificationPreferences.personId, personId)));
    return personId;
  });
  return (await getWorkspace(personId, serviceId)).preferences;
}

/** Query helpers share the authorized workspace projection, including masked card/service scope. */
export async function searchActivity(personId: string, serviceId: string, query = ""): Promise<WorkspaceActivity[]> {
  if (query.length > 100) throw new SecurityError("INVALID_REQUEST", 422);
  const workspace = await getWorkspace(personId, serviceId);
  if (!workspace.capabilities.some(item => item.action === "activity.read" && item.allowed)) throw new SecurityError("ACTION_DENIED", 403);
  const needle = query.trim().toLocaleLowerCase("en-US");
  return workspace.activity.filter(item => `${item.title} ${item.category} ${item.status}`.toLocaleLowerCase("en-US").includes(needle));
}
export async function getActivity(personId: string, serviceId: string, activityId: string): Promise<WorkspaceActivity> {
  const activity = (await searchActivity(personId, serviceId)).find(item => item.id === activityId);
  if (!activity) throw new SecurityError("RESOURCE_UNAVAILABLE", 404);
  return activity;
}

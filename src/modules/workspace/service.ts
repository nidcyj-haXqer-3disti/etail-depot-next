import { createHash, randomUUID } from "node:crypto";
import { and, desc, eq, sql } from "drizzle-orm";
import type { z } from "zod";
import { getDb } from "../../platform/database/client";
import { serviceMembers, people, permissionGrants, cards, cardRequests, serviceActivity, notificationPreferences, workspaceCommands } from "../../platform/database/schema";
import { SecurityError } from "../../platform/security/origin";
import { ACTIONS, evaluate, type PolicyScope } from "../policy/evaluate";
import { cardholderRole, canReadCardholderData, isCardholderPermission } from "../policy/cardholder-scope";
import { loadServiceScope, type ScopedTransaction } from "../access/scope";
import { CARDHOLDER_ACCESS_PERMISSIONS } from "../access/contracts";
import { requireServiceReader } from "../services/service-reader";
import { requireSandboxAdult, requireSandboxParticipant, sandboxPersona } from "../sandbox/service";
import { postJournal } from "../ledger";
import {getServiceMoneyAccount,readServiceMoneyAvailable,lockMoneyAccountsForServices,moneyPosition,prepareMoneyFunding,getMoneyFundingIntent,confirmMoneyFunding,addMoneyFunds,getMoneyTopup,getMoneyTopups} from "../money/service";
import { ledgerJournals } from "../ledger/schema";
import { issueSandboxCard } from "../issuing/sandbox-adapter";
import { listServicesForPersonInTransaction } from "../services/service";
import {cardSpendingLimits,cardLimitChanges} from "./funding-schema";
import {readCardSpending} from "./funding-reader";
import {topupCommandSchema,spendingLimitCommandSchema,type TopupCommand,type SpendingLimitCommand,type FundingIntent,type TopupReceipt,type CardholderFunds,type CardSpending} from "./funding-contracts";
import { cardControlCommandSchema, cardPurchaseCommandSchema, startCardRequestSchema, cardDraftCommandSchema, versionedCommandSchema, notificationCommandSchema, type WorkspaceProjection, type WorkspaceCard, type WorkspaceActivity, type CardRequestProjection, type NotificationPreferences, type CardControlCommand, type CardPurchaseCommand, type CardPurchaseResult, type StartCardRequestCommand, type CardDraftCommand, type VersionedCommand, type NotificationCommand } from "./contracts";

type Transaction = Parameters<Parameters<ReturnType<typeof getDb>["transaction"]>[0]>[0];
type Scope = Awaited<ReturnType<typeof loadServiceScope>> & { actor: typeof people.$inferSelect };

import {formatMoney} from "../money/format";
export {formatMoney} from "../money/format";
import type {MoneyTopupReceipt,MoneyFundingIntent} from "../money/contracts";

function spendingProjection(row:Awaited<ReturnType<typeof readCardSpending>>):CardSpending {
 return {cardId:row.cardId,reviewRequired:row.reviewRequired,allowance:formatMoney(row.allowance),used:formatMoney(row.spent),remaining:formatMoney(row.remaining),available:formatMoney(row.available),version:row.version};
}
function requireFundingPrimary(scope:Scope,action:string){
 if(scope.service.kind!=="CARDHOLDER"||scope.service.primaryPersonId!==scope.actor.id)throw new SecurityError("ACTION_DENIED",403);
 requireAction(scope,action);
}
function topupProjection(row:MoneyTopupReceipt,serviceId:string):TopupReceipt {
 return {id:row.id,serviceId,amount:row.amount,source:row.source,sourceLabel:row.sourceLabel,status:row.status,createdAt:row.createdAt,reference:row.reference};
}
function fundingProjection(row:MoneyFundingIntent,serviceId:string):FundingIntent {
 return {id:row.id,receiptId:row.receiptId,serviceId,amount:row.amount,sourceLabel:row.sourceLabel,createdAt:row.createdAt,receipt:row.receipt?topupProjection(row.receipt,serviceId):null};
}
async function requireFundingAccount(personId:string,serviceId:string,action:string){
 return getDb().transaction(async tx=>{const scope=await loadScope(tx,personId,serviceId);requireFundingPrimary(scope,action);requireAction(scope,"cardholder.funds.read");return getServiceMoneyAccount(tx,serviceId);});
}
export async function getCardholderFunds(personId:string,serviceId:string,page=0):Promise<CardholderFunds>{
 if(!Number.isInteger(page)||page<0||page>10000)throw new SecurityError("INVALID_REQUEST",422);
 const account=await requireFundingAccount(personId,serviceId,"cardholder.funds.read"),history=await getMoneyTopups(personId,account.id,page);
 return getDb().transaction(async tx=>{
  const scope=await loadScope(tx,personId,serviceId);requireFundingPrimary(scope,"cardholder.funds.read");
  const ownedCards=permits(scope,"cards.read")?await tx.select({card:cards,holderName:people.displayName}).from(cards).leftJoin(people,eq(people.id,cards.holderId)).where(eq(cards.serviceId,serviceId)).orderBy(cards.nickname,cards.id):[];
  const result:CardholderFunds={serviceId,moneyAccountId:account.id,serviceName:account.displayName,available:formatMoney(await readServiceMoneyAvailable(tx,serviceId)),source:"SANDBOX_BANK",sourceLabel:"Funding balance",topups:history.topups.map(row=>topupProjection(row,serviceId)),page:history.page,hasMore:history.hasMore,cards:[]};
  for(const {card,holderName} of ownedCards)result.cards.push({id:card.id,name:card.nickname,holderName:holderName??"Not assigned",spending:spendingProjection(await readCardSpending(tx,serviceId,card.id))});
  return result;
 },{isolationLevel:"repeatable read"});
}
export async function getCardholderTopup(personId:string,serviceId:string,topupId:string):Promise<TopupReceipt>{
 const account=await requireFundingAccount(personId,serviceId,"cardholder.funds.read");
 return topupProjection(await getMoneyTopup(personId,account.id,topupId),serviceId);
}
export async function addCardholderFunds(personId:string,serviceId:string,raw:TopupCommand):Promise<TopupReceipt>{
 const input=validate(topupCommandSchema,raw),account=await requireFundingAccount(personId,serviceId,"cardholder.funds.add");
 return topupProjection(await addMoneyFunds(personId,account.id,{commandId:input.commandId,amountMinor:input.amountMinor}),serviceId);
}
export async function prepareCardholderFunding(personId:string,serviceId:string,raw:TopupCommand):Promise<FundingIntent>{
 const input=validate(topupCommandSchema,raw),account=await requireFundingAccount(personId,serviceId,"cardholder.funds.add");
 return fundingProjection(await prepareMoneyFunding(personId,account.id,{commandId:input.commandId,amountMinor:input.amountMinor}),serviceId);
}
export async function getCardholderFundingIntent(personId:string,serviceId:string,intentId:string):Promise<FundingIntent>{
 const account=await requireFundingAccount(personId,serviceId,"cardholder.funds.read");
 return fundingProjection(await getMoneyFundingIntent(personId,account.id,intentId),serviceId);
}
export async function confirmCardholderFunding(personId:string,serviceId:string,intentId:string):Promise<TopupReceipt>{
 const account=await requireFundingAccount(personId,serviceId,"cardholder.funds.add");
 return topupProjection(await confirmMoneyFunding(personId,account.id,intentId),serviceId);
}

export async function getCardSpending(personId:string,serviceId:string,cardId:string):Promise<CardSpending>{
 return getDb().transaction(async tx=>{
  const scope=await loadScope(tx,personId,serviceId);requireAction(scope,"cards.read");
  const [card]=await tx.select().from(cards).where(and(eq(cards.serviceId,serviceId),eq(cards.id,cardId)));
  if(!card||!canReadCardholderData(scope.policy,card.holderId,card.assignmentState))throw new SecurityError("RESOURCE_UNAVAILABLE",404);
  return spendingProjection(await readCardSpending(tx,serviceId,cardId));
 });
}
async function writeCardLimit(tx:Transaction,personId:string,serviceId:string,cardId:string,allowanceMinor:bigint,now:Date,expectedVersion:number){
 const [previous]=await tx.select().from(cardSpendingLimits).where(and(eq(cardSpendingLimits.serviceId,serviceId),eq(cardSpendingLimits.cardId,cardId))).for("update");
 requireVersion(previous?.version??0,expectedVersion);
 const version=(previous?.version??0)+1;
 if(previous)await tx.update(cardSpendingLimits).set({allowanceMinor,version,updatedBy:personId,updatedAt:now,reviewRequired:false}).where(and(eq(cardSpendingLimits.serviceId,serviceId),eq(cardSpendingLimits.cardId,cardId)));
 else await tx.insert(cardSpendingLimits).values({serviceId,cardId,allowanceMinor,version,updatedBy:personId,updatedAt:now,reviewRequired:false});
 await tx.insert(cardLimitChanges).values({serviceId,cardId,actorId:personId,previousMinor:previous?.allowanceMinor??0n,allowanceMinor,version,createdAt:now});
}
export async function setCardSpendingLimit(personId:string,serviceId:string,cardId:string,raw:SpendingLimitCommand):Promise<CardSpending>{
 const input=validate(spendingLimitCommandSchema,raw);
 await command(personId,serviceId,"card-limit.set","cardholder.limits.manage",cardId,input,async tx=>{
  await writeCardLimit(tx,personId,serviceId,cardId,BigInt(input.allowanceMinor),await databaseNow(tx),input.expectedVersion);
  return cardId;
 },async(tx,scope)=>{
  requireFundingPrimary(scope,"cardholder.limits.manage");requireAction(scope,"cards.read");
  const [card]=await tx.select().from(cards).where(and(eq(cards.serviceId,serviceId),eq(cards.id,cardId))).for("update");
  if(!card)throw new SecurityError("RESOURCE_UNAVAILABLE",404);
 });
 return getCardSpending(personId,serviceId,cardId);
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

function canManageHolder(scope: Scope, holderId: string | null, assignmentState: typeof cards.$inferSelect["assignmentState"] = "ACCEPTED") {
  return canReadCardholderData(scope.policy, holderId, assignmentState) && (holderId === scope.actor.id || permits(scope, "cards.manageMembers"));
}
function requireManageHolder(scope: Scope, holderId: string | null, assignmentState: typeof cards.$inferSelect["assignmentState"] = "ACCEPTED") {
  if (!canManageHolder(scope, holderId, assignmentState)) throw new SecurityError("ACTION_DENIED", 403);
}
async function holderReadiness(tx: Transaction, serviceId: string, holderId: string, lock = false) {
  const membershipQuery = tx.select().from(serviceMembers).where(and(eq(serviceMembers.serviceId, serviceId), eq(serviceMembers.personId, holderId)));
  const [membership] = lock ? await membershipQuery.for("share") : await membershipQuery;
  const persona = await sandboxPersona(tx, holderId);
  if (membership?.state !== "ACCEPTED") return { allowed: false, persona };
  try {
    const scope = await loadServiceScope(tx, holderId, serviceId);
    return { allowed: evaluate(scope.policy, "cards.hold").allowed, persona };
  } catch (error) {
    if (error instanceof SecurityError && error.status === 404) return { allowed: false, persona };
    throw error;
  }
}
async function requireAdultCreator(tx: Transaction, scope: Scope) {
  if (await sandboxPersona(tx, scope.actor.id) !== "FICTIONAL_ADULT") throw new SecurityError("CARD_APPLICANT_REQUIRED", 403);
  await requireSandboxAdult(tx, scope.actor.id);
}
async function requestPrerequisites(tx: Transaction, scope: Scope, row: typeof cardRequests.$inferSelect) {
  const result: CardRequestProjection["prerequisites"] = [];
  if (!permits(scope, "cards.create")) result.push({ code: "CARD_CREATE_PERMISSION_REQUIRED", title: "Card creation permission is required", detail: "You can save this request, but you need permission to create the card." });
  if (await sandboxPersona(tx, scope.actor.id) !== "FICTIONAL_ADULT") result.push({ code: "ADULT_APPLICANT_REQUIRED", title: "Cardholder setup is required", detail: "Complete the required card account setup before creating a card." });
  if (row.holderId === null) return result;
  if(row.holderId!==scope.actor.id)result.push({code:"CARD_RECIPIENT_INVITATION_REQUIRED",title:"Invite the cardholder after creation",detail:"Edit this request and choose Someone else. You can invite them from the created card."});
  const holder = await holderReadiness(tx, row.serviceId, row.holderId);
  if (!holder.allowed) result.push({ code: "CARDHOLDER_UNAVAILABLE", title: "Cardholder access needs attention", detail: "The person named on this card needs active cardholder access and permission to use a card." });
  if (!canManageHolder(scope, row.holderId)) result.push({ code: "MEMBER_MANAGEMENT_REQUIRED", title: "Permission to manage other people’s cards is required", detail: "The account owner needs permission to manage other people’s cards." });
  if (holder.persona !== "FICTIONAL_ADULT") result.push(holder.persona === "FICTIONAL_SUPERVISED" ? { code: "GUARDIAN_REQUIRED", title: "Guardian setup is required", detail: "A supervised card needs a named guardian and funding arrangement. That setup is not available yet." } : { code: "HOLDER_ELIGIBILITY_REQUIRED", title: "Cardholder setup is required", detail: "The person named on this card needs to complete their account setup." });
  return result;
}

async function peopleInService(tx: Transaction, serviceId: string) {
  return tx.select({ person: people, membership: serviceMembers }).from(serviceMembers).innerJoin(people, eq(people.id, serviceMembers.personId)).where(eq(serviceMembers.serviceId, serviceId)).orderBy(people.displayName, people.id);
}
export async function getCardProjection(tx: Transaction, scope: Scope, row: typeof cards.$inferSelect): Promise<WorkspaceCard> {
  const [holder] = row.holderId ? await tx.select().from(people).where(eq(people.id, row.holderId)) : [];
  const spending=spendingProjection(await readCardSpending(tx,row.serviceId,row.id));
  const available=BigInt(spending.available.minor);
  const readiness = row.holderId ? await holderReadiness(tx, row.serviceId, row.holderId) : {allowed:false,persona:null};
  const manageable = canManageHolder(scope, row.holderId, row.assignmentState);
  const primary=scope.actor.id===scope.policy.primaryPersonId;
  const primaryRestriction=row.primaryFrozen||row.freezeReviewRequired;
  const reasons=[row.primaryFrozen?"Paused by the account owner.":"",row.holderFrozen?"Paused by the person named on the card.":"",row.freezeReviewRequired?"An earlier freeze needs review by the account owner.":""].filter(Boolean);
  const canUnfreeze=manageable && (primary?row.status === "FROZEN":row.holderFrozen) && permits(scope, "cards.unfreeze");
  // Explain the same current gates that permit a purchase. Management authority
  // never substitutes for being the person named on the card.
  const purchaseAvailability:WorkspaceCard["purchaseAvailability"]=row.assignmentState==="UNASSIGNED"
    ?{code:"UNASSIGNED",title:"Invite a cardholder",description:"This card is created. Invite the person who will use it; they can access it after accepting your invitation."}
    :row.assignmentState==="REVOKED"
      ?{code:"REVOKED",title:"Card access removed",description:"This card can no longer be used. Its past activity stays in your records. Create a new card if you want to invite someone again."}
      :row.holderId!==scope.actor.id
    ?{code:"OTHER_CARDHOLDER",title:`${holder!.displayName}’s card`,description:`Only ${holder!.displayName} can use this card. You can view its purchases and manage its settings.`}
    :!readiness.allowed||!permits(scope,"cards.purchase")
      ?{code:"ACCESS_RESTRICTED",title:"You can’t make purchases with this card yet",description:primary?"Review your card access or contact support before making a purchase.":"Ask your account owner to review your card access before making a purchase."}
      :readiness.persona!=="FICTIONAL_ADULT"
        ?{code:"SETUP_REQUIRED",title:"Card setup needs attention",description:readiness.persona==="FICTIONAL_SUPERVISED"?"This card needs guardian funding before purchases can be enabled. That setup is not available yet.":"Complete your account setup before making a purchase."}
        :row.status==="FROZEN"
          ?{code:"FROZEN",title:"This card is frozen",description:!primary&&primaryRestriction?"Ask your account owner to review the freeze before making a purchase.":canUnfreeze?"Unfreeze this card when you are ready to use it again.":"Ask your account owner or support to review the freeze before making a purchase."}
          :available<=0n
            ?{code:"NO_FUNDS",title:"No spending available",description:"Ask the account owner to add money to the card balance or review this card’s total spending limit."}
            :{code:"READY",title:"Ready to use",description:"Use this card at checkout within your total spending limit and the available card balance."};
  return { id: row.id, serviceId: row.serviceId, holderId: row.holderId, holderName: holder?.displayName ?? "Not assigned", nickname: row.nickname,
    assignmentState:row.assignmentState,network:row.network,canInvite:primary&&row.assignmentState==="UNASSIGNED"&&permits(scope,"people.invite"),canRevokeAssignment:primary&&row.assignmentState==="ACCEPTED"&&row.holderId!==scope.actor.id&&permits(scope,"people.revoke"),
    relationship: row.holderId === null ? "UNASSIGNED" : row.holderId === scope.policy.primaryPersonId ? "OWNER" : "CARDHOLDER",
    lastFour: row.lastFour, format: row.format, status: row.status, version: row.version, spending, available: formatMoney(available),
    freeze:{primary:row.primaryFrozen,holder:row.holderFrozen,reviewRequired:row.freezeReviewRequired,description:reasons.join(" ")||"No freezes are active.",freezeLabel:row.status==="ACTIVE"?"Freeze card":primary?"Keep card frozen":"Add your freeze",unfreezeLabel:!primary&&primaryRestriction?"Remove your freeze":"Unfreeze card",unfreezeDescription:primary?"This removes all current freezes on this card. New purchases will be available to the named cardholder, within their spending limit and the available card balance.":primaryRestriction?"Your own freeze will be removed. The card will stay frozen until the account owner removes the remaining restriction.":"Your freeze will be removed. New purchases will be available within your spending limit and the available card balance."},
    canFreeze: manageable && !(primary?row.primaryFrozen:row.holderFrozen) && permits(scope, "cards.freeze"), canUnfreeze,
    canPurchase: purchaseAvailability.code==="READY", purchaseAvailability, fictional: true };
}

export function activityProjection(row: typeof serviceActivity.$inferSelect): WorkspaceActivity {
  return { id: row.id, serviceId: row.serviceId, cardId: row.cardId, title: row.title, category: row.category, occurredAt: row.occurredAt.toISOString(),
    status: row.status, direction: row.direction, amount: formatMoney(row.amountMinor), description: row.description, fictional: true };
}
/** Card activity requires an attributed card in the exact Cardholder service. */
export function canReadCardholderActivity(scope: PolicyScope, row: { cardId: string | null; holderId: string | null; assignmentState: typeof cards.$inferSelect["assignmentState"] | null }): boolean {
  return scope.serviceKind === "CARDHOLDER" && row.cardId !== null && canReadCardholderData(scope, row.holderId, row.assignmentState);
}
export async function requestProjection(tx: Transaction, scope: Scope, row: typeof cardRequests.$inferSelect): Promise<CardRequestProjection> {
  const [holder] = row.holderId ? await tx.select().from(people).where(eq(people.id, row.holderId)) : [];
  const [issued] = await tx.select({ id: cards.id }).from(cards).where(and(eq(cards.requestId, row.id), eq(cards.serviceId, row.serviceId)));
  const prerequisites = row.status === "CANCELED" || row.status === "ISSUED" ? [] : await requestPrerequisites(tx, scope, row);
  return { id: row.id, serviceId: row.serviceId, holderId: row.holderId, holderName: holder?.displayName ?? "Not assigned", nickname: row.nickname, format: row.format,
    currency: "USD", allowance:formatMoney(row.requestedLimitMinor), status: row.status, version: row.version, issuedCardId: issued?.id ?? null,
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
      customerService:{id:service.id,primaryName:primary!.primaryName,displayName:relationship==="OWNER"?"Your card account":`Cards with ${primary!.primaryName}`},
      notice: "Your cards use the available card balance and each card’s total spending limit.",
      capabilities: ACTIONS.map(action => { const {allowed,reasonCode,reason}=evaluate(scope.policy,action);return {action,allowed,reasonCode,reason}; }), cards: [], cardRequests: [], cardholderOptions: [], activity: [], people: [], preferences: preferenceProjection(),
    };
    if (permits(scope, "cards.read")) {
      const rows = await tx.select().from(cards).where(and(eq(cards.serviceId, serviceId), relationship === "OWNER" ? undefined : and(eq(cards.holderId, personId),eq(cards.assignmentState,"ACCEPTED")))).orderBy(cards.nickname, cards.id);
      for (const row of rows) if (canReadCardholderData(scope.policy, row.holderId, row.assignmentState)) result.cards.push(await getCardProjection(tx, scope, row));
    }
    if (permits(scope, "activity.read")) {
      const rows = await tx.select({ activity: serviceActivity, holderId: cards.holderId, assignmentState:cards.assignmentState }).from(serviceActivity).leftJoin(cards, and(eq(cards.id, serviceActivity.cardId), eq(cards.serviceId, serviceActivity.serviceId))).where(and(eq(serviceActivity.serviceId, serviceId), relationship === "OWNER" ? undefined : and(eq(cards.holderId, personId),eq(cards.assignmentState,"ACCEPTED")))).orderBy(desc(serviceActivity.occurredAt), serviceActivity.id);
      result.activity = rows.filter(row => canReadCardholderActivity(scope.policy, { cardId: row.activity.cardId, holderId: row.holderId, assignmentState:row.assignmentState })).map(row => activityProjection(row.activity));
    }
    if (permits(scope, "people.read") || permits(scope, "cards.request")) {
      const members = await peopleInService(tx, serviceId);
      const grants = await tx.select().from(permissionGrants).where(and(eq(permissionGrants.serviceId, serviceId), eq(permissionGrants.state, "ACCEPTED")));
      if (permits(scope, "people.read")) result.people = members.filter(({person}) => relationship !== "CARDHOLDER" || person.id === personId).map(({ person, membership: member }) => {
        const role=person.id===scope.policy.primaryPersonId?"OWNER":"CARDHOLDER";
        const memberPolicy:PolicyScope = {...scope.policy,actorPersonId:person.id,membershipPersonId:person.id,membershipState:member.state,role,grants:role==="CARDHOLDER"?[...CARDHOLDER_ACCESS_PERMISSIONS]:grants.filter(grant=>grant.personId===person.id).map(grant=>grant.action)};
        return { id: person.id, displayName: person.displayName, role,state:member.state,
          permissions: ACTIONS.filter(action=>isCardholderPermission(action)&&evaluate(memberPolicy,action).allowed), isCurrentPerson: person.id === personId };
      });
      if (permits(scope, "cards.request")) {
        result.cardholderOptions = members.filter(({person, membership:member}) => person.id===personId && member.state === "ACCEPTED" && (person.id !== scope.policy.primaryPersonId || grants.some(grant => grant.personId === person.id && grant.action === "cards.hold")) && canManageHolder(scope, person.id))
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
    await lockMoneyAccountsForServices(tx,[serviceId]);
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

/** Called only after the access command has locked the account/service and verified the exact invitation. */
export async function bindCreatedCardRecipient(tx:ScopedTransaction,ownerId:string,serviceId:string,cardId:string,recipientId:string):Promise<WorkspaceCard>{
  const scope=await loadScope(tx,ownerId,serviceId,true);
  if(cardholderRole(scope.policy)!=="OWNER")throw new SecurityError("ACTION_DENIED",403);
  requireAction(scope,"people.invite");requireAction(scope,"cards.read");
  const [card]=await tx.select().from(cards).where(and(eq(cards.id,cardId),eq(cards.serviceId,serviceId))).for("update");
  if(!card)throw new SecurityError("RESOURCE_UNAVAILABLE",404);
  if(card.assignmentState!=="UNASSIGNED"||card.holderId!==null)throw new SecurityError("CARD_ALREADY_ASSIGNED",409);
  await requireHolder(tx,serviceId,recipientId);
  if((await holderReadiness(tx,serviceId,recipientId,true)).persona!=="FICTIONAL_ADULT")throw new SecurityError("CARD_APPLICANT_REQUIRED",403);
  const [assigned]=await tx.update(cards).set({holderId:recipientId,assignmentState:"ACCEPTED",assignedAt:await databaseNow(tx),version:card.version+1}).where(eq(cards.id,cardId)).returning();
  return getCardProjection(tx,scope,assigned!);
}
/** Revocation retains the original holder and all financial history. It cannot be undone by a new invitation. */
export async function revokeCreatedCardRecipient(tx:ScopedTransaction,ownerId:string,serviceId:string,cardId:string,expectedVersion?:number):Promise<WorkspaceCard>{
  const scope=await loadScope(tx,ownerId,serviceId,true);
  if(cardholderRole(scope.policy)!=="OWNER")throw new SecurityError("ACTION_DENIED",403);
  requireAction(scope,"people.revoke");requireAction(scope,"cards.read");
  const [card]=await tx.select().from(cards).where(and(eq(cards.id,cardId),eq(cards.serviceId,serviceId))).for("update");
  if(!card)throw new SecurityError("RESOURCE_UNAVAILABLE",404);
  if(expectedVersion!==undefined)requireVersion(card.version,expectedVersion);
  if(card.assignmentState!=="ACCEPTED"||card.holderId===ownerId)throw new SecurityError("INVALID_STATE",422);
  const [revoked]=await tx.update(cards).set({assignmentState:"REVOKED",assignmentRevokedAt:await databaseNow(tx),version:card.version+1}).where(eq(cards.id,cardId)).returning();
  return getCardProjection(tx,scope,revoked!);
}
export async function revokeCardRecipient(personId:string,serviceId:string,cardId:string,raw:VersionedCommand):Promise<WorkspaceCard>{
  const input=validate(versionedCommandSchema,raw);
  await command(personId,serviceId,"card-recipient.revoke","people.revoke",cardId,input,async tx=>{
    await revokeCreatedCardRecipient(tx,personId,serviceId,cardId,input.expectedVersion);return cardId;
  });
  const scopeResult=await getWorkspace(personId,serviceId),card=scopeResult.cards.find(item=>item.id===cardId);
  if(!card)throw new SecurityError("RESOURCE_UNAVAILABLE",404);return card;
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
    requireManageHolder(scope, card.holderId, card.assignmentState);
  });
  const result = (await getWorkspace(personId, serviceId)).cards.find(card => card.id === cardId);
  if (!result) throw new SecurityError("RESOURCE_UNAVAILABLE", 404);
  return result;
}

async function requireHolder(tx: Transaction, serviceId: string, holderId: string) {
  if (!(await holderReadiness(tx, serviceId, holderId, true)).allowed) throw new SecurityError("CARDHOLDER_UNAVAILABLE", 422);
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
  const requestId = await command(personId, serviceId, "card-request.start", "cards.request", null, input, async (tx) => {
    // Card creation is independent of who will later accept it.
    const [request] = await tx.insert(cardRequests).values({ id: randomUUID(), serviceId, creatorId: personId, holderId:null }).returning();
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
    if(input.holderId!==null){
      if(input.holderId!==personId)throw new SecurityError("CARD_RECIPIENT_INVITATION_REQUIRED",422);
      await requireHolder(tx, serviceId, input.holderId);
      requireManageHolder(scope, input.holderId);
    }
    await tx.update(cardRequests).set({ holderId: input.holderId, nickname: input.nickname, format: input.format, requestedLimitMinor:BigInt(input.allowanceMinor), status: "DRAFT", version: request.version + 1, updatedAt: await databaseNow(tx) }).where(eq(cardRequests.id, requestId));
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
    await tx.insert(cards).values({ ...issued, requestId, serviceId, holderId: request.holderId, assignmentState:request.holderId?"ACCEPTED":"UNASSIGNED",assignedAt:request.holderId?await databaseNow(tx):null, nickname: request.nickname, format: request.format, status: "ACTIVE", limitMinor: 0n });
    await writeCardLimit(tx,personId,serviceId,issued.id,request.requestedLimitMinor,await databaseNow(tx),0);
    await tx.update(cardRequests).set({ status: "ISSUED", version: request.version + 1, updatedAt: await databaseNow(tx) }).where(eq(cardRequests.id, requestId));
    return requestId;
  }, async (tx, scope) => {
    requireAction(scope, "cards.request");
    await requireAdultCreator(tx, scope);
    const request = await managedRequest(tx, serviceId, requestId);
    if(request.holderId!==null){
      await requireHolder(tx, serviceId, request.holderId);
      requireManageHolder(scope, request.holderId);
      await holderReadiness(tx, serviceId, request.holderId, true);
    }
    // Issuance never creates funds or assigns an unnamed recipient.
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
    const now=await databaseNow(tx),spending=await readCardSpending(tx,serviceId,card.id);
    if(spending.remaining<amount)throw new SecurityError("SPENDING_LIMIT_EXCEEDED",422);
    if(spending.available<amount)throw new SecurityError("INSUFFICIENT_PRACTICE_FUNDS",422);
    const id = randomUUID(),account=await getServiceMoneyAccount(tx,serviceId);
    if(account.status!=="ACTIVE")throw new SecurityError("SERVICE_UNAVAILABLE",404);
    await postJournal(tx, { businessKey: `card-purchase:${input.commandId}`, kind: "CARD_PURCHASE", referenceId: id, occurredAt:now, lines: [
      { ...moneyPosition(account.id), deltaMinor: -amount },
      { serviceId, bucket: "CARD_SPENT", cardId, deltaMinor: amount },
    ] });
    await tx.insert(serviceActivity).values({ id, serviceId, cardId, title: input.description, category: "Card purchase", occurredAt: now, status: "POSTED", direction: "DEBIT", amountMinor: amount, description: "Paid from your shared money account." });
    await tx.update(cards).set({ version: card.version + 1 }).where(eq(cards.id, cardId));
    return id;
  }, async (tx, scope) => {
    const [card] = await tx.select().from(cards).where(and(eq(cards.id, cardId), eq(cards.serviceId, serviceId))).for("update");
    if (!card) throw new SecurityError("RESOURCE_UNAVAILABLE", 404);
    if (card.assignmentState!=="ACCEPTED" || card.holderId !== personId) throw new SecurityError("ACTION_DENIED", 403);
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

/** Preferences are personal to one accepted service membership; no card or activity read is needed. */
export async function getNotificationPreferences(personId:string,serviceId:string) {
  return getDb().transaction(async tx=>{
    const scope=await loadScope(tx,personId,serviceId);
    if(scope.service.kind!=="CARDHOLDER"||cardholderRole(scope.policy)==="NONE")throw new SecurityError("RESOURCE_UNAVAILABLE",404);
    const [row]=await tx.select().from(notificationPreferences).where(and(eq(notificationPreferences.serviceId,serviceId),eq(notificationPreferences.personId,personId)));
    return {serviceId,personId,canManage:permits(scope,"notifications.manage"),preferences:preferenceProjection(row)};
  });
}
export async function saveNotificationPreferences(personId: string, serviceId: string, raw: NotificationCommand): Promise<NotificationPreferences> {
  const input = validate(notificationCommandSchema, raw);
  if(input.expectedPersonId!==personId)throw new SecurityError("PREFERENCES_PERSON_CHANGED",403);
  await command(personId, serviceId, "notifications.save", "notifications.manage", personId, input, async tx => {
    await tx.insert(notificationPreferences).values({ serviceId, personId }).onConflictDoNothing();
    const [current] = await tx.select().from(notificationPreferences).where(and(eq(notificationPreferences.serviceId, serviceId), eq(notificationPreferences.personId, personId))).for("update");
    requireVersion(current!.version, input.expectedVersion);
    await tx.update(notificationPreferences).set({ serviceActivity: input.serviceActivity, cardControls: input.cardControls, caseUpdates: input.caseUpdates, version: current!.version + 1 }).where(and(eq(notificationPreferences.serviceId, serviceId), eq(notificationPreferences.personId, personId)));
    return personId;
  });
  return (await getNotificationPreferences(personId, serviceId)).preferences;
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

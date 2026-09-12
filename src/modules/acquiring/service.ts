import {channelActivations,merchantTestPayments} from "./operations-schema";

import { createHash, randomUUID } from "node:crypto";
import { and, desc, eq, inArray, or, sql } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "../../platform/database/client";
import { services, serviceMembers, people } from "../../platform/database/schema";
import { SecurityError } from "../../platform/security/origin";
import { requireServiceReader } from "../services/service-reader";
import { requireMerchantApplicant } from "../services/merchant-eligibility";
import { loadServiceScope, type ScopedTransaction } from "../access/scope";
import { loadTerminalScope, listTerminalAssignmentIds } from "../access/merchant-scope";
import { evaluate } from "../policy/evaluate";
import { formatMoney } from "../workspace/service";
import { merchantProfiles, merchantApplications, merchantApplicationEvents, merchantApplicationCommands, paymentChannels, paymentChannelCommands, merchantTerminals, merchantUnitCommands, merchantUnitEvents } from "./schema";
import { startMerchantSetupSchema, updateMerchantSetupSchema, submitMerchantSetupSchema,
  type StartMerchantSetupInput, type UpdateMerchantSetupInput, type SubmitMerchantSetupInput,
  type MerchantBusinessDetailsProjection, type MerchantSetupProjection, type SetupRequirement } from "./contracts";
import { channelPresentationSchema, createChannelSchema, updateChannelSchema, cancelChannelSchema, createTerminalSchema, type CreateTerminalInput, pauseMerchantSchema,
  type CreateChannelInput, type UpdateChannelInput, type CancelChannelInput, type PauseMerchantInput,
  type PaymentChannel, type MerchantUnitSummary, type MerchantReadiness, type MerchantDirectoryProjection, type MerchantWorkspaceProjection } from "./contracts";

type Scope=Awaited<ReturnType<typeof loadServiceScope>>;
type Application=typeof merchantApplications.$inferSelect;
type Profile=typeof merchantProfiles.$inferSelect;
type Draft=typeof paymentChannels.$inferSelect;
type MerchantScope=Awaited<ReturnType<typeof loadTerminalScope>>;
function parse<T>(schema:z.ZodType<T>,raw:unknown):T {const result=schema.safeParse(raw);if(!result.success)throw new SecurityError("INVALID_REQUEST",422);return result.data;}
function requireAction(scope:Scope,action:string) {if(!evaluate(scope.policy,action).allowed)throw new SecurityError("ACTION_DENIED",403);}
async function databaseNow(tx:ScopedTransaction) {const result=await tx.execute(sql`select clock_timestamp() as now`);return new Date(result.rows[0]!.now as Date|string);}
async function applicantAllowed(tx:ScopedTransaction,personId:string) {
  try {await requireMerchantApplicant(tx,personId);return true;}catch(error){if(error instanceof SecurityError&&["MERCHANT_APPLICANT_REQUIRED","SANDBOX_START_REQUIRED","SERVICE_UNAVAILABLE"].includes(error.code))return false;throw error;}
}
function requirements(row:Application):SetupRequirement[] {
  return [
    {code:"ENTITY_TYPE",label:"Business type",status:row.legalEntityType?"COMPLETE":"REQUIRED",detail:"Choose an individual, sole proprietor or business."},
    {code:"SELLING_NAME",label:"Selling name",status:row.sellingName?"COMPLETE":"REQUIRED",detail:"Enter your shop or trading name."},
    {code:"LEGAL_NAME",label:"Legal name",status:row.legalName?"COMPLETE":"REQUIRED",detail:"Enter the name of the person or business applying."},
    {code:"ACTIVITY",label:"What you sell",status:row.activityDescription?"COMPLETE":"REQUIRED",detail:"Describe your products or services."},
    {code:"FICTIONAL_CONFIRMATION",label:"Business details",status:row.fictionalDetailsConfirmed?"COMPLETE":"REQUIRED",detail:"Review your details before submitting."},
    {code:"MERCHANT_REVIEW",label:"Business review",status:"UNAVAILABLE",detail:"Your details can be saved for review."},
  ];
}
async function applicationProjection(tx:ScopedTransaction,row:Application,canManage:boolean):Promise<MerchantSetupProjection> {
  const [person]=await tx.select({displayName:people.displayName}).from(people).where(eq(people.id,row.responsiblePersonId));
  const events=await tx.select().from(merchantApplicationEvents).where(and(eq(merchantApplicationEvents.serviceId,row.serviceId),eq(merchantApplicationEvents.applicationId,row.id))).orderBy(desc(merchantApplicationEvents.createdAt),desc(merchantApplicationEvents.id)).limit(101);
  let responsibleAllowed=true;
  if(row.status==="DRAFT") {
    try {const responsible=await loadServiceScope(tx,row.responsiblePersonId,row.serviceId);responsibleAllowed=evaluate(responsible.policy,"acquiring.setup").allowed&&await applicantAllowed(tx,row.responsiblePersonId);}
    catch(error){if(error instanceof SecurityError&&error.status===404)responsibleAllowed=false;else throw error;}
  }
  const items:SetupRequirement[]=[...requirements(row),{code:"RESPONSIBLE_APPLICANT",label:"Applicant",status:responsibleAllowed?"COMPLETE":"REQUIRED",detail:row.status==="PENDING_LOCAL_REVIEW"?"The applicant is recorded with this submission.":responsibleAllowed?"The applicant has permission to submit these business details.":"The applicant needs current permission to submit these business details."}];
  const canEdit=canManage&&row.status==="DRAFT";
  return {id:row.id,serviceId:row.serviceId,responsiblePersonId:row.responsiblePersonId,responsiblePersonName:person!.displayName,status:row.status,version:row.version,legalEntityType:row.legalEntityType,sellingName:row.sellingName,legalName:row.legalName,activityDescription:row.activityDescription,country:"US",fictionalDetailsConfirmed:row.fictionalDetailsConfirmed,createdAt:row.createdAt.toISOString(),updatedAt:row.updatedAt.toISOString(),submittedAt:row.submittedAt?.toISOString()??null,canEdit,canSubmit:canEdit&&!items.some(item=>item.status==="REQUIRED"),requirements:items,timelineHasMore:events.length>100,timeline:events.slice(0,100).reverse().map(event=>({id:event.id,at:event.createdAt.toISOString(),label:{CREATED:"Business details started",SAVED:"Business details saved",SUBMITTED_LOCAL:"Business details submitted for review"}[event.kind]}))};
}
function profileMutable(profile:Profile|undefined) {return !profile||!["RESTRICTED","DECLINED","CLOSED"].includes(profile.status);}

/** Called by the canonical Merchant-service command inside its existing transaction. No service or financial writer. */
export async function initializeMerchantSetup(tx:ScopedTransaction,personId:string,serviceId:string) {
  await requireMerchantApplicant(tx,personId);
  const scope=await loadServiceScope(tx,personId,serviceId,true);requireAction(scope,"acquiring.setup");
  const [profile]=await tx.select().from(merchantProfiles).where(eq(merchantProfiles.serviceId,serviceId)).for("update");
  if(profile&&profile.status!=="DRAFT")throw new SecurityError("MERCHANT_SETUP_UNAVAILABLE",409);
  await tx.insert(merchantProfiles).values({serviceId}).onConflictDoNothing();
  await initializeMerchantTerminal(tx,serviceId,scope.service.displayName);
  const [existing]=await tx.select().from(merchantApplications).where(eq(merchantApplications.serviceId,serviceId));
  if(existing)return existing;
  const [created]=await tx.insert(merchantApplications).values({serviceId,responsiblePersonId:personId}).returning();
  await tx.insert(merchantApplicationEvents).values({applicationId:created!.id,serviceId,actorId:personId,kind:"CREATED"});
  return created!;
}

/** Business information belongs to the selected primary merchant, independently of Cardholder access. */
export async function getMerchantBusinessDetails(personId:string,merchantId:string):Promise<MerchantBusinessDetailsProjection> {
  if(!z.uuid().safeParse(merchantId).success)throw new SecurityError("MERCHANT_UNAVAILABLE",404);
  return getDb().transaction(async tx=>{
    const merchant=await loadTerminalScope(tx,personId,merchantId.toLowerCase(),false,{read:true});
    if(!merchant.ownerAccess)throw new SecurityError("MERCHANT_UNAVAILABLE",404);
    const scope=await loadServiceScope(tx,personId,merchant.merchantService.id);requireAction(scope,"acquiring.read");
    const [profile]=await tx.select().from(merchantProfiles).where(eq(merchantProfiles.serviceId,scope.service.id));
    const [application]=await tx.select().from(merchantApplications).where(eq(merchantApplications.serviceId,scope.service.id));
    const canManageSetup=await applicantAllowed(tx,personId)&&evaluate(scope.policy,"acquiring.setup").allowed&&(!profile||profile.status==="DRAFT");
    return {merchantId:merchant.terminal.id,name:merchant.terminal.displayName,ownerAccess:merchant.ownerAccess,
      merchantStatus:profile?.status??"NOT_STARTED",statusDetail:profile?.status==="PENDING_LOCAL_REVIEW"?"Business details are saved for review.":"Review your business details, then continue to payment setup.",
      canStartSetup:canManageSetup&&!application,canManageSetup,setup:application?await applicationProjection(tx,application,canManageSetup):null};
  },{isolationLevel:"repeatable read"});
}

async function applicationCommand(personId:string,merchantId:string,applicationId:string|null,kind:"START"|"SAVE"|"SUBMIT",input:StartMerchantSetupInput|UpdateMerchantSetupInput|SubmitMerchantSetupInput):Promise<MerchantSetupProjection> {
  return getDb().transaction(async tx=>{
    const merchant=await loadTerminalScope(tx,personId,merchantId,true);
    if(!merchant.ownerAccess)throw new SecurityError("MERCHANT_UNAVAILABLE",404);
    const serviceId=merchant.merchantService.id,scope=await loadServiceScope(tx,personId,serviceId,true);requireAction(scope,"acquiring.setup");await requireMerchantApplicant(tx,personId);
    await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${input.commandId},0))`);
    const digest=createHash("sha256").update(JSON.stringify({kind,applicationId,input})).digest("hex");
    const [receipt]=await tx.select().from(merchantApplicationCommands).where(eq(merchantApplicationCommands.commandId,input.commandId));
    if(receipt&&(receipt.serviceId!==serviceId||receipt.actorId!==personId||receipt.kind!==kind||receipt.digest!==digest))throw new SecurityError("IDEMPOTENCY_CONFLICT",409);
    let [row]=await tx.select().from(merchantApplications).where(eq(merchantApplications.serviceId,serviceId)).for("update");
    const [profile]=await tx.select().from(merchantProfiles).where(eq(merchantProfiles.serviceId,serviceId)).for("update");
    if(applicationId&&row?.id!==applicationId)throw new SecurityError("RESOURCE_UNAVAILABLE",404);
    if(receipt) {if(!row||row.id!==receipt.applicationId)throw new SecurityError("RESOURCE_UNAVAILABLE",404);return applicationProjection(tx,row,profile?.status==="DRAFT");}
    if(kind==="START") row=await initializeMerchantSetup(tx,personId,serviceId);
    else {
      if(!row)throw new SecurityError("RESOURCE_UNAVAILABLE",404);
      if(!("expectedVersion" in input)||row.version!==input.expectedVersion)throw new SecurityError("STALE_VERSION",409);
      if(row.status!=="DRAFT"||profile?.status!=="DRAFT")throw new SecurityError("MERCHANT_SETUP_NOT_EDITABLE",409);
      const now=await databaseNow(tx);
      if(kind==="SAVE"&&"sellingName" in input) {
        [row]=await tx.update(merchantApplications).set({legalEntityType:input.legalEntityType,sellingName:input.sellingName,legalName:input.legalName,activityDescription:input.activityDescription,country:input.country,fictionalDetailsConfirmed:input.fictionalDetailsConfirmed,version:row.version+1,updatedAt:now}).where(eq(merchantApplications.id,row.id)).returning();
      } else {
        if(requirements(row).some(item=>item.status==="REQUIRED"))throw new SecurityError("SETUP_REQUIREMENTS_REQUIRED",422);
        // The named responsible applicant remains explicit even if another permitted adult prepared the draft.
        const responsible=await loadServiceScope(tx,row.responsiblePersonId,serviceId,true);requireAction(responsible,"acquiring.setup");await requireMerchantApplicant(tx,row.responsiblePersonId);
        [row]=await tx.update(merchantApplications).set({status:"PENDING_LOCAL_REVIEW",submittedAt:now,version:row.version+1,updatedAt:now}).where(eq(merchantApplications.id,row.id)).returning();
        await tx.update(merchantProfiles).set({status:"PENDING_LOCAL_REVIEW",version:profile.version+1,updatedAt:now}).where(eq(merchantProfiles.serviceId,serviceId));
      }
      await tx.insert(merchantApplicationEvents).values({applicationId:row!.id,serviceId,actorId:personId,kind:kind==="SAVE"?"SAVED":"SUBMITTED_LOCAL",createdAt:now});
    }
    await tx.insert(merchantApplicationCommands).values({commandId:input.commandId,applicationId:row!.id,serviceId,actorId:personId,kind,digest});
    return applicationProjection(tx,row!,row!.status==="DRAFT");
  });
}
export async function startMerchantSetup(personId:string,merchantId:string,raw:StartMerchantSetupInput) {return applicationCommand(personId,merchantId,null,"START",parse(startMerchantSetupSchema,raw));}
export async function updateMerchantSetup(personId:string,merchantId:string,applicationId:string,raw:UpdateMerchantSetupInput) {return applicationCommand(personId,merchantId,applicationId,"SAVE",parse(updateMerchantSetupSchema,raw));}
export async function submitMerchantSetup(personId:string,merchantId:string,applicationId:string,raw:SubmitMerchantSetupInput) {return applicationCommand(personId,merchantId,applicationId,"SUBMIT",parse(submitMerchantSetupSchema,raw));}

/** Used only by the canonical Merchant setup command and explicit fixture initialization. */
export async function initializeMerchantTerminal(tx:ScopedTransaction,serviceId:string,displayName:string) {
  const [existing]=await tx.select().from(merchantTerminals).where(eq(merchantTerminals.merchantServiceId,serviceId)).orderBy(merchantTerminals.createdAt,merchantTerminals.id).limit(1);
  if(existing)return existing;
  const [terminal]=await tx.insert(merchantTerminals).values({merchantServiceId:serviceId,displayName,status:"ACTIVE"}).returning();
  if(!terminal)throw new SecurityError("MERCHANT_UNAVAILABLE",404);
  return terminal;
}
async function merchantReadiness(tx:ScopedTransaction,scope:MerchantScope):Promise<MerchantReadiness> {
  const requirements:SetupRequirement[]=[
    {code:"OWNER_RESPONSIBILITY",label:"Account owner",status:scope.policy.operating?"COMPLETE":"REQUIRED",detail:`${scope.merchantService.displayName} is responsible for this merchant’s collections, refunds and deposits. ${scope.policy.operating?"Merchant access is active.":"Merchant activity is paused or access has changed."}`},
    {code:"BUSINESS_VERIFICATION",label:"Business verification",status:"UNAVAILABLE",detail:"Business verification is not available."},
    {code:"GATEWAY_BINDING",label:"Bank payment connection",status:"UNAVAILABLE",detail:"A bank payment connection is not available."},
    {code:"PAYMENT_PROCESSING",label:"Bank card payments",status:"UNAVAILABLE",detail:"Payments with bank-issued cards are not available."},
    {code:"PAYOUTS",label:"Bank deposits",status:"UNAVAILABLE",detail:"Bank deposits are not available."},
    {code:"DELIVERY",label:"Message delivery",status:"UNAVAILABLE",detail:"Copy a payment link or QR code to share it. Automatic messages are not available."},
  ];
  return {responsibility:"OWNER_RESPONSIBLE",verification:"NOT_VERIFIED",gateway:"NOT_CONNECTED",externalMid:null,paymentAcceptance:false,payouts:false,commercialSpending:"NOT_ASSESSED",requirements};
}
async function readMerchantScope(tx:ScopedTransaction,personId:string,unitId:string):Promise<MerchantScope> {
  return loadTerminalScope(tx,personId,unitId,false,{read:true});
}
function merchantSummary(scope:MerchantScope,eligible=true):MerchantUnitSummary {
  const terminal=scope.terminal;
  return {id:terminal.id,displayName:terminal.displayName,merchant:{serviceId:scope.merchantService.id,displayName:scope.merchantService.displayName},status:terminal.status,version:terminal.version,createdAt:terminal.createdAt.toISOString(),updatedAt:terminal.updatedAt.toISOString(),canPause:eligible&&terminal.status==="ACTIVE"&&evaluate(scope.policy,"merchant.terminals.pause").allowed,canResume:eligible&&terminal.status==="PAUSED"&&!["SUSPENDED","CLOSED"].includes(scope.merchantService.status)&&scope.ownerAccess,canOpen:evaluate(scope.policy,"merchant.read").allowed,href:`/merchants/${terminal.id}`};
}
/** Enumerate owned Merchant services and exact accepted assignments, never Cardholder participation. */
export async function listMerchantScopes(tx:ScopedTransaction,personId:string):Promise<MerchantScope[]> {
  await requireServiceReader(tx,personId);
  const owned=await tx.select({id:services.id}).from(services).innerJoin(serviceMembers,and(eq(serviceMembers.serviceId,services.id),eq(serviceMembers.personId,personId),eq(serviceMembers.state,"ACCEPTED"))).where(and(eq(services.kind,"MERCHANT"),eq(services.primaryPersonId,personId)));
  const serviceIds=owned.map(row=>row.id),assignedIds=await listTerminalAssignmentIds(tx,personId);
  const candidates=serviceIds.length||assignedIds.length?await tx.select({id:merchantTerminals.id}).from(merchantTerminals).where(or(serviceIds.length?inArray(merchantTerminals.merchantServiceId,serviceIds):sql`false`,assignedIds.length?inArray(merchantTerminals.id,assignedIds):sql`false`)).orderBy(merchantTerminals.displayName,merchantTerminals.id):[];
  const scopes:MerchantScope[]=[];
  for(const candidate of candidates)try{scopes.push(await readMerchantScope(tx,personId,candidate.id));}catch(error){if(!(error instanceof SecurityError&&[403,404].includes(error.status)))throw error;}
  return scopes;
}

async function channelLocked(tx:ScopedTransaction,id:string) {
 const [active]=await tx.select({id:channelActivations.channelId}).from(channelActivations).where(and(eq(channelActivations.channelId,id),eq(channelActivations.status,"ACTIVE"))).limit(1);
 const [paid]=await tx.select({id:merchantTestPayments.id}).from(merchantTestPayments).where(and(eq(merchantTestPayments.channelId,id),eq(merchantTestPayments.outcome,"APPROVED"))).limit(1);
 return !!active||!!paid;
}
function channelProjection(row:Draft,scope:MerchantScope,personId:string,now:Date,readiness:MerchantReadiness,eligible=true,locked=false):PaymentChannel {
  const status=row.status==="DRAFT"&&row.expiresAt<=now?"EXPIRED":row.status;
  const canEdit=!locked&&eligible&&evaluate(scope.policy,"channels.update").allowed&&status==="DRAFT";
  const canCancel=eligible&&evaluate(scope.policy,"channels.close").allowed&&row.status==="DRAFT";
  return {id:row.id,serviceId:row.serviceId,merchantUnitId:row.merchantUnitId,creatorId:row.creatorId,description:row.description,amount:formatMoney(row.amountMinor),usage:row.usage,expiresAt:row.expiresAt.toISOString(),status,version:row.version,createdAt:row.createdAt.toISOString(),updatedAt:row.updatedAt.toISOString(),presentations:row.presentations as PaymentChannel["presentations"],visibility:row.visibility,canEdit,canCancel,canShare:eligible&&evaluate(scope.policy,"channels.share").allowed&&status==="DRAFT",canPublish:false,prerequisites:readiness.requirements};
}

export async function getMerchantDirectory(personId:string):Promise<MerchantDirectoryProjection> {
  return getDb().transaction(async tx=>{const scopes=await listMerchantScopes(tx,personId),eligible=await applicantAllowed(tx,personId);return {units:scopes.map(scope=>merchantSummary(scope,eligible)),hasMore:false};});
}

export async function getMerchantWorkspace(personId:string,merchantUnitId:string):Promise<MerchantWorkspaceProjection> {
  if(!z.uuid().safeParse(merchantUnitId).success)throw new SecurityError("MERCHANT_UNAVAILABLE",404);
  merchantUnitId=merchantUnitId.toLowerCase();
  return getDb().transaction(async tx=>{
    const scope=await readMerchantScope(tx,personId,merchantUnitId);const eligible=await applicantAllowed(tx,personId);
    const canRead=evaluate(scope.policy,"channels.read").allowed;
    const rows=canRead?await tx.select().from(paymentChannels).where(and(eq(paymentChannels.merchantUnitId,merchantUnitId),undefined)).orderBy(desc(paymentChannels.updatedAt),paymentChannels.id):[];
    const events=await tx.select().from(merchantUnitEvents).where(eq(merchantUnitEvents.merchantUnitId,merchantUnitId)).orderBy(merchantUnitEvents.createdAt,merchantUnitEvents.id);
    let setupHref:string|null=null;
    try {const service=await loadServiceScope(tx,personId,scope.merchantService.id);if(evaluate(service.policy,"acquiring.setup").allowed)setupHref=`/merchants/${scope.terminal.id}/business-details`;}
    catch(error){if(!(error instanceof SecurityError&&(error.status===403||error.status===404)))throw error;}
    const now=await databaseNow(tx),readiness=await merchantReadiness(tx,scope);
    const channels:PaymentChannel[]=[];
    for(const row of rows)channels.push(channelProjection(row,scope,personId,now,readiness,eligible,await channelLocked(tx,row.id)));
    return {serviceRole:scope.ownerAccess?"OWNER":"TERMINAL_USER",ownerAccess:scope.ownerAccess,allowedPresentations:[...channelPresentationSchema.options],merchant:merchantSummary(scope,eligible),readiness,channels,channelsHasMore:false,canCreateChannel:eligible&&evaluate(scope.policy,"channels.create").allowed,canShareChannel:eligible&&evaluate(scope.policy,"channels.share").allowed,canReadPeople:evaluate(scope.policy,"merchant.people.read").allowed,canInvitePeople:eligible&&evaluate(scope.policy,"merchant.people.invite").allowed,setupHref,timeline:events.map(row=>({id:row.id,label:{CREATED:"Terminal created",PAUSED:"Terminal paused",RESUMED:"Terminal resumed"}[row.kind],at:row.createdAt.toISOString()})),timelineHasMore:false};
  });
}

/** Creates a flat operational terminal. It creates no merchant, membership or money. */
export async function createTerminal(personId:string,merchantServiceId:string,raw:CreateTerminalInput):Promise<MerchantUnitSummary> {
  const input=parse(createTerminalSchema,raw);
  return getDb().transaction(async tx=>{
    const merchant=await loadServiceScope(tx,personId,merchantServiceId,true);await requireMerchantApplicant(tx,personId);
    if(merchant.service.kind!=="MERCHANT"||merchant.service.primaryPersonId!==personId||!evaluate(merchant.policy,"merchant.terminals.create").allowed)throw new SecurityError("ACTION_DENIED",403);
    await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${"terminal-command:"+input.commandId},0))`);
    const digest=createHash("sha256").update(JSON.stringify({kind:"CREATE_TERMINAL",merchantServiceId,input})).digest("hex");
    const [receipt]=await tx.select().from(merchantUnitCommands).where(eq(merchantUnitCommands.commandId,input.commandId));
    if(receipt&&(receipt.actorId!==personId||receipt.kind!=="CREATE_TERMINAL"||receipt.digest!==digest))throw new SecurityError("IDEMPOTENCY_CONFLICT",409);
    if(receipt)return merchantSummary(await loadTerminalScope(tx,personId,receipt.merchantUnitId,false,{read:true}));
    const [terminal]=await tx.insert(merchantTerminals).values({merchantServiceId,displayName:input.displayName,status:"ACTIVE"}).returning();
    await tx.insert(merchantUnitEvents).values({merchantUnitId:terminal!.id,actorId:personId,kind:"CREATED",version:1});
    await tx.insert(merchantUnitCommands).values({commandId:input.commandId,merchantUnitId:terminal!.id,actorId:personId,kind:"CREATE_TERMINAL",digest});
    return merchantSummary(await loadTerminalScope(tx,personId,terminal!.id));
  });
}
async function merchantStatusCommand(personId:string,merchantUnitId:string,raw:PauseMerchantInput,active:boolean):Promise<MerchantUnitSummary> {
  const input=parse(pauseMerchantSchema,raw);
  return getDb().transaction(async tx=>{
    const scope=await loadTerminalScope(tx,personId,merchantUnitId,true,{read:true});await requireMerchantApplicant(tx,personId);
    // Paused-history mode is read-only. Authorize this lifecycle command independently through the responsible service.
    const responsible=await loadServiceScope(tx,personId,scope.merchantService.id,true);requireAction(responsible,"merchant.terminals.pause");
    if(!scope.ownerAccess)throw new SecurityError("ACTION_DENIED",403);
    await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${"merchant-unit-command:"+input.commandId},0))`);
    const kind=active?"RESUME":"PAUSE";
    const digest=createHash("sha256").update(JSON.stringify({kind,merchantUnitId:scope.terminal.id,input})).digest("hex");
    const [receipt]=await tx.select().from(merchantUnitCommands).where(eq(merchantUnitCommands.commandId,input.commandId));
    if(receipt&&(receipt.actorId!==personId||receipt.merchantUnitId!==scope.terminal.id||receipt.kind!==kind||receipt.digest!==digest))throw new SecurityError("IDEMPOTENCY_CONFLICT",409);
    if(receipt)return merchantSummary(scope);
    if(scope.terminal.version!==input.expectedVersion)throw new SecurityError("STALE_VERSION",409);
    if(scope.terminal.status!==(active?"PAUSED":"ACTIVE"))throw new SecurityError("MERCHANT_STATUS_CHANGED",409);
    const now=await databaseNow(tx);
    await tx.update(merchantTerminals).set({status:active?"ACTIVE":"PAUSED",version:scope.terminal.version+1,updatedAt:now}).where(eq(merchantTerminals.id,scope.terminal.id));
    await tx.insert(merchantUnitEvents).values({merchantUnitId:scope.terminal.id,actorId:personId,kind:active?"RESUMED":"PAUSED",reason:input.reason,version:scope.terminal.version+1,createdAt:now});
    await tx.insert(merchantUnitCommands).values({commandId:input.commandId,merchantUnitId:scope.terminal.id,actorId:personId,kind,digest});
    return merchantSummary(await loadTerminalScope(tx,personId,scope.terminal.id,false,{read:true}));
  });
}

export async function pauseMerchant(personId:string,merchantUnitId:string,raw:PauseMerchantInput){return merchantStatusCommand(personId,merchantUnitId,raw,false);}
export async function resumeMerchant(personId:string,merchantUnitId:string,raw:PauseMerchantInput){return merchantStatusCommand(personId,merchantUnitId,raw,true);}

/** Sole channel mutation owner, . */
async function channelCommand(personId:string,merchantUnitId:string,channelId:string|null,kind:"CREATE"|"UPDATE"|"CANCEL",input:CreateChannelInput|UpdateChannelInput|CancelChannelInput):Promise<PaymentChannel> {
  return getDb().transaction(async tx=>{
    const scope=await loadTerminalScope(tx,personId,merchantUnitId,true);await requireMerchantApplicant(tx,personId);
    const action=kind==="CREATE"?"channels.create":kind==="UPDATE"?"channels.update":"channels.close";
    if(!evaluate(scope.policy,action).allowed||!evaluate(scope.policy,"channels.read").allowed)throw new SecurityError("ACTION_DENIED",403);
    const [profile]=await tx.select().from(merchantProfiles).where(eq(merchantProfiles.serviceId,scope.merchantService.id)).for("share");
    if(!profile||!profileMutable(profile))throw new SecurityError("MERCHANT_RESTRICTED",403);
    await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${input.commandId},0))`);
    const digest=createHash("sha256").update(JSON.stringify({kind,merchantUnitId,channelId,input})).digest("hex");
    const [receipt]=await tx.select().from(paymentChannelCommands).where(eq(paymentChannelCommands.commandId,input.commandId));
    if(receipt&&(receipt.merchantUnitId!==merchantUnitId||receipt.actorId!==personId||receipt.kind!==kind||receipt.digest!==digest))throw new SecurityError("IDEMPOTENCY_CONFLICT",409);
    const id=receipt?.channelId??channelId??randomUUID();
    const [existing]=await tx.select().from(paymentChannels).where(and(eq(paymentChannels.id,id),eq(paymentChannels.merchantUnitId,merchantUnitId))).for("update");
    const now=await databaseNow(tx),readiness=await merchantReadiness(tx,scope);
    if(receipt){if(!existing)throw new SecurityError("RESOURCE_UNAVAILABLE",404);return channelProjection(existing,scope,personId,now,readiness,true,await channelLocked(tx,existing.id));}
    if(kind!=="CREATE") {
      if(!existing)throw new SecurityError("RESOURCE_UNAVAILABLE",404);
      if(!("expectedVersion" in input)||existing.version!==input.expectedVersion)throw new SecurityError("STALE_VERSION",409);
      if(existing.status!=="DRAFT")throw new SecurityError("DRAFT_NOT_EDITABLE",409);
      if(kind==="UPDATE"&&await channelLocked(tx,existing.id))throw new SecurityError("CHANNEL_LOCKED",409);
      if(kind==="UPDATE"&&existing.expiresAt<=now)throw new SecurityError("DRAFT_EXPIRED",409);
    }
    let saved:Draft;
    if(kind==="CANCEL") {
      [saved]=await tx.update(paymentChannels).set({status:"CANCELED",version:existing!.version+1,updatedAt:now}).where(eq(paymentChannels.id,id)).returning() as [Draft];
    } else {
      if(!("description" in input))throw new SecurityError("INVALID_REQUEST",422);
      const sharingChange=existing?existing.visibility!==input.visibility:"ASSIGNED" as const==="ASSIGNED";
      if(sharingChange&&!evaluate(scope.policy,"channels.share").allowed)throw new SecurityError("ACTION_DENIED",403);
      const expiresAt=new Date(input.expiresAt);
      if(expiresAt<=now||expiresAt.getTime()>now.getTime()+366*86400000)throw new SecurityError("INVALID_EXPIRY",422);
      const fields={description:input.description,amountMinor:BigInt(input.amountMinor),currency:input.currency,usage:input.usage,expiresAt,presentations:input.presentations,visibility:"ASSIGNED" as const};
      [saved]=kind==="CREATE"?await tx.insert(paymentChannels).values({id,serviceId:scope.merchantService.id,merchantUnitId,creatorId:personId,creatorAssignmentId:scope.assignment?.id??null,creatorBasis:scope.assignment?"TERMINAL_ASSIGNMENT":"OWNER_MEMBER",...fields,createdAt:now,updatedAt:now}).returning() as [Draft]:await tx.update(paymentChannels).set({...fields,version:existing!.version+1,updatedAt:now}).where(eq(paymentChannels.id,id)).returning() as [Draft];
    }
    await tx.insert(paymentChannelCommands).values({commandId:input.commandId,channelId:id,serviceId:scope.merchantService.id,merchantUnitId,actorId:personId,kind,digest});
    return channelProjection(saved,scope,personId,now,readiness,true,await channelLocked(tx,saved.id));
  });
}
export async function createChannel(personId:string,merchantUnitId:string,raw:CreateChannelInput) {return channelCommand(personId,merchantUnitId,null,"CREATE",parse(createChannelSchema,raw));}
export async function updateChannel(personId:string,merchantUnitId:string,channelId:string,raw:UpdateChannelInput) {return channelCommand(personId,merchantUnitId,channelId,"UPDATE",parse(updateChannelSchema,raw));}
export async function cancelChannel(personId:string,merchantUnitId:string,channelId:string,raw:CancelChannelInput) {return channelCommand(personId,merchantUnitId,channelId,"CANCEL",parse(cancelChannelSchema,raw));}

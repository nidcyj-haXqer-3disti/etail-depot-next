import {and,desc,eq,inArray,ne,or,sql} from "drizzle-orm";
import {z} from "zod";
import {getDb} from "../../platform/database/client";
import {serviceActivity,services,cards,cardRequests,people,serviceMembers,permissionGrants,workspaceCommands} from "../../platform/database/schema";
import {SecurityError} from "../../platform/security/origin";
import {requireServiceReader} from "../services/service-reader";
import {getCardholderContextPolicies} from "../services/service";
import {evaluate} from "../policy/evaluate";
import {cardholderRole} from "../policy/cardholder-scope";
import {activityProjection,getCardProjection,getWorkspaceInTransaction,loadCardholderWorkspaceScope,requestProjection} from "./service";
import type {CardholderDashboardDetail,CardholderDashboardProjection,CardholderServiceProfile,CardholderDashboardFocus,CardholderDashboardFilters} from "./dashboard-contracts";

const pageSize=30;
function uuid(value:string){if(!z.uuid().safeParse(value).success)throw new SecurityError("RESOURCE_UNAVAILABLE",404);return value.toLowerCase();}

/** Navigation uses only the person's explicit primary service and its current capabilities. */
export async function getPrimaryCardholderService(personId:string):Promise<CardholderServiceProfile|null>{
 return getDb().transaction(async tx=>{
  const {person}=await requireServiceReader(tx,personId);
  const [profile]=await tx.select().from(services).where(and(eq(services.primaryPersonId,personId),eq(services.kind,"CARDHOLDER")));
  if(!profile)return null;
  let canAddCard=false,canInvite=false;
  try{
   const scope=await loadCardholderWorkspaceScope(tx,personId,profile.id);
   if(cardholderRole(scope.policy)==="PRIMARY"){
    canAddCard=evaluate(scope.policy,"cards.request").allowed;
    canInvite=evaluate(scope.policy,"people.invite").allowed;
   }
  }catch(error){if(!(error instanceof SecurityError&&[403,404].includes(error.status)))throw error;}
  return {id:profile.id,primaryPersonId:personId,primaryName:person.displayName,displayName:"Your cardholder service",relationship:"PRIMARY",canAddCard,canInvite};
 },{isolationLevel:"repeatable read"});
}

/** Selected-card Home loads one authorized card and at most 25 of its transactions. */
export async function getCardholderDashboardFocus(personId:string,cardId:string):Promise<CardholderDashboardFocus>{
 const id=uuid(cardId);
 return getDb().transaction(async tx=>{
  await requireServiceReader(tx,personId);
  const [row]=await tx.select().from(cards).where(eq(cards.id,id));
  if(!row)throw new SecurityError("RESOURCE_UNAVAILABLE",404);
  const scope=await loadCardholderWorkspaceScope(tx,personId,row.serviceId),role=cardholderRole(scope.policy);
  if(role==="NONE"||!evaluate(scope.policy,"cards.read").allowed||(role==="SECONDARY"&&row.holderId!==personId))throw new SecurityError("RESOURCE_UNAVAILABLE",404);
  const [profile]=await tx.select({id:services.id,primaryName:people.displayName}).from(services).innerJoin(people,eq(people.id,services.primaryPersonId)).where(eq(services.id,scope.service.id));
  if(!profile)throw new SecurityError("RESOURCE_UNAVAILABLE",404);
  const capabilities=["cards.read","people.read","activity.read"].map(action=>evaluate(scope.policy,action));
  const card={...await getCardProjection(tx,scope,row),serviceId:profile.id,primaryName:profile.primaryName,accessRole:role,canManageAccess:role==="PRIMARY"&&evaluate(scope.policy,"people.read").allowed};
  const activity=evaluate(scope.policy,"activity.read").allowed?(await tx.select().from(serviceActivity).where(and(eq(serviceActivity.serviceId,row.serviceId),eq(serviceActivity.cardId,id))).orderBy(desc(serviceActivity.occurredAt),serviceActivity.id).limit(25)).map(activityProjection):[];
  return {card,workspace:{service:{id:scope.service.id,kind:scope.service.kind,primaryPersonId:scope.service.primaryPersonId,displayName:scope.service.displayName,status:scope.service.status,version:scope.service.version,role:scope.membership.role,cardholderRole:role},customerService:{...profile,displayName:role==="PRIMARY"?"Your cardholder service":`Cards with ${profile.primaryName}`},cardholderRole:role,capabilities,cards:[card],activity}};
 },{isolationLevel:"repeatable read"});
}

/** Read each linked scope under its own current policy; never union grants between scopes. */
export async function getCardholderDashboard(personId:string,page=0,filters:CardholderDashboardFilters={}):Promise<CardholderDashboardProjection>{
 if(!Number.isSafeInteger(page)||page<0||page>100000)throw new SecurityError("INVALID_REQUEST",422);
 const requestPage=filters.requestPage??0,requestStatus=filters.requestStatus??"ALL",requestSearch=(filters.requestSearch??"").trim();
 const cardScope=filters.cardScope??"ALL",cardSearch=(filters.cardSearch??"").trim();
 if(!Number.isSafeInteger(requestPage)||requestPage<0||requestPage>100000||!["ALL","DRAFT","BLOCKED","ISSUED","CANCELED"].includes(requestStatus)||requestSearch.length>100)throw new SecurityError("INVALID_REQUEST",422);
 if(!["ALL","OWN","MANAGED"].includes(cardScope)||cardSearch.length>100)throw new SecurityError("INVALID_REQUEST",422);
 return getDb().transaction(async tx=>{
  const {person,canCreatePrimary}=await requireServiceReader(tx,personId);
  const contexts=(await getCardholderContextPolicies(tx,personId)).filter(context=>cardholderRole(context.policy)!=="NONE");
  const primaryIds=[...new Set(contexts.flatMap(context=>context.primaryPersonId?[context.primaryPersonId]:[]))];
  const stored=primaryIds.length?await tx.select({profile:services,name:people.displayName}).from(services).innerJoin(people,eq(people.id,services.primaryPersonId)).where(and(eq(services.kind,"CARDHOLDER"),inArray(services.primaryPersonId,primaryIds))):[];
  const profiles:CardholderServiceProfile[]=stored.map(({profile,name})=>{
   const own=profile.primaryPersonId===personId;
   const bound=contexts.find(context=>context.serviceId===profile.id&&context.primaryPersonId===personId);
   return {id:profile.id,primaryPersonId:profile.primaryPersonId,primaryName:name,displayName:own?"Your cardholder service":`Cards with ${name}`,relationship:own?"PRIMARY":"SECONDARY",canAddCard:own&&!!bound&&evaluate(bound.policy,"cards.request").allowed,canInvite:own&&!!bound&&evaluate(bound.policy,"people.invite").allowed};
  });
  const profileByPrimary=new Map(profiles.map(profile=>[profile.primaryPersonId,profile]));
  const linked=contexts.filter(context=>context.primaryPersonId&&profileByPrimary.has(context.primaryPersonId));
  function cardPermissionScope(action:string){
   const permitted=linked.filter(context=>evaluate(context.policy,action).allowed);
   const primary=permitted.filter(context=>cardholderRole(context.policy)==="PRIMARY").map(context=>context.serviceId);
   const secondary=permitted.filter(context=>cardholderRole(context.policy)==="SECONDARY").map(context=>context.serviceId);
   return or(primary.length?inArray(cards.serviceId,primary):undefined,secondary.length?and(inArray(cards.serviceId,secondary),eq(cards.holderId,personId)):undefined)??sql`false`;
  }
  const readable=cardPermissionScope("cards.read");
  const [count]=await tx.select({value:sql<number>`count(*)::integer`,own:sql<number>`count(*) filter (where ${cards.holderId}=${personId})::integer`}).from(cards).where(readable);
  // Search is a literal substring across the full permitted set, before paging.
  // Scope counts never include records hidden by the current service policy.
  const cardWhere=and(readable,cardScope==="OWN"?eq(cards.holderId,personId):cardScope==="MANAGED"?ne(cards.holderId,personId):undefined,cardSearch?sql`position(lower(${cardSearch}) in lower(${cards.nickname} || ' ' || ${cards.lastFour} || ' ' || (select ${people.displayName} from ${people} where ${people.id}=${cards.holderId}))) > 0`:undefined);
  const [matches]=await tx.select({value:sql<number>`count(*)::integer`}).from(cards).where(cardWhere);
  const rows=await tx.select().from(cards).where(cardWhere).orderBy(cards.nickname,cards.id).limit(pageSize+1).offset(page*pageSize);
  const scopes=new Map<string,Awaited<ReturnType<typeof loadCardholderWorkspaceScope>>>();
  async function scope(serviceId:string){let value=scopes.get(serviceId);if(!value){value=await loadCardholderWorkspaceScope(tx,personId,serviceId);scopes.set(serviceId,value);}return value;}
  const visible:CardholderDashboardProjection["cards"]=[];
  for(const row of rows.slice(0,pageSize)){
   const current=await scope(row.serviceId),role=cardholderRole(current.policy);
   if(role==="NONE"||!evaluate(current.policy,"cards.read").allowed||(role==="SECONDARY"&&row.holderId!==personId))continue;
   const profile=profileByPrimary.get(current.policy.primaryPersonId!);if(!profile)continue;
   visible.push({...await getCardProjection(tx,current,row),serviceId:profile.id,primaryName:profile.primaryName,accessRole:role,canManageAccess:role==="PRIMARY"&&evaluate(current.policy,"people.read").allowed});
  }
  const activityRows=await tx.select({activity:serviceActivity,card:cards,holder:people.displayName}).from(serviceActivity).innerJoin(cards,and(eq(cards.id,serviceActivity.cardId),eq(cards.serviceId,serviceActivity.serviceId))).innerJoin(people,eq(people.id,cards.holderId)).where(cardPermissionScope("activity.read")).orderBy(desc(serviceActivity.occurredAt),serviceActivity.id).limit(25);
  const activity:CardholderDashboardProjection["activity"]=[];
  for(const row of activityRows){const current=await scope(row.card.serviceId),role=cardholderRole(current.policy);if(role==="NONE"||!evaluate(current.policy,"activity.read").allowed||(role==="SECONDARY"&&row.card.holderId!==personId))continue;activity.push({...activityProjection(row.activity),cardNickname:row.card.nickname,lastFour:row.card.lastFour,holderName:row.holder});}
  const requestScopes=linked.filter(context=>cardholderRole(context.policy)==="PRIMARY"&&evaluate(context.policy,"cards.request").allowed).map(context=>context.serviceId);
  const requestScope=requestScopes.length?inArray(cardRequests.serviceId,requestScopes):sql`false`;
  // Literal substring search includes the named holder across the entire authorized collection.
  const requestWhere=and(requestScope,requestStatus==="ALL"?undefined:eq(cardRequests.status,requestStatus),requestSearch?sql`position(lower(${requestSearch}) in lower(${cardRequests.nickname} || ' ' || (select ${people.displayName} from ${people} where ${people.id}=${cardRequests.holderId}))) > 0`:undefined);
  const [requestTotal]=await tx.select({value:sql<number>`count(*)::integer`}).from(cardRequests).where(requestWhere);
  const [unfinishedTotal]=await tx.select({value:sql<number>`count(*)::integer`}).from(cardRequests).where(and(requestScope,inArray(cardRequests.status,["DRAFT","BLOCKED"])));
  const requestRows=await tx.select().from(cardRequests).where(requestWhere).orderBy(desc(cardRequests.updatedAt),cardRequests.id).limit(21).offset(requestPage*20);
  const requests=[];
  for(const row of requestRows.slice(0,20)){const current=await scope(row.serviceId);if(cardholderRole(current.policy)==="PRIMARY"&&evaluate(current.policy,"cards.request").allowed)requests.push(await requestProjection(tx,current,row));}
  let primaryService=profiles.find(profile=>profile.relationship==="PRIMARY")??null;
  if(!primaryService){
   // Existing enrollment remains known to its named primary, even when current access is suspended.
   // This metadata never supplies records or grants, and prevents offering duplicate enrollment.
   const [own]=await tx.select({id:services.id}).from(services).where(and(eq(services.kind,"CARDHOLDER"),eq(services.primaryPersonId,personId)));
   if(own)primaryService={id:own.id,primaryPersonId:personId,primaryName:person.displayName,displayName:"Your cardholder service",relationship:"PRIMARY",canAddCard:false,canInvite:false};
  }
  // Accepted people remain visible before their first card exists. This directory
  // has its own bounded page and never derives membership from a page of cards.
  const cardholders:CardholderDashboardProjection["cardholders"]=[];
  let cardholdersHasMore=false;
  const ownContext=linked.find(context=>context.serviceId===primaryService?.id&&cardholderRole(context.policy)==="PRIMARY");
  if(ownContext&&evaluate(ownContext.policy,"people.read").allowed){
   const memberRows=await tx.select({id:people.id,displayName:people.displayName,
    canHold:sql<boolean>`exists(select 1 from ${permissionGrants} where ${permissionGrants.serviceId}=${serviceMembers.serviceId} and ${permissionGrants.personId}=${people.id} and ${permissionGrants.action}='cards.hold' and ${permissionGrants.state}='ACCEPTED')`,
    cardCount:sql<number>`(select count(*)::integer from ${cards} where ${cards.serviceId}=${serviceMembers.serviceId} and ${cards.holderId}=${people.id})`
   }).from(serviceMembers).innerJoin(people,eq(people.id,serviceMembers.personId)).where(and(eq(serviceMembers.serviceId,ownContext.serviceId),eq(serviceMembers.state,"ACCEPTED"),ne(people.id,personId))).orderBy(people.displayName,people.id).limit(pageSize+1).offset(page*pageSize);
   cardholdersHasMore=memberRows.length>pageSize;
   for(const member of memberRows.slice(0,pageSize))cardholders.push({id:member.id,displayName:member.displayName,serviceId:ownContext.serviceId,cardCount:evaluate(ownContext.policy,"cards.read").allowed?member.cardCount:null,canAddCard:member.canHold&&evaluate(ownContext.policy,"cards.request").allowed&&evaluate(ownContext.policy,"cards.manageMembers").allowed});
  }
  return {person,canCreatePrimary,profiles,primaryService,cards:visible,cardCount:count!.value,ownCardCount:count!.own,managedCardCount:count!.value-count!.own,cardMatchCount:matches!.value,cardScope,cardSearch,cardsPage:page,cardsHasMore:rows.length>pageSize,cardholders,cardholdersHasMore,activity,requests,requestPage,requestsHasMore:requestRows.length>20,requestCount:requestTotal!.value,unfinishedRequestCount:unfinishedTotal!.value,requestStatus,requestSearch,fictional:true};
 },{isolationLevel:"repeatable read"});
}

/** Resolve resources to their recorded financial owner before invoking the existing projection/forms. */
export async function getCardholderDashboardDetail(personId:string,input:{card?:string;request?:string;new?:string;manage?:string;transaction?:string}):Promise<CardholderDashboardDetail|null>{
 const chosen=Object.entries(input).filter(([,value])=>value!==undefined);
 if(!chosen.length)return null;
 if(chosen.length!==1)throw new SecurityError("INVALID_REQUEST",422);
 return getDb().transaction(async tx=>{
  await requireServiceReader(tx,personId);
  let serviceId:string|undefined,kind:CardholderDashboardDetail["kind"];
  if(input.card){const [row]=await tx.select({serviceId:cards.serviceId}).from(cards).where(eq(cards.id,uuid(input.card)));serviceId=row?.serviceId;kind="CARD";}
  else if(input.request){const [row]=await tx.select({serviceId:cardRequests.serviceId}).from(cardRequests).where(eq(cardRequests.id,uuid(input.request)));serviceId=row?.serviceId;kind="REQUEST";}
  else if(input.transaction){const [row]=await tx.select({serviceId:serviceActivity.serviceId}).from(serviceActivity).where(eq(serviceActivity.id,uuid(input.transaction)));serviceId=row?.serviceId;kind="ACTIVITY";}
  else if(input.manage){
   serviceId=uuid(input.manage);kind="PEOPLE";
  }else{
   if(input.new!=="1")throw new SecurityError("INVALID_REQUEST",422);
   const [service]=await tx.select().from(services).where(and(eq(services.primaryPersonId,personId),eq(services.kind,"CARDHOLDER")));serviceId=service?.id;kind="NEW";
  }
  if(!serviceId)throw new SecurityError("RESOURCE_UNAVAILABLE",404);
  const workspace=await getWorkspaceInTransaction(tx,personId,serviceId);
  if(workspace.cardholderRole==="NONE")throw new SecurityError("RESOURCE_UNAVAILABLE",404);
  if(kind==="CARD"&&!workspace.cards.some(card=>card.id===input.card?.toLowerCase()))throw new SecurityError("RESOURCE_UNAVAILABLE",404);
  if(kind==="REQUEST"&&!workspace.cardRequests.some(request=>request.id===input.request?.toLowerCase()))throw new SecurityError("RESOURCE_UNAVAILABLE",404);
  if(kind==="ACTIVITY"&&!workspace.activity.some(item=>item.id===input.transaction?.toLowerCase()&&item.cardId))throw new SecurityError("RESOURCE_UNAVAILABLE",404);
  if(kind==="NEW"&&!workspace.capabilities.some(cap=>cap.action==="cards.request"&&cap.allowed))throw new SecurityError("ACTION_DENIED",403);
  if(kind==="PEOPLE"&&(workspace.cardholderRole!=="PRIMARY"||!workspace.capabilities.some(cap=>cap.action==="people.read"&&cap.allowed)))throw new SecurityError("ACTION_DENIED",403);
  if(kind==="CARD"){
   const receipts=await tx.select({id:workspaceCommands.commandId,kind:workspaceCommands.kind,actorName:people.displayName,occurredAt:workspaceCommands.createdAt}).from(workspaceCommands).innerJoin(people,eq(people.id,workspaceCommands.actorId)).where(and(eq(workspaceCommands.serviceId,serviceId),eq(workspaceCommands.resourceId,uuid(input.card!)),inArray(workspaceCommands.kind,["card.freeze","card.unfreeze"]))).orderBy(desc(workspaceCommands.createdAt),workspaceCommands.commandId).limit(101);
   return {kind,workspace,cardHistory:{events:receipts.slice(0,100).map(event=>({id:event.id,label:event.kind==="card.freeze"?"Freeze recorded":"Unfreeze recorded",actorName:event.actorName,occurredAt:event.occurredAt.toISOString()})),hasEarlierEvents:receipts.length>100}};
  }
  if(kind==="REQUEST"){
   const requestId=uuid(input.request!);
   const [row]=await tx.select({createdAt:cardRequests.createdAt}).from(cardRequests).where(and(eq(cardRequests.id,requestId),eq(cardRequests.serviceId,serviceId)));
   const labels:Record<string,string>={"card-request.start":"Request started","card-request.update":"Card details saved","card-request.submit":"Card creation checked","card-request.cancel":"Request canceled"};
   const receipts=await tx.select({id:workspaceCommands.commandId,kind:workspaceCommands.kind,occurredAt:workspaceCommands.createdAt}).from(workspaceCommands).where(and(eq(workspaceCommands.serviceId,serviceId),eq(workspaceCommands.resourceId,requestId),inArray(workspaceCommands.kind,Object.keys(labels)))).orderBy(desc(workspaceCommands.createdAt),workspaceCommands.commandId).limit(101);
   return {kind,workspace,requestHistory:{createdAt:row!.createdAt.toISOString(),events:receipts.slice(0,100).map(event=>({id:event.id,label:labels[event.kind]!,occurredAt:event.occurredAt.toISOString()})),hasEarlierEvents:receipts.length>100}};
  }
  return {kind,workspace};
 },{isolationLevel:"repeatable read"});
}

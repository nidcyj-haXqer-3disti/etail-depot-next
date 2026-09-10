import {randomUUID} from "node:crypto";
import {afterAll,describe,expect,it} from "vitest";
import {and,eq,sql} from "drizzle-orm";
import {getDb,closeDatabase} from "../../src/platform/database/client";
import {services,serviceMembers,eventOutbox,identityBindings,people,sessions,cards,cardRequests} from "../../src/platform/database/schema";
import {bindIdentity,createCardholderService,getServiceForPerson,listServicesForPerson} from "../../src/modules/services/service";
import {SessionService} from "../../src/modules/identity";
import {sessionRepository} from "../../src/platform/database/session-repository";
import {person} from "../helpers/access";
afterAll(closeDatabase);
describe("fresh native PostgreSQL service foundation",()=>{
 it("rolls back domain records and outbox together",async()=>{
  expect((await getDb().execute(sql`select version() as version`)).rows[0]!.version).toMatch(/^PostgreSQL /);
  const id=randomUUID();await expect(getDb().transaction(async tx=>{await tx.insert(people).values({id,displayName:"Rollback"});await tx.insert(eventOutbox).values({businessKey:`rollback:${id}`,kind:"test.rollback",aggregateId:id});throw new Error("rollback");})).rejects.toThrow("rollback");
  expect(await getDb().select().from(people).where(eq(people.id,id))).toEqual([]);expect(await getDb().select().from(eventOutbox).where(eq(eventOutbox.aggregateId,id))).toEqual([]);
 });
 it("binds identity once without manufacturing any service",async()=>{
  const subject=randomUUID(),identity=await bindIdentity("urn:test",subject);expect(await bindIdentity("urn:test",subject)).toEqual(identity);expect(await listServicesForPerson(identity.personId)).toEqual([]);expect(await getDb().select().from(eventOutbox).where(eq(eventOutbox.aggregateId,identity.identityId))).toHaveLength(1);
 });
 it("enrolls one primary service with a retry-safe command, without issuing a card",async()=>{
  const owner=await person(),command={commandId:randomUUID()};const service=await createCardholderService(owner.personId,command);expect(await createCardholderService(owner.personId,command)).toEqual(service);
  expect(await listServicesForPerson(owner.personId)).toMatchObject([{id:service.serviceId,kind:"CARDHOLDER",role:"PRIMARY",primaryPersonId:owner.personId}]);
  expect(await getDb().select().from(cards).where(eq(cards.serviceId,service.serviceId))).toEqual([]);
  await expect(createCardholderService(owner.personId,{commandId:randomUUID()})).rejects.toMatchObject({code:"CARDHOLDER_SERVICE_EXISTS"});
 });
 it("rejects old account types, cross-person sessions and merchant-owned cards in SQL",async()=>{
  const a=await person(),b=await person();const [merchant]=await getDb().insert(services).values({kind:"MERCHANT",primaryPersonId:a.personId,displayName:"Merchant"}).returning();
  await getDb().insert(serviceMembers).values({serviceId:merchant!.id,personId:a.personId,state:"ACCEPTED"});
  const cardService=await createCardholderService(a.personId,{commandId:randomUUID()});
  const [request]=await getDb().insert(cardRequests).values({serviceId:cardService.serviceId,creatorId:a.personId,holderId:a.personId,nickname:"Card provenance",requestedLimitMinor:1n}).returning();
  await expect(getDb().insert(cards).values({serviceId:merchant!.id,requestId:request!.id,holderId:a.personId,nickname:"Wrong service",lastFour:"0000",format:"VIRTUAL",limitMinor:1n})).rejects.toThrow();
  await expect(getDb().execute(sql`insert into cards ("serviceId","holderId",nickname,"lastFour",format,"limitMinor") values (${cardService.serviceId},${a.personId},'Missing request','0000','VIRTUAL',1)`)).rejects.toThrow();
  await expect(getDb().execute(sql`insert into services (kind,"primaryPersonId","displayName") values ('HOUSEHOLD',${a.personId},'Invalid old kind')`)).rejects.toThrow();
  await expect(getDb().insert(sessions).values({tokenHash:"a".repeat(64),identityId:a.identityId,personId:b.personId,issuedAt:new Date(),expiresAt:new Date(Date.now()+60000)})).rejects.toThrow();
 });
 it("requires exact current membership and excludes a revoked service from the directory",async()=>{
  const owner=await person(),secondary=await person(),foreign=await person();const {serviceId}=await createCardholderService(owner.personId,{commandId:randomUUID()});
  await getDb().insert(serviceMembers).values({serviceId,personId:secondary.personId,state:"ACCEPTED"});
  expect(await getServiceForPerson(secondary.personId,serviceId)).toMatchObject({role:"SECONDARY",peopleCount:null});
  await expect(getServiceForPerson(foreign.personId,serviceId)).rejects.toMatchObject({code:"SERVICE_UNAVAILABLE"});
  await getDb().update(serviceMembers).set({state:"REVOKED",version:2}).where(and(eq(serviceMembers.serviceId,serviceId),eq(serviceMembers.personId,secondary.personId)));
  await expect(getServiceForPerson(secondary.personId,serviceId)).rejects.toMatchObject({code:"SERVICE_UNAVAILABLE"});expect(await listServicesForPerson(secondary.personId)).toEqual([]);
 });
 it("stores only a session hash and revokes subsequent use",async()=>{
  const identity=await person(),service=new SessionService(sessionRepository,{appEnv:"test",publicOrigin:"http://127.0.0.1:3100"});const issued=await service.issue(identity),cookie=issued.cookie.split(";")[0]!;
  expect(await service.authenticate(cookie)).toMatchObject(identity);expect(issued.record.tokenHash).not.toBe(cookie.split("=")[1]);await service.revokeIdentity(identity.identityId);expect(await service.authenticate(cookie)).toBeNull();expect(await getDb().select().from(identityBindings).where(eq(identityBindings.id,identity.identityId))).toHaveLength(1);
 });
});

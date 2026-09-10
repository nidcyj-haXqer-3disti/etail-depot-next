import { randomUUID } from "node:crypto";
import { afterAll, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { bindIdentity, createCardholderService, listServicesForPerson } from "../../src/modules/services/service";
import { getDb,closeDatabase } from "../../src/platform/database/client";
import { eventOutbox,sessions,cardholderCreationCommands,cards } from "../../src/platform/database/schema";
import { SessionService } from "../../src/modules/identity";
import { sessionRepository } from "../../src/platform/database/session-repository";
import {cardPerson} from "../helpers/cardholder";
afterAll(closeDatabase);
it("eight concurrent identity deliveries produce one person and outbox event without enrolling a service",async()=>{
  const subject=randomUUID();
  const deliveries=await Promise.all(Array.from({length:8},()=>bindIdentity("urn:concurrency",subject)));
  expect(new Set(deliveries.map(x=>x.personId)).size).toBe(1);expect(new Set(deliveries.map(x=>x.identityId)).size).toBe(1);
  expect(await listServicesForPerson(deliveries[0]!.personId)).toEqual([]);
  expect(await getDb().select().from(eventOutbox).where(eq(eventOutbox.aggregateId,deliveries[0]!.identityId))).toHaveLength(1);
});
it("concurrent session rotations accept one replacement and invalidate the original",async()=>{
  const identity=await bindIdentity("urn:concurrency",randomUUID());
  const service=new SessionService(sessionRepository,{appEnv:"test",publicOrigin:"http://127.0.0.1:3100"});
  const original=await service.issue(identity);const cookie=original.cookie.split(";")[0]!;
  const results=await Promise.all(Array.from({length:6},()=>service.rotate(cookie)));
  expect(results.filter(Boolean)).toHaveLength(1);expect(await service.authenticate(cookie)).toBeNull();
  const rows=await getDb().select().from(sessions).where(eq(sessions.identityId,identity.identityId));
  expect(rows.filter(row=>row.revokedAt===null)).toHaveLength(1);
  expect(await service.authenticate(results.find(Boolean)!.cookie.split(";")[0]!)).not.toBeNull();
});

it("concurrent explicit Cardholder enrollment retries produce one service and one receipt without issuing cards",async()=>{
 const personId=await cardPerson("Concurrent Cardholder applicant"),input={commandId:randomUUID(),displayName:"My cards"};
 const deliveries=await Promise.all(Array.from({length:8},()=>createCardholderService(personId,input)));
 expect(new Set(deliveries.map(row=>row.serviceId)).size).toBe(1);
 expect(await listServicesForPerson(personId)).toMatchObject([{id:deliveries[0]!.serviceId,kind:"CARDHOLDER",cardholderRole:"PRIMARY"}]);
 expect(await getDb().select().from(cardholderCreationCommands).where(eq(cardholderCreationCommands.commandId,input.commandId))).toHaveLength(1);
 expect(await getDb().select().from(cards).where(eq(cards.serviceId,deliveries[0]!.serviceId))).toEqual([]);
});

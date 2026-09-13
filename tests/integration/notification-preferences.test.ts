import {randomUUID} from "node:crypto";
import {afterAll,expect,it} from "vitest";
import {and,eq} from "drizzle-orm";
import {closeDatabase,getDb} from "../../src/platform/database/client";
import {notificationPreferences,permissionGrants,serviceMembers,workspaceCommands} from "../../src/platform/database/schema";
import {getNotificationPreferences,saveNotificationPreferences} from "../../src/modules/workspace/service";
import {notificationOverviewSchema} from "../../src/shared/notification-response";
import {cardPerson,cardPrimary,enrollCardholder} from "../helpers/cardholder";
afterAll(closeDatabase);

it("reads and writes only the person's exact card-account preferences without requiring financial data",async()=>{
  const owner=await cardPrimary("Preference account"),other=await cardPrimary("Separate account"),holder=await cardPerson("Preference cardholder");
  await enrollCardholder(owner.personId,owner.serviceId,holder);
  await enrollCardholder(other.personId,other.serviceId,holder);
  const initial=notificationOverviewSchema.parse(await getNotificationPreferences(holder,owner.serviceId));
  expect(initial).toEqual({personId:holder,serviceId:owner.serviceId,canManage:true,preferences:{serviceActivity:true,cardControls:true,caseUpdates:true,version:1,delivery:"SAVED_ONLY"}});
  const input={commandId:randomUUID(),expectedPersonId:holder,expectedVersion:1,serviceActivity:false,cardControls:true,caseUpdates:false};
  await saveNotificationPreferences(holder,owner.serviceId,input);
  expect((await getNotificationPreferences(holder,other.serviceId)).preferences.version).toBe(1);
  expect((await getNotificationPreferences(owner.personId,owner.serviceId)).preferences.serviceActivity).toBe(true);
  await expect(getNotificationPreferences(other.personId,owner.serviceId)).rejects.toMatchObject({code:"SERVICE_UNAVAILABLE"});
  await getDb().update(permissionGrants).set({state:"REVOKED"}).where(and(eq(permissionGrants.serviceId,owner.serviceId),eq(permissionGrants.personId,holder),eq(permissionGrants.action,"cards.read")));
  expect((await getNotificationPreferences(holder,owner.serviceId)).preferences.serviceActivity).toBe(false);
});

it("preserves the saved command across stale versions and replays, with access checked before every replay",async()=>{
  const owner=await cardPrimary("Preference retries");
  const first={commandId:randomUUID(),expectedPersonId:owner.personId,expectedVersion:1,serviceActivity:false,cardControls:true,caseUpdates:false};
  await saveNotificationPreferences(owner.personId,owner.serviceId,first);
  await expect(saveNotificationPreferences(owner.personId,owner.serviceId,{...first,commandId:randomUUID()})).rejects.toMatchObject({code:"STALE_VERSION"});
  await expect(saveNotificationPreferences(owner.personId,owner.serviceId,{...first,serviceActivity:true})).rejects.toMatchObject({code:"IDEMPOTENCY_CONFLICT"});
  const second={...first,commandId:randomUUID(),expectedVersion:2,serviceActivity:true};
  await saveNotificationPreferences(owner.personId,owner.serviceId,second);
  expect(await saveNotificationPreferences(owner.personId,owner.serviceId,first)).toMatchObject({version:3,serviceActivity:true});
  expect(await getDb().select().from(notificationPreferences).where(and(eq(notificationPreferences.personId,owner.personId),eq(notificationPreferences.serviceId,owner.serviceId)))).toHaveLength(1);
  expect(await getDb().select().from(workspaceCommands).where(eq(workspaceCommands.commandId,first.commandId))).toHaveLength(1);
  await getDb().update(permissionGrants).set({state:"REVOKED"}).where(and(eq(permissionGrants.personId,owner.personId),eq(permissionGrants.serviceId,owner.serviceId),eq(permissionGrants.action,"notifications.manage")));
  expect((await getNotificationPreferences(owner.personId,owner.serviceId)).canManage).toBe(false);
  await expect(saveNotificationPreferences(owner.personId,owner.serviceId,first)).rejects.toMatchObject({code:"ACTION_DENIED"});
  await getDb().update(serviceMembers).set({state:"REVOKED",version:2}).where(and(eq(serviceMembers.personId,owner.personId),eq(serviceMembers.serviceId,owner.serviceId)));
  await expect(getNotificationPreferences(owner.personId,owner.serviceId)).rejects.toMatchObject({code:"SERVICE_UNAVAILABLE"});
});

it("rejects a switched person in the same account before equal-version preferences can be changed",async()=>{
  const owner=await cardPrimary("Shared preference account"),displayed=await cardPerson("Displayed preference editor"),current=await cardPerson("Current preference editor");
  await enrollCardholder(owner.personId,owner.serviceId,displayed);await enrollCardholder(owner.personId,owner.serviceId,current);
  const beforeDisplayed=await getNotificationPreferences(displayed,owner.serviceId),beforeCurrent=await getNotificationPreferences(current,owner.serviceId);
  expect(beforeDisplayed.preferences.version).toBe(beforeCurrent.preferences.version);expect(beforeCurrent.canManage).toBe(true);
  const input={commandId:randomUUID(),expectedPersonId:displayed,expectedVersion:beforeDisplayed.preferences.version,serviceActivity:false,cardControls:false,caseUpdates:false};
  await expect(saveNotificationPreferences(current,owner.serviceId,input)).rejects.toMatchObject({code:"PREFERENCES_PERSON_CHANGED",status:403});
  expect(await getNotificationPreferences(current,owner.serviceId)).toEqual(beforeCurrent);
  expect(await getNotificationPreferences(displayed,owner.serviceId)).toEqual(beforeDisplayed);
  expect(await getDb().select().from(workspaceCommands).where(eq(workspaceCommands.commandId,input.commandId))).toHaveLength(0);
  expect(await getDb().select().from(notificationPreferences).where(and(eq(notificationPreferences.serviceId,owner.serviceId),eq(notificationPreferences.personId,current)))).toHaveLength(0);
  await saveNotificationPreferences(displayed,owner.serviceId,input);
  expect((await getNotificationPreferences(displayed,owner.serviceId)).preferences).toMatchObject({version:2,serviceActivity:false,cardControls:false,caseUpdates:false});
  expect(await getNotificationPreferences(current,owner.serviceId)).toEqual(beforeCurrent);
  expect(await getDb().select().from(workspaceCommands).where(eq(workspaceCommands.commandId,input.commandId))).toHaveLength(1);
});

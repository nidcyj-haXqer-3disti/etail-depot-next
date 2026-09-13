import {randomUUID} from "node:crypto";
import {eq} from "drizzle-orm";
import {afterAll,describe,expect,it} from "vitest";
import targets from "../../project-targets.json" with {type:"json"};
import {getDb,closeDatabase} from "../../src/platform/database/client";
import {eventOutbox,people,services,serviceMembers} from "../../src/platform/database/schema";
import {sessionRepository} from "../../src/platform/database/session-repository";
import {SessionService} from "../../src/modules/identity/session";
import {profileCommands} from "../../src/modules/identity/profile-schema";
import {getPersonalProfile,updatePersonalProfile} from "../../src/modules/identity/profile-service";
import {bindIdentity,createCardholderService} from "../../src/modules/services/service";
import {sandboxParticipants} from "../../src/modules/sandbox/schema";
import {startSandbox} from "../../src/modules/sandbox/service";

const issuer=`${targets.netlify.canonical_origin}/.netlify/identity`;
const sessionService=new SessionService(sessionRepository,{appEnv:"test",publicOrigin:"http://127.0.0.1:3100"});
async function person(name="Initial name",verified=false){
  const subject=randomUUID(),identity=await bindIdentity(issuer,subject,name);
  const session=await sessionService.issue(identity,verified?{issuer,subject,verifiedEmail:{emailNormalized:"preferred@example.test",verifiedAt:"2026-09-12T00:00:00.000Z",provenance:"NETLIFY_USER_CONFIRMED"}}:undefined);
  return {...identity,...session,subject};
}
afterAll(closeDatabase);
describe("independent personal profile",()=>{
  it("edits the existing preferred name without enrollment, membership or verified email changes",async()=>{
    const identity=await person("Initial name",true),initial=await getPersonalProfile(identity.record);
    expect(initial.signInEmail?.address).toBe("preferred@example.test");
    const saved=await updatePersonalProfile(identity.record,{commandId:randomUUID(),expectedPersonId:identity.personId,expectedVersion:initial.version,displayName:"  Private nickname  "});
    expect(saved.profile).toEqual({...initial,displayName:"Private nickname",version:initial.version+1});
    expect(await getDb().select().from(sandboxParticipants).where(eq(sandboxParticipants.personId,identity.personId))).toEqual([]);
    expect(await getDb().select().from(services).where(eq(services.primaryPersonId,identity.personId))).toEqual([]);
    expect(await getDb().select().from(serviceMembers).where(eq(serviceMembers.personId,identity.personId))).toEqual([]);
  });
  it("keeps service identity independent and versions the original setup write",async()=>{
    const identity=await person();
    await startSandbox(identity.personId,{commandId:randomUUID(),displayName:"First setup name",acknowledged:true});
    const account=await createCardholderService(identity.personId,{commandId:randomUUID(),displayName:"Family cards"});
    const before=await getPersonalProfile(identity.record);expect(before.version).toBe(2);
    await updatePersonalProfile(identity.record,{commandId:randomUUID(),expectedPersonId:identity.personId,expectedVersion:before.version,displayName:"New personal name"});
    expect((await getDb().select().from(services).where(eq(services.id,account.serviceId)))[0]!.displayName).toBe("Family cards");
  });
  it("concurrent retries produce one version, receipt and outbox event",async()=>{
    const identity=await person(),input={commandId:randomUUID(),expectedPersonId:identity.personId,expectedVersion:1,displayName:"Shared attempt"};
    const results=await Promise.all(Array.from({length:6},()=>updatePersonalProfile(identity.record,input)));
    expect(results.every(item=>item.savedVersion===2&&item.profile.version===2)).toBe(true);
    expect(await getDb().select().from(profileCommands).where(eq(profileCommands.commandId,input.commandId))).toHaveLength(1);
    expect(await getDb().select().from(eventOutbox).where(eq(eventOutbox.businessKey,`profile-updated:${input.commandId}`))).toHaveLength(1);
    await expect(updatePersonalProfile(identity.record,{...input,displayName:"Different"})).rejects.toMatchObject({code:"IDEMPOTENCY_CONFLICT"});
    const stranger=await person();await expect(updatePersonalProfile(stranger.record,{...input,expectedPersonId:stranger.personId})).rejects.toMatchObject({code:"IDEMPOTENCY_CONFLICT"});
  });
  it("competing edits reject one stale version and old replay never overwrites the newer name",async()=>{
    const identity=await person(),base={expectedPersonId:identity.personId,expectedVersion:1,displayName:"First"};
    const commands=[{...base,commandId:randomUUID()},{...base,commandId:randomUUID(),displayName:"Second"}];
    const outcomes=await Promise.allSettled(commands.map(input=>updatePersonalProfile(identity.record,input)));
    expect(outcomes.filter(item=>item.status==="fulfilled")).toHaveLength(1);
    expect(outcomes.find(item=>item.status==="rejected")).toMatchObject({reason:{code:"STALE_VERSION"}});
    const winner=commands[outcomes.findIndex(item=>item.status==="fulfilled")]!;
    await updatePersonalProfile(identity.record,{commandId:randomUUID(),expectedPersonId:identity.personId,expectedVersion:2,displayName:"Newest"});
    expect(await updatePersonalProfile(identity.record,winner)).toMatchObject({savedVersion:2,profile:{version:3,displayName:"Newest"}});
  });
  it("rechecks current session and exact identity before reads or command replays",async()=>{
    const identity=await person(),other=await person(),input={commandId:randomUUID(),expectedPersonId:identity.personId,expectedVersion:1,displayName:"Saved"};
    await updatePersonalProfile(identity.record,input);
    await expect(getPersonalProfile({...identity.record,personId:other.personId})).rejects.toMatchObject({status:401});
    await expect(updatePersonalProfile(identity.record,{...input,personId:other.personId})).rejects.toMatchObject({code:"INVALID_REQUEST"});
    await sessionService.logout(identity.cookie.split(";",1)[0]!);
    await expect(updatePersonalProfile(identity.record,input)).rejects.toMatchObject({status:401});
    await expect(getPersonalProfile(identity.record)).rejects.toMatchObject({status:401});
    expect((await getDb().select().from(people).where(eq(people.id,other.personId)))[0]!.displayName).toBe("Initial name");
  });
  it("rejects a different displayed person before a matching-version command can change the current identity",async()=>{
    const displayed=await person("Displayed person"),current=await person("Current person");
    const beforeDisplayed=await getPersonalProfile(displayed.record),beforeCurrent=await getPersonalProfile(current.record);
    expect(beforeDisplayed.version).toBe(beforeCurrent.version);
    const input={commandId:randomUUID(),expectedPersonId:displayed.personId,expectedVersion:beforeDisplayed.version,displayName:"Intended only for displayed person"};
    await expect(updatePersonalProfile(current.record,input)).rejects.toMatchObject({code:"PROFILE_PERSON_CHANGED",status:403});
    expect(await getPersonalProfile(current.record)).toEqual(beforeCurrent);
    expect(await getPersonalProfile(displayed.record)).toEqual(beforeDisplayed);
    expect(await getDb().select().from(profileCommands).where(eq(profileCommands.commandId,input.commandId))).toHaveLength(0);
    expect(await getDb().select().from(eventOutbox).where(eq(eventOutbox.businessKey,`profile-updated:${input.commandId}`))).toHaveLength(0);
    const recovered=await updatePersonalProfile(displayed.record,input);
    expect(recovered.profile).toMatchObject({personId:displayed.personId,displayName:input.displayName,version:beforeDisplayed.version+1});
    expect(await getPersonalProfile(current.record)).toEqual(beforeCurrent);
  });
  it("reads independently refreshed verified contact without changing the personal name version",async()=>{
    const identity=await person("Stable display name"),before=await getPersonalProfile(identity.record);
    expect(before.signInEmail).toBeNull();
    await sessionService.issue(identity,{issuer,subject:identity.subject,verifiedEmail:{emailNormalized:"updated-contact@example.test",verifiedAt:"2026-09-12T00:00:00.000Z",provenance:"NETLIFY_USER_CONFIRMED"}});
    expect(await getPersonalProfile(identity.record)).toEqual({...before,signInEmail:{address:"updated-contact@example.test",verifiedAt:"2026-09-12T00:00:00.000Z"}});
    expect(await getDb().select().from(profileCommands).where(eq(profileCommands.personId,identity.personId))).toHaveLength(0);
  });
});

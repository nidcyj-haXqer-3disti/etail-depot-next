import {randomUUID} from "node:crypto";
import {describe,expect,it} from "vitest";
import {personalProfileSchema,readProfileUpdate,updatePersonalProfileSchema} from "../../src/shared/personal-profile";
import {createPendingProfileRegistry} from "../../src/ui/pending-profile";

describe("personal profile contracts and unknown edits",()=>{
  it("accepts preferred names while rejecting extra authority and invalid input",()=>{
    const input={commandId:randomUUID(),expectedPersonId:randomUUID(),expectedVersion:1,displayName:"  Alex  "};
    expect(updatePersonalProfileSchema.parse(input).displayName).toBe("Alex");
    for(const displayName of ["", " ","x".repeat(81),"A\u0000B","A\nB"])
      expect(updatePersonalProfileSchema.safeParse({...input,displayName}).success).toBe(false);
    for(const extra of [{personId:randomUUID()},{serviceId:randomUUID()},{email:"other@example.test"},{role:"OWNER"}])
      expect(updatePersonalProfileSchema.safeParse({...input,...extra}).success).toBe(false);
    expect(updatePersonalProfileSchema.safeParse({...input,expectedPersonId:undefined}).success).toBe(false);
  });
  it("binds the save to exact command, person, version and original name",()=>{
    const personId=randomUUID(),attempt={commandId:randomUUID(),expectedPersonId:personId,expectedVersion:2,displayName:"Preferred name"};
    const profile={personId,displayName:attempt.displayName,version:3,signInEmail:null};
    const response={commandId:attempt.commandId,savedVersion:3,profile};
    expect(readProfileUpdate(response,personId,attempt)).toEqual(response);
    for(const changed of [{...response,commandId:randomUUID()},{...response,savedVersion:4},{...response,profile:{...profile,personId:randomUUID()}},{...response,profile:{...profile,version:2}},{...response,profile:{...profile,displayName:"Wrong name"}},{...response,authority:true}])expect(readProfileUpdate(changed,personId,attempt)).toBeNull();
    expect(readProfileUpdate({...response,profile:{...profile,version:4,displayName:"Newer saved name"}},personId,attempt)).not.toBeNull();
    expect(readProfileUpdate(response,personId,{...attempt,expectedPersonId:randomUUID()})).toBeNull();
    expect(personalProfileSchema.safeParse({...profile,signInEmail:{address:"alex@example.test",verifiedAt:"2026-09-13T12:00:00.000Z",token:"secret"}}).success).toBe(false);
  });
  it("retains the exact first edit across navigation, mismatched attempts and other identities",()=>{
    const registry=createPendingProfileRegistry(),personId=randomUUID(),other=randomUUID();
    const original={commandId:randomUUID(),expectedPersonId:personId,expectedVersion:1,displayName:"First"};
    expect(registry.begin(other,original)).toBe(false);
    expect(registry.hasPending()).toBe(false);
    expect(registry.begin(personId,original)).toBe(true);
    expect(registry.begin(personId,original)).toBe(false);
    registry.retain(personId,original.commandId);
    expect(registry.get(other)).toBeNull();
    expect(registry.begin(personId,{...original,commandId:randomUUID()})).toBe(false);
    expect(registry.begin(personId,{...original,displayName:"Replacement"})).toBe(true);
    expect(registry.get(personId)?.attempt).toEqual(original);
    registry.finish(personId,randomUUID());expect(registry.hasPending()).toBe(true);
    registry.finish(personId,original.commandId);expect(registry.hasPending()).toBe(false);
  });
});

import {describe,expect,it} from "vitest";
import {parseNotificationOverview,parseNotificationSave} from "../../src/shared/notification-response";
import {createNotificationPreferencesRegistry} from "../../src/ui/pending-notification-preferences";
import {notificationCommandSchema} from "../../src/modules/workspace/contracts";

const scope={personId:"00000000-0000-4000-8000-000000000001",serviceId:"00000000-0000-4000-8000-000000000002"};
const input={commandId:"00000000-0000-4000-8000-000000000003",expectedPersonId:scope.personId,expectedVersion:3,serviceActivity:false,cardControls:true,caseUpdates:false};
const saved={...scope,commandId:input.commandId,serviceActivity:false,cardControls:true,caseUpdates:false,version:4,delivery:"SAVED_ONLY"};

describe("notification acknowledgements",()=>{
  it("accepts only exact account, person and command acknowledgements",()=>{
    expect(parseNotificationSave(saved,scope,input)).toEqual({serviceActivity:false,cardControls:true,caseUpdates:false,version:4,delivery:"SAVED_ONLY"});
    for(const field of ["personId","serviceId","commandId"] as const)expect(()=>parseNotificationSave({...saved,[field]:"00000000-0000-4000-8000-000000000099"},scope,input)).toThrow();
    expect(()=>parseNotificationSave(saved,scope,{...input,expectedPersonId:saved.commandId})).toThrow();
    expect(notificationCommandSchema.safeParse({...input,expectedPersonId:undefined}).success).toBe(false);
  });
  it.each([{},null,{...saved,delivery:"SENT"},{...saved,cardControls:"true"},{...saved,version:3},{...saved,caseUpdates:true},{...saved,privateData:"unexpected"}])("rejects malformed or mismatched success without accepting it: %j",value=>{
    expect(()=>parseNotificationSave(value,scope,input)).toThrow();
  });
  it("accepts a later authoritative state on a replay without rolling it back",()=>{
    expect(parseNotificationSave({...saved,version:5,serviceActivity:true},scope,input)).toMatchObject({version:5,serviceActivity:true});
  });
  it("checks the reload scope and includes no card/activity projection",()=>{
    const overview={...scope,canManage:false,preferences:{serviceActivity:true,cardControls:true,caseUpdates:true,version:4,delivery:"SAVED_ONLY"}};
    expect(parseNotificationOverview(overview,scope).canManage).toBe(false);
    expect(()=>parseNotificationOverview({...overview,personId:saved.commandId},scope)).toThrow();
    expect(()=>parseNotificationOverview({...overview,serviceId:saved.commandId},scope)).toThrow();
    expect(()=>parseNotificationOverview({...overview,cards:[]},scope)).toThrow();
  });
});

describe("volatile notification recovery",()=>{
  it("retains the first immutable choices across remounts and rejects replacement or overlapping requests",()=>{
    const pending=createNotificationPreferencesRegistry(),attempt={...scope,...input};
    expect(pending.begin(attempt)).toBe(true);expect(pending.begin(attempt)).toBe(false);
    attempt.serviceActivity=true;pending.retainUnknown(attempt);
    expect(pending.get(scope)?.attempt.serviceActivity).toBe(false);
    expect(Object.isFrozen(pending.get(scope)?.attempt)).toBe(true);
    expect(pending.begin({...attempt,commandId:"replacement"})).toBe(false);
    expect(pending.begin(attempt)).toBe(true);expect(pending.get(scope)?.attempt.serviceActivity).toBe(false);
  });
  it("never exposes an attempt through another person or account, and clears only the matching acknowledgement",()=>{
    const pending=createNotificationPreferencesRegistry(),attempt={...scope,...input};
    expect(pending.begin({...attempt,personId:"another-person"})).toBe(false);expect(pending.hasPending()).toBe(false);
    pending.begin(attempt);pending.retainUnknown(attempt);
    expect(pending.get({...scope,personId:"another-person"})).toBeNull();
    expect(pending.get({...scope,serviceId:"another-service"})).toBeNull();
    pending.finish({...attempt,commandId:"wrong-ack"});expect(pending.hasPending()).toBe(true);
    pending.finish(attempt);expect(pending.hasPending()).toBe(false);
  });
  it("keeps stable snapshots and clears retained choices only on acknowledged signout",()=>{
    const pending=createNotificationPreferencesRegistry();let changes=0;const stop=pending.subscribe(()=>{changes++;});
    pending.begin({...scope,...input});const snapshot=pending.get(scope);expect(pending.get(scope)).toBe(snapshot);
    pending.retainUnknown({...scope,...input});expect(pending.get(scope)).not.toBe(snapshot);
    expect(changes).toBe(2);pending.clearAfterSignOut();expect(pending.get(scope)).toBeNull();expect(changes).toBe(3);stop();
  });
});

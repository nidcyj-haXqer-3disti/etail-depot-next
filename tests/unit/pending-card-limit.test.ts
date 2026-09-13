import {describe,expect,it} from "vitest";
import {createPendingCardLimitRegistry,type PendingCardLimitAttempt} from "../../src/ui/pending-card-limit";

const attempt:PendingCardLimitAttempt={personId:"person-a",serviceId:"service-a",cardId:"card-a",commandId:"original-command",expectedVersion:4,allowanceMinor:"1723"};
describe("volatile card-limit recovery",()=>{
 it("retains the exact immutable command after its component and request finish without a confirmed result",()=>{
  const pending=createPendingCardLimitRegistry(),input={...attempt};
  expect(pending.begin(input)).toBe(true);
  input.allowanceMinor="9900";input.expectedVersion=12;
  pending.retainUnknown(attempt);
  expect(pending.get(attempt)).toEqual({attempt,inFlight:false,uncertain:true});
  expect(Object.isFrozen(pending.get(attempt)!.attempt)).toBe(true);
  // Reading again represents a later page mount. It cannot replace the first command.
  expect(pending.begin({...attempt,allowanceMinor:"2500",expectedVersion:5})).toBe(true);
  expect(pending.get(attempt)?.attempt).toEqual(attempt);
 });
 it("never returns a retained limit through another person, service or card scope",()=>{
  const pending=createPendingCardLimitRegistry();pending.begin(attempt);pending.retainUnknown(attempt);
  expect(pending.get({...attempt,personId:"person-b"})).toBeNull();
  expect(pending.get({...attempt,serviceId:"service-b"})).toBeNull();
  expect(pending.get({...attempt,cardId:"card-b"})).toBeNull();
  expect(pending.get(null)).toBeNull();
  expect(pending.get(attempt)?.attempt.commandId).toBe(attempt.commandId);
 });
 it("suppresses a concurrent retry and a replacement command until the original is acknowledged",()=>{
  const pending=createPendingCardLimitRegistry();expect(pending.begin(attempt)).toBe(true);
  expect(pending.begin(attempt)).toBe(false);
  pending.retainUnknown(attempt);
  expect(pending.begin({...attempt,commandId:"replacement"})).toBe(false);
  pending.finish({...attempt,commandId:"unrelated-acknowledgement"});
  expect(pending.hasPending()).toBe(true);
  expect(pending.begin(attempt)).toBe(true);pending.finish(attempt);
  expect(pending.hasPending()).toBe(false);
  expect(pending.begin({...attempt,commandId:"next-change",expectedVersion:5})).toBe(true);
 });
 it("keeps a stable snapshot between changes, notifies subscribers and only clears all records for acknowledged sign-out",()=>{
  const pending=createPendingCardLimitRegistry();let updates=0;
  const stop=pending.subscribe(()=>{updates++;});pending.begin(attempt);
  const first=pending.get(attempt);expect(pending.get(attempt)).toBe(first);
  pending.retainUnknown(attempt);expect(pending.get(attempt)).not.toBe(first);
  pending.begin({...attempt,personId:"person-b",commandId:"other-owner-command"});
  expect(updates).toBe(3);expect(pending.hasPending()).toBe(true);
  pending.clearAfterSignOut();expect(updates).toBe(4);expect(pending.hasPending()).toBe(false);
  stop();pending.begin(attempt);expect(updates).toBe(4);
 });
});

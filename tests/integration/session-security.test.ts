import { randomUUID } from "node:crypto";
import { afterAll, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { bindIdentity } from "../../src/modules/services/service";
import { SessionService } from "../../src/modules/identity";
import { getActiveSessions, revokeSelectedSessions } from "../../src/modules/identity/security";
import { sessionOverviewSchema } from "../../src/modules/identity/security-contracts";
import { sessionRepository } from "../../src/platform/database/session-repository";
import { closeDatabase, getDb } from "../../src/platform/database/client";
import { sessions } from "../../src/platform/database/schema";

afterAll(closeDatabase);
const auth = new SessionService(sessionRepository,{appEnv:"test",publicOrigin:"http://127.0.0.1:3100"});
const cookie = (value:string) => value.split(";")[0]!;
async function fixture() {
  const identity=await bindIdentity("urn:session-security",randomUUID());
  return {current:await auth.issue(identity),other:await auth.issue(identity),identity};
}
it("lists only this person's live sign-ins and never returns session credentials",async()=>{
  const {current,other}=await fixture();
  const foreign=await fixture();
  const overview=sessionOverviewSchema.parse(await getActiveSessions(current.record));
  expect(overview.sessions.map(item=>item.id).sort()).toEqual([current.record.familyId,other.record.familyId].sort());
  expect(overview.sessions[0]?.current).toBe(true);
  for(const secret of [current.record.tokenHash,other.record.tokenHash,current.cookie,foreign.current.record.familyId])expect(JSON.stringify(overview)).not.toContain(secret);
  await getDb().update(sessions).set({expiresAt:new Date(Date.now()-1000),issuedAt:new Date(Date.now()-2000)}).where(eq(sessions.tokenHash,other.record.tokenHash));
  expect((await getActiveSessions(current.record)).sessions).toHaveLength(1);
});
it("revokes a rotation family, preserves the current sign-in and does not revoke a newer independent sign-in on retry",async()=>{
  const {current,other,identity}=await fixture();
  const replacement=await auth.rotate(cookie(other.cookie));
  expect(replacement).not.toBeNull();
  const input={familyIds:[other.record.familyId]};
  const after=await revokeSelectedSessions(current.record,input);
  expect(after.sessions).toHaveLength(1);
  expect(await auth.authenticate(cookie(replacement!.cookie))).toBeNull();
  expect(await auth.authenticate(cookie(current.cookie))).not.toBeNull();
  const newSignIn=await auth.issue(identity);
  await revokeSelectedSessions(current.record,input);
  expect(await auth.authenticate(cookie(newSignIn.cookie))).not.toBeNull();
});
it("rejects cross-person targets atomically, including a batch mixed with an owned target",async()=>{
  const {current,other}=await fixture();const foreign=await fixture();
  await expect(revokeSelectedSessions(current.record,{familyIds:[other.record.familyId,foreign.other.record.familyId]})).rejects.toThrow("RESOURCE_UNAVAILABLE");
  expect(await auth.authenticate(cookie(other.cookie))).not.toBeNull();
  expect(await auth.authenticate(cookie(foreign.other.cookie))).not.toBeNull();
});
it("rejects current-session revocation, unknown fields, duplicate targets and a revoked actor",async()=>{
  const {current,other}=await fixture();
  await expect(revokeSelectedSessions(current.record,{familyIds:[current.record.familyId]})).rejects.toThrow("USE_SIGN_OUT");
  expect(()=>revokeSelectedSessions(current.record,{familyIds:[other.record.familyId],personId:randomUUID()})).toThrow("INVALID_REQUEST");
  expect(()=>revokeSelectedSessions(current.record,{familyIds:[other.record.familyId,other.record.familyId]})).toThrow("INVALID_REQUEST");
  await auth.logout(cookie(current.cookie));
  await expect(revokeSelectedSessions(current.record,{familyIds:[other.record.familyId]})).rejects.toThrow("AUTHENTICATION_REQUIRED");
  await expect(getActiveSessions(current.record)).rejects.toThrow("AUTHENTICATION_REQUIRED");
  expect(await auth.authenticate(cookie(other.cookie))).not.toBeNull();
});

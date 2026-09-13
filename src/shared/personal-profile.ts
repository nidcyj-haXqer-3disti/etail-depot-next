import {z} from "zod";

export const displayNameSchema = z.string().trim().min(1).max(80).regex(/^[^\u0000-\u001f\u007f-\u009f]+$/);
export const personalProfileSchema = z.object({
  personId:z.uuid(), displayName:z.string().min(1).max(80), version:z.int().positive(),
  signInEmail:z.object({address:z.email().max(254),verifiedAt:z.iso.datetime()}).strict().nullable(),
}).strict();
export type PersonalProfile = z.infer<typeof personalProfileSchema>;
export const updatePersonalProfileSchema = z.object({commandId:z.uuid(),expectedPersonId:z.uuid(),expectedVersion:z.int().positive(),displayName:displayNameSchema}).strict();
export type ProfileAttempt = z.infer<typeof updatePersonalProfileSchema>;
export const profileUpdateResultSchema = z.object({commandId:z.uuid(),savedVersion:z.int().positive(),profile:personalProfileSchema}).strict();

/** Reject wrong-person/stale/malformed responses without discarding the pending edit. */
export function readProfileUpdate(raw:unknown,personId:string,attempt:ProfileAttempt) {
  const result=profileUpdateResultSchema.safeParse(raw);
  if(!result.success)return null;
  const value=result.data;
  if(attempt.expectedPersonId!==personId || value.commandId!==attempt.commandId || value.profile.personId!==personId || value.savedVersion!==attempt.expectedVersion+1 || value.profile.version<value.savedVersion)return null;
  if(value.profile.version===value.savedVersion && value.profile.displayName!==attempt.displayName)return null;
  return value;
}

import {z} from "zod";
import type {NotificationCommand} from "../modules/workspace/contracts";

export const notificationPreferencesSchema=z.object({
  serviceActivity:z.boolean(),cardControls:z.boolean(),caseUpdates:z.boolean(),
  version:z.int().positive(),delivery:z.literal("SAVED_ONLY"),
}).strict();
export const notificationOverviewSchema=z.object({
  serviceId:z.uuid(),personId:z.uuid(),canManage:z.boolean(),preferences:notificationPreferencesSchema,
}).strict();
export const notificationSaveResponseSchema=notificationPreferencesSchema.extend({
  serviceId:z.uuid(),personId:z.uuid(),commandId:z.uuid(),
}).strict();
export type NotificationOverview=z.infer<typeof notificationOverviewSchema>;
export type NotificationScope={serviceId:string;personId:string};

/** An acknowledgement belongs to this exact person, service and unchanged command. */
export function parseNotificationSave(value:unknown,scope:NotificationScope,input:NotificationCommand){
  const saved=notificationSaveResponseSchema.parse(value);
  if(input.expectedPersonId!==scope.personId||saved.serviceId!==scope.serviceId||saved.personId!==scope.personId||saved.commandId!==input.commandId||saved.version<input.expectedVersion+1)
    throw new Error("We couldn’t verify these preferences. Retry the same save.");
  if(saved.version===input.expectedVersion+1&&(["serviceActivity","cardControls","caseUpdates"] as const).some(key=>saved[key]!==input[key]))
    throw new Error("We couldn’t verify these preferences. Retry the same save.");
  return notificationPreferencesSchema.parse({serviceActivity:saved.serviceActivity,cardControls:saved.cardControls,caseUpdates:saved.caseUpdates,version:saved.version,delivery:saved.delivery});
}
export function parseNotificationOverview(value:unknown,scope:NotificationScope){
  const saved=notificationOverviewSchema.parse(value);
  if(saved.serviceId!==scope.serviceId||saved.personId!==scope.personId)throw new Error("We couldn’t verify this account’s preferences. Please retry.");
  return saved;
}

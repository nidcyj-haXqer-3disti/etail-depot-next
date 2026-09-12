import type { PolicyScope } from "./evaluate";
export const CARDHOLDER_PERMISSION_ACTIONS=["cardholder.funds.read","cardholder.funds.add","cardholder.limits.manage","cards.read","cards.hold","cards.request","cards.create","cards.purchase","cards.freeze","cards.unfreeze","cards.manageMembers","activity.read","people.read","people.invite","people.changeRole","people.revoke","notifications.manage"] as const;
export function isCardholderPermission(action:string):boolean{return (CARDHOLDER_PERMISSION_ACTIONS as readonly string[]).includes(action);}
export type CardholderRole="OWNER"|"CARDHOLDER"|"NONE";
export function cardholderRole(scope:PolicyScope):CardholderRole {
 if(scope.serviceKind!=="CARDHOLDER"||scope.status!=="ACTIVE"||scope.membershipState!=="ACCEPTED"||scope.primaryMembershipState!=="ACCEPTED"||scope.actorPersonId!==scope.membershipPersonId||scope.serviceId!==scope.membershipServiceId||scope.serviceId!==scope.resourceServiceId)return "NONE";
 return scope.primaryPersonId===scope.actorPersonId?"OWNER":"CARDHOLDER";
}
export function canReadCardholderData(scope:PolicyScope,holderId:string|null|undefined,assignmentState:"UNASSIGNED"|"ACCEPTED"|"REVOKED"|null):boolean {
 const role=cardholderRole(scope);return role==="OWNER"||(role==="CARDHOLDER"&&assignmentState==="ACCEPTED"&&holderId===scope.actorPersonId);
}

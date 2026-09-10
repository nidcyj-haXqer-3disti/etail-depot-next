import type { PolicyScope } from "./evaluate";
export const CARDHOLDER_PERMISSION_ACTIONS=["cards.read","cards.hold","cards.request","cards.create","cards.purchase","cards.freeze","cards.unfreeze","cards.manageMembers","activity.read","people.read","people.invite","people.changeRole","people.revoke","notifications.manage"] as const;
export function isCardholderPermission(action:string):boolean{return (CARDHOLDER_PERMISSION_ACTIONS as readonly string[]).includes(action);}
export type CardholderRole="PRIMARY"|"SECONDARY"|"NONE";
export function cardholderRole(scope:PolicyScope):CardholderRole {
 if(scope.serviceKind!=="CARDHOLDER"||scope.status!=="ACTIVE"||scope.membershipState!=="ACCEPTED"||scope.primaryMembershipState!=="ACCEPTED"||scope.actorPersonId!==scope.membershipPersonId||scope.serviceId!==scope.membershipServiceId||scope.serviceId!==scope.resourceServiceId)return "NONE";
 return scope.primaryPersonId===scope.actorPersonId?"PRIMARY":"SECONDARY";
}
export function canReadCardholderData(scope:PolicyScope,holderId:string|null|undefined):boolean {
 const role=cardholderRole(scope);return role==="PRIMARY"||(role==="SECONDARY"&&holderId===scope.actorPersonId);
}

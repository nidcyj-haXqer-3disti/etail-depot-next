import {cardholderRole} from "./cardholder-scope";
export const WORKSPACE_ACTIONS = ["cards.read", "cards.hold", "cards.freeze", "cards.unfreeze", "cards.request", "activity.read", "notifications.manage"] as const;
export const ACTIONS = ["cardholder.funds.read","cardholder.funds.add","cardholder.limits.manage","service.read","people.read","people.invite","people.changeRole","people.revoke","support.cases.read","support.cases.manage","acquiring.read","acquiring.setup","merchant.read","merchant.people.read","merchant.people.invite","merchant.people.revoke","merchant.units.create","merchant.units.pause","channels.read","channels.create","channels.update","channels.close","channels.share","cards.create","cards.manageMembers","cards.purchase","gateway.manage","payments.read","payments.simulate","payments.refund","payouts.manage","spend.authorize", ...WORKSPACE_ACTIONS] as const;
export type Action = typeof ACTIONS[number];
export type ServiceKind = "CARDHOLDER"|"MERCHANT";
export type Role = "PRIMARY"|"SECONDARY";
export interface PolicyScope {
  targetKind?:"SERVICE";
  actorPersonId:string; serviceId:string; resourceServiceId:string;
  membershipPersonId:string; membershipServiceId:string; membershipState:string;
  primaryPersonId:string; primaryMembershipState:string; role:Role; serviceKind:ServiceKind; status:string;
  grants?:readonly string[]; delegableActions?:readonly string[];
  invitation?:{recipientPersonId:string;status:string;expiresAt:Date;now:Date};
}
export const MERCHANT_ACTIONS = ["merchant.units.create","merchant.units.pause","gateway.manage","merchant.read","merchant.people.read","merchant.people.invite","merchant.people.revoke","channels.read","channels.create","channels.update","channels.close","channels.share","payments.read","payments.simulate","payments.refund","payouts.manage"] as const;
export interface MerchantPolicyScope {
  targetKind:"MERCHANT_UNIT"; actorPersonId:string; merchantUnitId:string; resourceMerchantUnitId:string;
  serviceId:string; masterServiceId:string; unitKind:"MASTER"|"SUB";
  mode:"OPERATING"|"OVERSIGHT"|"INVITATION_RECIPIENT"; primaryAccess:boolean;
  invitation?:{recipientPersonId:string;status:string;expiresAt:Date;accessExpiresAt:Date;now:Date};available:boolean;operating:boolean;canManageFunds:boolean;
  authority:{kind:"PRIMARY_MEMBER"|"MERCHANT_ASSIGNMENT";personId:string;membershipVersion:number|null}|null;
  grants:readonly string[];delegableActions:readonly string[];
}
export interface OperatorPolicyScope {
 targetKind:"OPERATOR_SERVICE";actorPersonId:string;assignmentPersonId:string;serviceId:string;resourceServiceId:string;state:"ACCEPTED"|"REVOKED";serviceStatus:string;grants:readonly string[];
}
export function evaluate(scope:PolicyScope|MerchantPolicyScope|OperatorPolicyScope, action:string) {
  if(scope.targetKind==="OPERATOR_SERVICE") {
    const allowed=scope.actorPersonId===scope.assignmentPersonId&&scope.serviceId===scope.resourceServiceId&&scope.state==="ACCEPTED"&&scope.serviceStatus!=="CLOSED"&&["support.operator.read","support.operator.respond","payments.operator.process"].includes(action)&&scope.grants.includes("support.operator.read")&&scope.grants.includes(action);
    return {action,allowed,reasonCode:allowed?"ALLOWED":"ACTION_DENIED",reason:allowed?"Available through your explicit operator assignment.":"An accepted operator assignment is required in this exact service.",remediation:null,scope:{serviceId:scope.serviceId},policyVersion:10};
  }
  if(scope.targetKind==="MERCHANT_UNIT") {
    const same=scope.merchantUnitId===scope.resourceMerchantUnitId&&scope.serviceId===scope.masterServiceId;
    let allowed=false;
    if(same&&scope.mode==="INVITATION_RECIPIENT") {
      const invitation=scope.invitation;
      allowed=!!invitation&&invitation.recipientPersonId===scope.actorPersonId&&invitation.status==="PENDING"&&invitation.expiresAt>invitation.now&&invitation.accessExpiresAt>invitation.now&&(action==="invitation.decline"||(action==="invitation.accept"&&scope.available&&scope.operating));
    } else if(same&&scope.available&&scope.authority?.personId===scope.actorPersonId&&scope.grants.includes("merchant.read")&&scope.grants.includes(action)) {
      if(scope.mode==="OVERSIGHT")allowed=scope.primaryAccess&&scope.authority.kind==="PRIMARY_MEMBER"&&["merchant.read","channels.read","payments.read","merchant.people.read"].includes(action);
      else if(scope.operating&&(MERCHANT_ACTIONS as readonly string[]).includes(action)) {
        allowed=(!action.startsWith("channels.")||action==="channels.read"||scope.grants.includes("channels.read"))&&(!action.startsWith("merchant.people.")||action==="merchant.people.read"||scope.grants.includes("merchant.people.read"));
        if(["payments.simulate","payments.refund","payouts.manage"].includes(action)&&!scope.grants.includes("payments.read"))allowed=false;
        if(["payments.refund","payouts.manage","gateway.manage","merchant.units.create","merchant.units.pause"].includes(action)&&!scope.primaryAccess)allowed=false;
      }
    }
    return {action,allowed,reasonCode:allowed?"ALLOWED":"MERCHANT_ACTION_UNAVAILABLE",reason:allowed?"Available within this merchant.":"Current permission in this merchant is required.",remediation:null,scope:{serviceId:scope.serviceId,merchantUnitId:scope.merchantUnitId},policyVersion:10};
  }

  let allowed=false;
  const same=scope.actorPersonId===scope.membershipPersonId&&scope.serviceId===scope.membershipServiceId&&scope.serviceId===scope.resourceServiceId;
  const member=same&&scope.membershipState==="ACCEPTED"&&scope.primaryMembershipState==="ACCEPTED";
  const active=member&&!['CLOSED','SUSPENDED'].includes(scope.status);
  const primary=scope.actorPersonId===scope.primaryPersonId;
  const has=(name:string)=>scope.grants?.includes(name)===true;
  const card=cardholderRole(scope);
  if(action==="invitation.accept"||action==="invitation.decline") {
    const invitation=scope.invitation;
    allowed=scope.serviceKind==="CARDHOLDER"&&scope.serviceId===scope.resourceServiceId&&scope.status==="ACTIVE"&&scope.primaryMembershipState==="ACCEPTED"&&!!invitation&&invitation.recipientPersonId===scope.actorPersonId&&invitation.status==="PENDING"&&invitation.expiresAt>invitation.now;
  } else if(active) {
    if(action==="service.read")allowed=true;
    else if(action==="support.cases.read"||action==="support.cases.manage")allowed=true;
    else if(scope.serviceKind==="CARDHOLDER"&&card!=="NONE") {
      if(["cardholder.funds.read","cardholder.funds.add","cardholder.limits.manage","people.read","people.invite","people.changeRole","people.revoke","cards.request","cards.create","cards.manageMembers"].includes(action))allowed=primary&&has(action);
      else if(["cards.read","cards.hold","activity.read","notifications.manage"].includes(action))allowed=has(action);
      else if(["cards.freeze","cards.unfreeze"].includes(action))allowed=has(action)&&has("cards.read");
      else if(action==="cards.purchase")allowed=has(action)&&has("cards.read")&&has("cards.hold");
      if(action==="cards.create")allowed=allowed&&has("cards.read")&&has("cards.request");
      if(action==="cards.manageMembers")allowed=allowed&&has("cards.read");
    } else if(scope.serviceKind==="MERCHANT") {
      if(action==="acquiring.read")allowed=has(action);
      else if(["acquiring.setup","gateway.manage","merchant.units.create","merchant.units.pause"].includes(action))allowed=primary&&has(action)&&has("acquiring.read");
      else if(["payments.read"].includes(action))allowed=has(action)&&has("acquiring.read");
      else if(["payments.simulate","payments.refund","payouts.manage"].includes(action))allowed=primary&&has(action)&&has("acquiring.read")&&has("payments.read");
      else if(action.startsWith("channels."))allowed=has(action)&&has("acquiring.read")&&(action==="channels.read"||has("channels.read"));
    }
  }
  return {action,allowed,reasonCode:allowed?"ALLOWED":"ACTION_DENIED",reason:allowed?"Available within your current service permission.":"This action requires current permission in this exact service.",remediation:null,scope:{serviceId:scope.serviceId},policyVersion:10};
}

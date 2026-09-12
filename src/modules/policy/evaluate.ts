import {cardholderRole} from "./cardholder-scope";
export const WORKSPACE_ACTIONS = ["cards.read", "cards.hold", "cards.freeze", "cards.unfreeze", "cards.request", "activity.read", "notifications.manage"] as const;
export const ACTIONS = ["money.read","money.add","money.withdraw","cardholder.funds.read","cardholder.funds.add","cardholder.limits.manage","service.read","people.read","people.invite","people.changeRole","people.revoke","support.cases.read","support.cases.manage","acquiring.read","acquiring.setup","merchant.read","merchant.people.read","merchant.people.invite","merchant.people.revoke","merchant.terminals.create","merchant.terminals.pause","channels.read","channels.create","channels.update","channels.close","channels.share","cards.create","cards.manageMembers","cards.purchase","gateway.manage","payments.read","payments.refund","payouts.manage","disputes.read","disputes.respond","disputes.resolve", ...WORKSPACE_ACTIONS] as const;
export type Action = typeof ACTIONS[number];
export type ServiceKind = "CARDHOLDER"|"MERCHANT";
export type Role = "OWNER"|"CARDHOLDER";
export interface PolicyScope {
  targetKind?:"SERVICE";
  actorPersonId:string; serviceId:string; resourceServiceId:string;
  membershipPersonId:string; membershipServiceId:string; membershipState:string;
  primaryPersonId:string; primaryMembershipState:string; role:Role; serviceKind:ServiceKind; status:string;
  grants?:readonly string[]; delegableActions?:readonly string[];
  invitation?:{recipientPersonId:string;status:string;expiresAt:Date;now:Date};
}
export const MERCHANT_ACTIONS = ["merchant.terminals.create","merchant.terminals.pause","gateway.manage","merchant.read","merchant.people.read","merchant.people.invite","merchant.people.revoke","channels.read","channels.create","channels.update","channels.close","channels.share","payments.read","payments.refund","payouts.manage"] as const;
export interface MerchantPolicyScope {
  targetKind:"MERCHANT_TERMINAL"; actorPersonId:string; terminalId:string; resourceTerminalId:string;
  serviceId:string; resourceServiceId:string;
  mode:"OPERATING"|"OVERSIGHT"|"INVITATION_RECIPIENT"; ownerAccess:boolean;
  invitation?:{recipientPersonId:string;status:string;expiresAt:Date;now:Date};available:boolean;operating:boolean;canManageFunds:boolean;
  authority:{kind:"OWNER_MEMBER"|"TERMINAL_ASSIGNMENT";personId:string;membershipVersion:number|null}|null;
  grants:readonly string[];delegableActions:readonly string[];
}
export interface OperatorPolicyScope {
 targetKind:"OPERATOR_SERVICE";actorPersonId:string;assignmentPersonId:string;serviceId:string;resourceServiceId:string;state:"ACCEPTED"|"REVOKED";serviceStatus:string;grants:readonly string[];
}
export interface MoneyPolicyScope {
 targetKind:"MONEY_ACCOUNT";actorPersonId:string;ownerPersonId:string;moneyAccountId:string;resourceMoneyAccountId:string;status:string;
}
export function evaluate(scope:PolicyScope|MerchantPolicyScope|OperatorPolicyScope|MoneyPolicyScope, action:string) {
  if(scope.targetKind==="MONEY_ACCOUNT") {
    const same=scope.actorPersonId===scope.ownerPersonId&&scope.moneyAccountId===scope.resourceMoneyAccountId;
    const allowed=same&&(action==="money.read"?scope.status!=="CLOSED":["money.add","money.withdraw"].includes(action)&&scope.status==="ACTIVE");
    return {action,allowed,reasonCode:allowed?"ALLOWED":"ACTION_DENIED",reason:allowed?"Available to the account owner.":"Only the account owner can manage this money.",remediation:null,scope:{moneyAccountId:scope.moneyAccountId},policyVersion:11};
  }
  if(scope.targetKind==="OPERATOR_SERVICE") {
    const allowed=scope.actorPersonId===scope.assignmentPersonId&&scope.serviceId===scope.resourceServiceId&&scope.state==="ACCEPTED"&&scope.serviceStatus!=="CLOSED"&&["support.operator.read","support.operator.respond","payments.operator.process","disputes.operator.read","disputes.operator.resolve"].includes(action)&&scope.grants.includes("support.operator.read")&&scope.grants.includes(action);
    return {action,allowed,reasonCode:allowed?"ALLOWED":"ACTION_DENIED",reason:allowed?"Available through your explicit operator assignment.":"An accepted operator assignment is required in this exact service.",remediation:null,scope:{serviceId:scope.serviceId},policyVersion:11};
  }
  if(scope.targetKind==="MERCHANT_TERMINAL") {
    const same=scope.terminalId===scope.resourceTerminalId&&scope.serviceId===scope.resourceServiceId;
    let allowed=false;
    if(same&&scope.mode==="INVITATION_RECIPIENT") {
      const invitation=scope.invitation;
      allowed=!!invitation&&invitation.recipientPersonId===scope.actorPersonId&&invitation.status==="PENDING"&&invitation.expiresAt>invitation.now&&(action==="invitation.decline"||(action==="invitation.accept"&&scope.available&&scope.operating));
    } else if(same&&scope.available&&scope.authority?.personId===scope.actorPersonId&&scope.grants.includes("merchant.read")&&scope.grants.includes(action)) {
      const ownerOnly=["merchant.people.read","merchant.people.invite","merchant.people.revoke","merchant.terminals.create","merchant.terminals.pause","gateway.manage","payments.refund","payouts.manage"];
      const terminalTasks=["merchant.read","channels.read","channels.create","channels.update","channels.close","channels.share","payments.read","disputes.read","disputes.respond"];
      if(scope.mode==="OVERSIGHT") allowed=scope.ownerAccess&&scope.authority.kind==="OWNER_MEMBER"&&["merchant.read","channels.read","payments.read","merchant.people.read","merchant.people.revoke","disputes.read"].includes(action);
      else if(scope.operating) allowed=scope.ownerAccess?([...MERCHANT_ACTIONS,"disputes.read","disputes.respond"] as readonly string[]).includes(action):terminalTasks.includes(action);
      if(action.startsWith("channels.")&&action!=="channels.read")allowed=allowed&&scope.grants.includes("channels.read");
      if(["payments.refund","payouts.manage"].includes(action))allowed=allowed&&scope.canManageFunds&&scope.grants.includes("payments.read");
      if(ownerOnly.includes(action)) allowed=allowed&&scope.ownerAccess&&scope.authority.kind==="OWNER_MEMBER";
    }
    return {action,allowed,reasonCode:allowed?"ALLOWED":"TERMINAL_ACTION_UNAVAILABLE",reason:allowed?"Available for this terminal.":"You do not have access to this terminal task.",remediation:null,scope:{serviceId:scope.serviceId,terminalId:scope.terminalId},policyVersion:11};
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
      else if(["acquiring.setup","gateway.manage","merchant.terminals.create","merchant.terminals.pause"].includes(action))allowed=primary&&has(action)&&has("acquiring.read");
      else if(["payments.read"].includes(action))allowed=has(action)&&has("acquiring.read");
      else if(["payments.refund","payouts.manage"].includes(action))allowed=primary&&has(action)&&has("acquiring.read")&&has("payments.read");
      else if(action.startsWith("channels."))allowed=has(action)&&has("acquiring.read")&&(action==="channels.read"||has("channels.read"));
    }
  }
  return {action,allowed,reasonCode:allowed?"ALLOWED":"ACTION_DENIED",reason:allowed?"Available within your current service permission.":"This action requires current permission in this exact service.",remediation:null,scope:{serviceId:scope.serviceId},policyVersion:11};
}

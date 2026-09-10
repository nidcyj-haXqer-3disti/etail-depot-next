import type {CardRequestProjection,WorkspaceActivity,WorkspaceCard,WorkspaceProjection} from "./contracts";

export interface CardholderServiceProfile {
 id:string;
 primaryPersonId:string;
 primaryName:string;
 displayName:string;
 relationship:"PRIMARY"|"SECONDARY";
 canAddCard:boolean;
 canInvite:boolean;
}
export interface DashboardCard extends WorkspaceCard {
 serviceId:string;
 primaryName:string;
 accessRole:"PRIMARY"|"SECONDARY";
 canManageAccess:boolean;
}
export interface DashboardActivity extends WorkspaceActivity {
 cardNickname:string;
 lastFour:string;
 holderName:string;
}
export interface CardholderDashboardProjection {
 person:{id:string;displayName:string};
 canCreatePrimary:boolean;
 profiles:CardholderServiceProfile[];
 primaryService:CardholderServiceProfile|null;
 cards:DashboardCard[];
 cardCount:number;
 cardsPage:number;
 cardsHasMore:boolean;
 activity:DashboardActivity[];
 requests:CardRequestProjection[];
 fictional:true;
}
/** One exact underlying scope for the existing command form, never an aggregate workspace. */
export interface CardholderDashboardDetail {
 kind:"CARD"|"REQUEST"|"NEW"|"PEOPLE"|"ACTIVITY";
 workspace:WorkspaceProjection;
}

/** Bounded Home context; command forms continue to load their exact workspace. */
export interface CardholderDashboardFocus {
 card:DashboardCard;
 workspace:Pick<WorkspaceProjection,"service"|"customerService"|"cardholderRole"|"capabilities"|"cards"|"activity">;
}

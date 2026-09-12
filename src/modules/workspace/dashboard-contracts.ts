import type {CardRequestProjection,WorkspaceActivity,WorkspaceCard,WorkspaceProjection} from "./contracts";

export interface CardholderServiceProfile {
 id:string;
 primaryPersonId:string;
 primaryName:string;
 displayName:string;
 relationship:"OWNER"|"CARDHOLDER";
 canAddCard:boolean;
 canInvite:boolean;
}
export interface DashboardCard extends WorkspaceCard {
 serviceId:string;
 primaryName:string;
 accessRole:"OWNER"|"CARDHOLDER";
 canManageAccess:boolean;
}
export interface DashboardActivity extends WorkspaceActivity {
 cardNickname:string;
 lastFour:string;
 holderName:string;
}
export type RequestStatusFilter = "ALL" | "DRAFT" | "BLOCKED" | "ISSUED" | "CANCELED";
export interface CardholderRequestFilters { requestPage?: number; requestStatus?: RequestStatusFilter; requestSearch?: string }
export type CardScopeFilter = "ALL" | "OWN" | "MANAGED";
export interface CardholderDashboardFilters extends CardholderRequestFilters { cardScope?: CardScopeFilter; cardSearch?: string }
export interface CardRequestHistory {
 createdAt:string;
 events:{id:string;label:string;occurredAt:string}[];
 hasEarlierEvents:boolean;
}
export interface CardControlHistory {events:{id:string;label:string;actorName:string;occurredAt:string}[];hasEarlierEvents:boolean}
export interface CardholderDashboardProjection {
 person:{id:string;displayName:string};
 canCreatePrimary:boolean;
 profiles:CardholderServiceProfile[];
 primaryService:CardholderServiceProfile|null;
 cards:DashboardCard[];
 cardCount:number;
 ownCardCount:number;
 managedCardCount:number;
 cardMatchCount:number;
 cardScope:CardScopeFilter;
 cardSearch:string;
 cardsPage:number;
 cardsHasMore:boolean;
 cardholders:{id:string;displayName:string;serviceId:string;cardCount:number|null;canAddCard:boolean}[];
 cardholdersHasMore:boolean;
 activity:DashboardActivity[];
 requests:CardRequestProjection[];
 requestPage:number;
 requestsHasMore:boolean;
 requestCount:number;
 unfinishedRequestCount:number;
 requestStatus:RequestStatusFilter;
 requestSearch:string;
 fictional:true;
}
/** One exact underlying scope for the existing command form, never an aggregate workspace. */
export interface CardholderDashboardDetail {
 kind:"CARD"|"REQUEST"|"NEW"|"PEOPLE"|"ACTIVITY";
 workspace:WorkspaceProjection;
 requestHistory?:CardRequestHistory;
 cardHistory?:CardControlHistory;
}

/** Bounded Home context; command forms continue to load their exact workspace. */
export interface CardholderDashboardFocus {
 card:DashboardCard;
 workspace:Pick<WorkspaceProjection,"service"|"customerService"|"cardholderRole"|"capabilities"|"cards"|"activity">;
}

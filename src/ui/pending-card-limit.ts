"use client";

import {useSyncExternalStore} from "react";

export type CardLimitScope=Readonly<{personId:string;serviceId:string;cardId:string}>;
export type PendingCardLimitAttempt=Readonly<CardLimitScope&{commandId:string;expectedVersion:number;allowanceMinor:string}>;
export type PendingCardLimit=Readonly<{attempt:PendingCardLimitAttempt;inFlight:boolean;uncertain:boolean}>;
const scopeKey=(scope:CardLimitScope)=>JSON.stringify([scope.personId,scope.serviceId,scope.cardId]);

/** Volatile command retention, never a permission source or browser-storage record. */
export function createPendingCardLimitRegistry(){
 const entries=new Map<string,PendingCardLimit>(),listeners=new Set<()=>void>();
 const notify=()=>{for(const listener of listeners)listener();};
 return {
  get:(scope:CardLimitScope|null)=>scope?entries.get(scopeKey(scope))??null:null,
  hasPending:()=>entries.size>0,
  subscribe:(listener:()=>void)=>{listeners.add(listener);return()=>{listeners.delete(listener);};},
  begin(attempt:PendingCardLimitAttempt){
   const key=scopeKey(attempt),previous=entries.get(key);
   if(previous&&(previous.attempt.commandId!==attempt.commandId||previous.inFlight))return false;
   // An existing command always keeps its first immutable payload.
   const original=previous?.attempt??Object.freeze({...attempt});
   entries.set(key,Object.freeze({attempt:original,inFlight:true,uncertain:previous?.uncertain??false}));notify();return true;
  },
  retainUnknown(attempt:PendingCardLimitAttempt){
   const key=scopeKey(attempt),previous=entries.get(key);
   if(!previous||previous.attempt.commandId!==attempt.commandId)return;
   entries.set(key,Object.freeze({...previous,inFlight:false,uncertain:true}));notify();
  },
  finish(attempt:PendingCardLimitAttempt){
   const key=scopeKey(attempt),previous=entries.get(key);
   if(!previous||previous.attempt.commandId!==attempt.commandId)return;
   entries.delete(key);notify();
  },
  clearAfterSignOut(){entries.clear();notify();},
 };
}

export const pendingCardLimits=createPendingCardLimitRegistry();
let leavingConfirmed=false,unloadBound=false;
const guardDocumentExit=(event:BeforeUnloadEvent)=>{if(pendingCardLimits.hasPending()&&!leavingConfirmed)event.preventDefault();};
// This survives client navigation and does not patch the browser's history.
pendingCardLimits.subscribe(()=>{
 if(typeof window==="undefined")return;
 if(pendingCardLimits.hasPending()&&!unloadBound){window.addEventListener("beforeunload",guardDocumentExit);unloadBound=true;}
 else if(!pendingCardLimits.hasPending()&&unloadBound){window.removeEventListener("beforeunload",guardDocumentExit);unloadBound=false;}
});
export const confirmCardLimitSignOut=(confirmed:boolean)=>{leavingConfirmed=confirmed;};
export const cardLimitSignOutConfirmed=()=>leavingConfirmed;
const serverSnapshot=()=>null;
export function usePendingCardLimit(scope:CardLimitScope|null){
 return useSyncExternalStore(pendingCardLimits.subscribe,()=>pendingCardLimits.get(scope),serverSnapshot);
}

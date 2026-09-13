"use client";

import {useSyncExternalStore} from "react";
import type {NotificationCommand} from "../modules/workspace/contracts";
export type NotificationAttempt=Readonly<NotificationCommand&{personId:string;serviceId:string}>;
type Scope={personId:string;serviceId:string};
type Entry=Readonly<{attempt:NotificationAttempt;inFlight:boolean;uncertain:boolean}>;
const keyOf=(scope:Scope)=>JSON.stringify([scope.personId,scope.serviceId]);

/** One unresolved preference change per person/account, retained only in this tab's memory. */
export function createNotificationPreferencesRegistry(){
  const entries=new Map<string,Entry>(),listeners=new Set<()=>void>();
  const notify=()=>{for(const listener of listeners)listener();};
  return {
    get:(scope:Scope)=>entries.get(keyOf(scope))??null,
    hasPending:()=>entries.size>0,
    subscribe:(listener:()=>void)=>{listeners.add(listener);return()=>{listeners.delete(listener);};},
    begin(attempt:NotificationAttempt){
      if(attempt.expectedPersonId!==attempt.personId)return false;
      const key=keyOf(attempt),previous=entries.get(key);
      if(previous&&(previous.inFlight||previous.attempt.commandId!==attempt.commandId))return false;
      entries.set(key,Object.freeze({attempt:previous?.attempt??Object.freeze({...attempt}),inFlight:true,uncertain:previous?.uncertain??false}));notify();return true;
    },
    retainUnknown(attempt:NotificationAttempt){
      const key=keyOf(attempt),previous=entries.get(key);
      if(!previous||previous.attempt.commandId!==attempt.commandId)return;
      entries.set(key,Object.freeze({...previous,inFlight:false,uncertain:true}));notify();
    },
    finish(attempt:NotificationAttempt){
      const key=keyOf(attempt),previous=entries.get(key);
      if(!previous||previous.attempt.commandId!==attempt.commandId)return;
      entries.delete(key);notify();
    },
    clearAfterSignOut(){entries.clear();notify();},
  };
}
export const pendingNotificationPreferences=createNotificationPreferencesRegistry();
let leavingConfirmed=false,unloadBound=false;
const guardDocumentExit=(event:BeforeUnloadEvent)=>{if(pendingNotificationPreferences.hasPending()&&!leavingConfirmed)event.preventDefault();};
pendingNotificationPreferences.subscribe(()=>{
  if(typeof window==="undefined")return;
  if(pendingNotificationPreferences.hasPending()&&!unloadBound){window.addEventListener("beforeunload",guardDocumentExit);unloadBound=true;}
  else if(!pendingNotificationPreferences.hasPending()&&unloadBound){window.removeEventListener("beforeunload",guardDocumentExit);unloadBound=false;}
});
export const confirmNotificationPreferencesSignOut=(confirmed:boolean)=>{leavingConfirmed=confirmed;};
const serverSnapshot=()=>null;
export function usePendingNotificationPreferences(scope:Scope){return useSyncExternalStore(pendingNotificationPreferences.subscribe,()=>pendingNotificationPreferences.get(scope),serverSnapshot);}

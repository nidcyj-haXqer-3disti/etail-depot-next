"use client";
import {useSyncExternalStore} from "react";
import type {ProfileAttempt} from "@/shared/personal-profile";
type Pending=Readonly<{attempt:Readonly<ProfileAttempt>;inFlight:boolean}>;
/** In-memory only, keyed to the authenticated person; never grants access. */
export function createPendingProfileRegistry(){
  const entries=new Map<string,Pending>(),listeners=new Set<()=>void>();
  const notify=()=>{for(const fn of listeners)fn();};
  return {
    get:(personId:string)=>entries.get(personId)??null,
    hasPending:()=>entries.size>0,
    subscribe:(fn:()=>void)=>{listeners.add(fn);return()=>{listeners.delete(fn);};},
    begin(personId:string,attempt:ProfileAttempt){
      if(attempt.expectedPersonId!==personId)return false;
      const previous=entries.get(personId);
      if(previous&&(previous.inFlight||previous.attempt.commandId!==attempt.commandId))return false;
      entries.set(personId,Object.freeze({attempt:previous?.attempt??Object.freeze({...attempt}),inFlight:true}));notify();return true;
    },
    retain(personId:string,commandId:string){const old=entries.get(personId);if(old?.attempt.commandId===commandId){entries.set(personId,Object.freeze({...old,inFlight:false}));notify();}},
    finish(personId:string,commandId:string){if(entries.get(personId)?.attempt.commandId===commandId){entries.delete(personId);notify();}},
    clearAfterSignOut(){entries.clear();notify();},
  };
}
export const pendingProfiles=createPendingProfileRegistry();
const serverSnapshot=()=>null;
export function usePendingProfile(personId:string){return useSyncExternalStore(pendingProfiles.subscribe,()=>pendingProfiles.get(personId),serverSnapshot);}
let bound=false;
function guardExit(event:BeforeUnloadEvent){if(pendingProfiles.hasPending())event.preventDefault();}
pendingProfiles.subscribe(()=>{
  if(typeof window==="undefined")return;
  if(pendingProfiles.hasPending()&&!bound){window.addEventListener("beforeunload",guardExit);bound=true;}
  else if(!pendingProfiles.hasPending()&&bound){window.removeEventListener("beforeunload",guardExit);bound=false;}
});

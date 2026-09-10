"use client";

import {useCallback,useLayoutEffect,useRef,useState,type Dispatch,type SetStateAction} from "react";

/** New server data supersedes local results; requests from an older committed view cannot restore its records or dialogs. */
export function useServerProjection<T>(initial:T):[T,Dispatch<SetStateAction<T>>,boolean,()=>boolean] {
  const [snapshot,setSnapshot]=useState({source:initial,value:initial,generation:0});
  const changed=snapshot.source!==initial;
  const generation=snapshot.generation+(changed?1:0);
  if(changed)setSnapshot({source:initial,value:initial,generation});
  const committed=useRef({generation,mounted:true});
  useLayoutEffect(()=>{committed.current={generation,mounted:true};return()=>{committed.current.mounted=false;};},[generation]);
  const isCurrent=useCallback(()=>committed.current.mounted&&committed.current.generation===generation,[generation]);
  const update=useCallback<Dispatch<SetStateAction<T>>>(next=>{
    setSnapshot(current=>current.generation!==generation?current:{...current,value:typeof next==="function"?(next as (previous:T)=>T)(current.value):next});
  },[generation]);
  return [changed?initial:snapshot.value,update,changed,isCurrent];
}

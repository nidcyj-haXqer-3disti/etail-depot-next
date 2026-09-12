"use client";

import {createContext,useCallback,useContext,useEffect,useId,useLayoutEffect,useRef,useState,type MouseEvent,type ReactNode} from "react";

import "./merchant-navigation-state.css";

const MerchantNavigationContext=createContext<((id:string,locked:boolean)=>void)|null>(null);

/** UI navigation protection only. Canonical command owners retain and retry their own attempts. */
export function MerchantNavigationBoundary({children}:{children:ReactNode}) {
 const [owners,setOwners]=useState<ReadonlySet<string>>(()=>new Set());
 const register=useCallback((id:string,locked:boolean)=>setOwners(current=>{
  if(current.has(id)===locked)return current;
  const next=new Set(current);if(locked)next.add(id);else next.delete(id);return next;
 }),[]);
 const locked=owners.size>0;
 function protectNavigation(event:MouseEvent<HTMLDivElement>){
  if(!locked||!(event.target instanceof Element))return;
  if(event.target.closest("a[href], .logout-control button")){event.preventDefault();event.stopPropagation();}
 }
 return <MerchantNavigationContext.Provider value={register}><div className="mn-navigation-boundary" data-pending={locked||undefined} onClickCapture={protectNavigation} onAuxClickCapture={protectNavigation}>{children}{locked&&<p className="mn-navigation-status" role="status">Finish or check your current request before switching payment terminals or services.</p>}</div></MerchantNavigationContext.Provider>;
}

export function useMerchantNavigationLock(locked:boolean){
 const register=useContext(MerchantNavigationContext),id=useId();
 useEffect(()=>{register?.(id,locked);return()=>register?.(id,false);},[register,id,locked]);
}

/** Reveal only the nearest horizontal edge; page scroll and the selected route stay unchanged. */
export function MerchantNavigation({label,activeKey,children}:{label:string;activeKey:string;children:ReactNode}) {
 const navigation=useRef<HTMLElement>(null);
 const reveal=useCallback((link:HTMLElement|null)=>{
  const nav=navigation.current;if(!nav||!link||nav.scrollWidth<=nav.clientWidth)return;
  const container=nav.getBoundingClientRect(),item=link.getBoundingClientRect();
  const left=container.left+nav.clientLeft,right=left+nav.clientWidth;
  const movement=item.left<left?item.left-left:item.right>right?item.right-right:0;
  if(movement)nav.scrollLeft+=movement;
 },[]);
 useLayoutEffect(()=>{
  const nav=navigation.current;if(!nav)return;
  const showActive=()=>reveal(nav.querySelector<HTMLElement>('a[aria-current="page"]'));
  showActive();const resize=new ResizeObserver(showActive);resize.observe(nav);
  return()=>resize.disconnect();
 },[activeKey,reveal]);
 return <nav ref={navigation} aria-label={label} onFocusCapture={event=>{
  const target=event.target;if(target instanceof HTMLElement)reveal(target.closest<HTMLAnchorElement>('a[href]'));
 }}>{children}</nav>;
}

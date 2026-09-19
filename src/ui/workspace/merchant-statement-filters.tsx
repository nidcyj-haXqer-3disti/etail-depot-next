"use client";

import {useState} from "react";
import type {MerchantActivityQuery} from "@/shared/merchant-activity";

/** Local field visibility only; the server owns statement scope and financial results. */
export type MerchantStatementScopeChoice={value:string;label:string};
export function MerchantStatementFilters({query,scopeChoices=[]}:{query:MerchantActivityQuery;scopeChoices?:MerchantStatementScopeChoice[]}){
 const [period,setPeriod]=useState(query.period);
 return <form className="ms-filters" action="/merchant-services" method="get" aria-label="Filter account statement">
  {Object.entries(query).filter(([key])=>!["q","period","from","to","page",...(scopeChoices.length?["view"]:[])].includes(key)).map(([key,value])=><input key={key} type="hidden" name={key} value={value}/>)}
  {scopeChoices.length>0&&<label className="ms-filter-scope">Show<select name="view" defaultValue={query.view}>{scopeChoices.map(choice=><option key={choice.value} value={choice.value}>{choice.label}</option>)}</select></label>}
  <label className="ms-filter-search">Find a record<input type="search" name="q" defaultValue={query.q} maxLength={160} placeholder="Description or reference"/></label>
  <label className="ms-filter-period">When<select name="period" value={period} onChange={event=>setPeriod(event.target.value as MerchantActivityQuery["period"])}><option value="all">All time</option><option value="last7">Last 7 days</option><option value="last30">Last 30 days</option><option value="thisMonth">This month</option><option value="lastMonth">Last month</option><option value="custom">Choose dates</option></select></label>
  {period==="custom"&&<><label>From<input type="date" name="from" defaultValue={query.from}/></label><label>To<input type="date" name="to" defaultValue={query.to}/></label></>}
  <button className="consumer-button consumer-button-secondary" type="submit">Search statement</button>
 </form>;
}

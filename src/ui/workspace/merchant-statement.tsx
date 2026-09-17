import Link from "next/link";
import type {MerchantStatementProjection} from "@/modules/acquiring/statement-contracts";
import {merchantActivityHref} from "@/shared/merchant-activity";
import {StatusBadge} from "./primitives";
import {formatDate} from "./format-date";
import "./merchant-statement.css";
import {MerchantStatementFilters,type MerchantStatementScopeChoice} from "./merchant-statement-filters";

/** Displays the server's posted effects; never calculates money in React. */
export function MerchantStatement({statement:s,scopeChoices=[]}:{statement:MerchantStatementProjection;scopeChoices?:MerchantStatementScopeChoice[]}){
 const href=(page:number)=>merchantActivityHref(s.query,{page});
 const filters:string[]=[];
 if(s.query.section==="activity")filters.push({payments:"Payments only",refunds:"Refunds only",transfers:"Settlements, payouts and transfers only"}[s.query.activity]);
 if(s.query.status!=="ALL")filters.push({COLLECTED:"Excludes declined payments",APPROVED:"Completed payments only",DECLINED:"Declined payments only",REFUNDED:"Refunded records only"}[s.query.status]);
 if(s.query.q)filters.push(`Search: ${s.query.q}`);
 if(s.query.period!=="all")filters.push({last7:"Last 7 days",last30:"Last 30 days",thisMonth:"This month",lastMonth:"Last month",custom:"Selected dates"}[s.query.period]);
 const filtered=filters.length>0;
 const clearHref=merchantActivityHref(s.query,{section:"overview",activity:"payments",status:"ALL",q:"",period:"all",from:"",to:"",page:1});
 if(!s.available)return <section className="ms-statement"><h2>Statement unavailable</h2><p>Choose a business or payment terminal you can access.</p><Link href="/merchant-services">Return to Overview</Link></section>;
 return <section className="ms-statement" aria-labelledby="merchant-statement-title">
  <header><div><h2 id="merchant-statement-title">Account statement</h2>{s.query.view!=="all"&&<p className="ms-scope-name">{s.name}</p>}</div><span className="ms-period">{s.range.from||s.range.to?`${s.range.from||"Start"} to ${s.range.to||"today"} (UTC)`:"All time"} · USD</span></header>
  {!s.includesAccountMovements&&<p className="ms-scope-note">Terminal records only. Business payouts are not included.</p>}
  <details className="ms-filter-options"><summary>Filters</summary><MerchantStatementFilters key={JSON.stringify(s.query)} query={s.query} scopeChoices={scopeChoices}/></details>
  {filtered&&<div className="ms-applied-filters" role="group" aria-label="Applied statement filters"><p>Showing: {filters.join(" · ")}</p><Link className="consumer-button consumer-button-secondary" href={clearHref}>Clear statement filters</Link></div>}
  {!s.completeScope&&<p role="status">Some records are outside your current access.</p>}
  {s.rows.length?<div className="ms-table-wrap"><table><caption className="consumer-sr-only">Account statement for {s.name}</caption><thead><tr><th scope="col">Date</th><th scope="col">Description</th><th scope="col">Credit</th><th scope="col">Debit</th></tr></thead><tbody>{s.rows.map(row=><tr key={row.id}>
   <td data-label="Date"><time dateTime={row.at}>{formatDate(row.at)}</time></td>
   <td data-label="Description"><strong>{row.href?<Link href={row.href}>{row.description}</Link>:row.description}</strong><div className="ms-record-context">{(row.terminalName??"Business account")!==s.name&&<span>{row.terminalName??"Business account"}{row.businessName!==s.name&&` · ${row.businessName}`}</span>}<StatusBadge status={row.status}/>{!row.credit&&!row.debit&&(row.status==="PENDING"||row.status==="FAILED")&&<span>Amount {row.amount.formatted}</span>}</div><details className="ms-record-details"><summary>Record details</summary><dl><dt>Reference</dt><dd>{row.reference}</dd><dt>Amount</dt><dd>{row.amount.formatted}</dd><dt>Money effect</dt><dd>{row.effect==="INTERNAL"?"Moved within the business · not new money in or out":row.effect==="NONE"?"No money posted":row.effect==="CREDIT"?"Money received":"Money paid out"}</dd></dl></details></td>
   <td data-label="Credit" className="ms-money">{row.credit?.formatted??"—"}</td><td data-label="Debit" className="ms-money">{row.debit?.formatted??"—"}</td>
  </tr>)}</tbody></table></div>:<div className="ms-empty"><h3>{s.query.page>s.pageCount?"No records on this page":filtered?"No records match these filters":"No statement records yet"}</h3><p>Payments and money movements will appear here when recorded.</p>{s.query.page>s.pageCount&&<Link href={href(1)}>First page</Link>}</div>}
  {(s.pageCount>1||s.query.page>1)&&<nav className="ms-pagination" aria-label="Statement pages">{s.query.page>1&&<Link href={href(s.query.page-1)}>Newer records</Link>}<span>Page {s.query.page} of {s.pageCount}</span>{s.query.page<s.pageCount&&<Link href={href(s.query.page+1)}>Older records</Link>}</nav>}
 </section>;
}

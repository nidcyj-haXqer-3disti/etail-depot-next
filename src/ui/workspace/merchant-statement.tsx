import Link from "next/link";
import type {MerchantStatementProjection} from "@/modules/acquiring/statement-contracts";
import {merchantActivityHref} from "@/shared/merchant-activity";
import {StatusBadge} from "./primitives";
import {formatDate} from "./format-date";
import "./merchant-statement.css";
import {MerchantStatementFilters} from "./merchant-statement-filters";

/** Displays the server's posted effects; never calculates money in React. */
export function MerchantStatement({statement:s}:{statement:MerchantStatementProjection}){
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
  <header><h2 id="merchant-statement-title">Account statement</h2><span className="ms-period">{s.range.from||s.range.to?`${s.range.from||"Start"} to ${s.range.to||"today"} (UTC)`:"All time"}</span></header>
  {!s.includesAccountMovements&&<p className="ms-scope-note">Terminal records only. Business payouts are not included.</p>}
  <MerchantStatementFilters key={JSON.stringify(s.query)} query={s.query}/>
  {filtered&&<div className="ms-applied-filters" role="group" aria-label="Applied statement filters"><p>Showing: {filters.join(" · ")}</p><Link className="consumer-button consumer-button-secondary" href={clearHref}>Clear statement filters</Link></div>}
  {filtered&&s.totals.length>0&&<p className="ms-count">Totals for the filtered records below.</p>}
  {s.totals.map(total=><dl className="ms-totals" key={total.currency} aria-label={`${filtered?"Filtered statement":"Statement"} totals in ${total.currency}`}><div><dt>Money in</dt><dd>{total.credit.formatted}</dd></div><div><dt>Money out</dt><dd>{total.debit.formatted}</dd></div></dl>)}
  {!s.completeScope&&<p role="status">Some records are outside your current access. Totals are unavailable.</p>}
  <p className="ms-count">{s.totalCount} {s.totalCount===1?"record":"records"} · USD{filtered?" · Filtered results":""}</p>
  {s.rows.length?<div className="ms-table-wrap"><table><caption className="consumer-sr-only">Account statement for {s.name}</caption><thead><tr><th scope="col">Date</th><th scope="col">Record</th><th scope="col">Money in</th><th scope="col">Money out</th></tr></thead><tbody>{s.rows.map(row=><tr key={row.id}>
   <td data-label="Date"><time dateTime={row.at}>{formatDate(row.at)}</time></td>
   <td data-label="Record"><strong>{row.href?<Link href={row.href}>{row.description}</Link>:row.description}</strong><div className="ms-record-context">{(row.terminalName??"Business account")!==s.name&&<span>{row.terminalName??"Business account"}{row.businessName!==s.name&&` · ${row.businessName}`}</span>}<StatusBadge status={row.status}/></div><details className="ms-record-details"><summary>Record details</summary><dl><dt>Reference</dt><dd>{row.reference}</dd><dt>Amount</dt><dd>{row.amount.formatted}</dd><dt>Money effect</dt><dd>{row.effect==="INTERNAL"?"Moved within the business · not new money in or out":row.effect==="NONE"?"No money posted":row.effect==="CREDIT"?"Money received":"Money paid out"}</dd></dl></details></td>
   <td data-label="Money in" className="ms-money">{row.credit?.formatted??"—"}</td><td data-label="Money out" className="ms-money">{row.debit?.formatted??"—"}</td>
  </tr>)}</tbody></table></div>:<div className="ms-empty"><h3>{s.query.page>s.pageCount?"No records on this page":filtered?"No records match these filters":"No statement records yet"}</h3><p>Payments and money movements will appear here when recorded.</p>{s.query.page>s.pageCount&&<Link href={href(1)}>First page</Link>}</div>}
  <details className="ms-about"><summary>About this statement</summary><p>Payments and money movements for {s.name}. Internal transfers do not add to money in or out.{s.includesAccountMovements&&" Available money is shown separately."}</p><p>Open a record for its reference, original amount and money effect.</p></details>
  {(s.pageCount>1||s.query.page>1)&&<nav className="ms-pagination" aria-label="Statement pages">{s.query.page>1&&<Link href={href(s.query.page-1)}>Newer records</Link>}<span>Page {s.query.page} of {s.pageCount}</span>{s.query.page<s.pageCount&&<Link href={href(s.query.page+1)}>Older records</Link>}</nav>}
 </section>;
}

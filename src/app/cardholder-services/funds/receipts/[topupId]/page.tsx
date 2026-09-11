import Link from "next/link";
import {redirect,unstable_rethrow} from "next/navigation";
import {getRequestSession} from "@/platform/http/context";
import {getCardholderTopup} from "@/modules/workspace/service";
import {requireAcquiringRouteId as id} from "@/modules/acquiring/routes";
import {Shell,PageNotice} from "@/ui/shell";
export const dynamic="force-dynamic";
export default async function Page({params,searchParams}:{params:Promise<{topupId:string}>;searchParams:Promise<{service?:string}>}){const session=await getRequestSession();if(!session)redirect("/login");const row=await(async()=>{try{const p=await params,q=await searchParams;return await getCardholderTopup(session.personId,id(q.service??""),id(p.topupId));}catch(e){unstable_rethrow(e);return null;}})();if(!row)return <PageNotice authenticated title="This receipt is unavailable"><Link href="/cardholder-services/funds">Back to Add money</Link></PageNotice>;return <Shell authenticated><div className="page-container"><p className="eyebrow">TOP-UP RECEIPT</p><h1>Money added</h1><h2>{row.amount.formatted}</h2><p>From {row.sourceLabel} · Completed</p><p>{new Date(row.createdAt).toLocaleString("en-US",{timeZone:"UTC"})} UTC</p><p>Reference {row.reference}</p><Link href={`/cardholder-services/funds?service=${row.serviceId}`}>Back to Add money</Link></div></Shell>;}

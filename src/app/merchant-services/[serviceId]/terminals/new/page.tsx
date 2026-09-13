import { renderMerchantDashboard } from "../../../dashboard-loader";
export const dynamic="force-dynamic";
export const fetchCache="force-no-store";
export const metadata={title:"New payment terminal"};
export default async function Page({params,searchParams}:{params:Promise<{serviceId:string}>;searchParams:Promise<Record<string,string|string[]|undefined>>}) {return renderMerchantDashboard(searchParams,`/merchant-services/${(await params).serviceId}/terminals/new`);}

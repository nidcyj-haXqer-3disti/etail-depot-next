import { notFound } from "next/navigation";
import { renderMerchantDashboard } from "../../dashboard-loader";
import { renderMerchantTerminal } from "../../terminal-loader";
import { renderTerminalBusinessDetails } from "../../business-details-loader";
import { customerRouteQuery } from "@/shared/customer-routes";
export const dynamic="force-dynamic";
export const fetchCache="force-no-store";
export const metadata={title:"Payment terminals"};
export default async function Page({params,searchParams}:{params:Promise<{destination?:string[]}>;searchParams:Promise<Record<string,string|string[]|undefined>>}) {
  const {destination=[]}=await params, pathname=`/merchant-services/terminals${destination.length?`/${destination.join("/")}`:""}`;
  try { customerRouteQuery(pathname); } catch { notFound(); }
  return destination[1]==="business-details"?renderTerminalBusinessDetails(destination[0]!,searchParams,pathname):destination.length?renderMerchantTerminal(destination[0]!,searchParams,pathname):renderMerchantDashboard(searchParams,pathname);
}

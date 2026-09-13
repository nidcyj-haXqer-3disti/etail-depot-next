import { notFound } from "next/navigation";
import { renderCardholderDashboard } from "../dashboard-loader";
import { renderCardholderTask } from "../task-loader";
import { customerRouteQuery } from "@/shared/customer-routes";
import type { CardholderTask } from "@/ui/cardholder-routing";
export const dynamic="force-dynamic";
export const fetchCache="force-no-store";
export const metadata={title:"Cards & spending"};
export default async function Page({params,searchParams}:{params:Promise<{destination:string[]}>;searchParams:Promise<Record<string,string|string[]|undefined>>}) {
  const {destination}=await params, pathname=`/cardholder-services/${destination.join("/")}`;
  try { customerRouteQuery(pathname); } catch { notFound(); }
  const task=destination.length===3&&["activity","reports","settings","help","membership"].includes(destination[2]!)?destination[2] as CardholderTask:null;
  return task?renderCardholderTask(task,searchParams,pathname):renderCardholderDashboard(searchParams,pathname);
}

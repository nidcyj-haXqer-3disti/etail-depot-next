import { renderCardholderDashboard } from "./dashboard-loader";
export const dynamic="force-dynamic";
export const fetchCache="force-no-store";
export const metadata={title:"Cards & spending"};
export default function Page({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){return renderCardholderDashboard(searchParams);}

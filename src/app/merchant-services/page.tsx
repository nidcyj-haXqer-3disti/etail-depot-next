import {renderMerchantDashboard} from "./dashboard-loader";
export const dynamic="force-dynamic";
export const fetchCache="force-no-store";
export const metadata={title:"Accept payments"};
export default function Page({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){return renderMerchantDashboard(searchParams);}

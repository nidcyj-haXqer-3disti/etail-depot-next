import {renderTerminalBusinessDetails} from "../../../merchant-services/business-details-loader";
export const dynamic="force-dynamic";
export const metadata={title:"Business details"};
export default async function Page({params,searchParams}:{params:Promise<{merchantId:string}>;searchParams:Promise<Record<string,string|string[]|undefined>>}){return renderTerminalBusinessDetails((await params).merchantId,searchParams);}

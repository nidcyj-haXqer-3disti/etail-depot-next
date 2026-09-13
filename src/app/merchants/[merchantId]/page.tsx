import {renderMerchantTerminal} from "../../merchant-services/terminal-loader";
export const dynamic="force-dynamic";
export const fetchCache="force-no-store";
export const metadata={title:"Payment terminal"};
export default async function Page({params,searchParams}:{params:Promise<{merchantId:string}>;searchParams:Promise<Record<string,string|string[]|undefined>>}){return renderMerchantTerminal((await params).merchantId,searchParams);}

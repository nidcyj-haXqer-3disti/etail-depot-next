import {renderMoneyAccount} from "../money-loader";
export const dynamic="force-dynamic";
export const fetchCache="force-no-store";
export const metadata={title:"Money activity"};
export default async function Page({params,searchParams}:{params:Promise<{moneyAccountId:string}>;searchParams:Promise<Record<string,string|string[]|undefined>>}){return renderMoneyAccount((await params).moneyAccountId,searchParams);}

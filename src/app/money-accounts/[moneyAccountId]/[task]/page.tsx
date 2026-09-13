import { notFound } from "next/navigation";
import { renderMoneyAccount } from "../../money-loader";
export const dynamic="force-dynamic";
export const fetchCache="force-no-store";
export const metadata={title:"Money account"};
export default async function Page({params,searchParams}:{params:Promise<{moneyAccountId:string;task:string}>;searchParams:Promise<Record<string,string|string[]|undefined>>}) {
  const {moneyAccountId,task}=await params;
  if(task!=="add-money"&&task!=="withdraw")notFound();
  return renderMoneyAccount(moneyAccountId,searchParams,`/money-accounts/${moneyAccountId}/${task}`);
}

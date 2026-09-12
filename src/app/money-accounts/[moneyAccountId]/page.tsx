import {redirect,unstable_rethrow} from "next/navigation";
import {getRequestSession} from "@/platform/http/context";
import {getMoneyAccountOverview,getMoneyFundingIntent,getMoneyWithdrawalIntent} from "@/modules/money/service";
import {Shell,PageNotice} from "@/ui/shell";
import {MoneyAccountWorkspace} from "@/ui/money-account";
export const dynamic="force-dynamic";
export const fetchCache="force-no-store";
export const metadata={title:"Your money"};
export default async function Page({params,searchParams}:{params:Promise<{moneyAccountId:string}>;searchParams:Promise<Record<string,string|string[]|undefined>>}){
 const session=await getRequestSession();if(!session)redirect("/login");const {moneyAccountId}=await params,query=await searchParams;
 const task=query.task==="add"||query.task==="withdraw"?query.task:null,page=query.page===undefined?0:typeof query.page==="string"&&/^\d+$/.test(query.page)?Number(query.page):-1;
 if(query.task!==undefined&&!task||query.review!==undefined&&(typeof query.review!=="string"||!task)||Object.keys(query).some(key=>!["task","review","page"].includes(key)))return <PageNotice authenticated title="This money view is unavailable"><p>Open your money account from Your dashboard.</p></PageNotice>;
 let account:Awaited<ReturnType<typeof getMoneyAccountOverview>>,review:Awaited<ReturnType<typeof getMoneyFundingIntent>>|Awaited<ReturnType<typeof getMoneyWithdrawalIntent>>|null;
 try{account=await getMoneyAccountOverview(session.personId,moneyAccountId,page);review=typeof query.review==="string"?(task==="add"?await getMoneyFundingIntent(session.personId,moneyAccountId,query.review):await getMoneyWithdrawalIntent(session.personId,moneyAccountId,query.review)):null;}
 catch(error){unstable_rethrow(error);return <PageNotice authenticated title="This money account is unavailable"><p>Only the account owner can open this view. Return to Your dashboard to choose an available account.</p></PageNotice>;}
 return <Shell authenticated><MoneyAccountWorkspace key={`${moneyAccountId}:${task}:${query.review??""}`} account={account} task={task} review={review}/></Shell>;
}

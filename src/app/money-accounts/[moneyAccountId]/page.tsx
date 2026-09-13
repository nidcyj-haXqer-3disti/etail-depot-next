import {redirect,unstable_rethrow} from "next/navigation";
import {getRequestSession} from "@/platform/http/context";
import {getMoneyAccountOverview,getMoneyFundingIntent,getMoneyWithdrawalIntent} from "@/modules/money/service";
import {PageNotice} from "@/ui/shell";
import {getMerchantMoneyWorkspace} from "@/modules/acquiring/money-workspace";
import {MoneyAccountPage} from "@/ui/money-account";
export const dynamic="force-dynamic";
export const fetchCache="force-no-store";
import {moneyAccountHistory,moneyAccountReturn,type MoneyAccountHistory} from "@/ui/money-account-routing";
export const metadata={title:"Account balance"};
export default async function Page({params,searchParams}:{params:Promise<{moneyAccountId:string}>;searchParams:Promise<Record<string,string|string[]|undefined>>}){
 const session=await getRequestSession();if(!session)redirect("/login");const {moneyAccountId}=await params,query=await searchParams;
 const task=query.task==="add"||query.task==="withdraw"?query.task:null,page=query.page===undefined?0:typeof query.page==="string"&&/^\d+$/.test(query.page)?Number(query.page):-1;
 if(query.task!==undefined&&!task||query.review!==undefined&&(typeof query.review!=="string"||!task)||Object.keys(query).some(key=>!["task","review","page","returnTo","history"].includes(key)))return <PageNotice authenticated title="This money view is unavailable"><p>Open your money account from Your dashboard.</p></PageNotice>;
 let returnTo:string|null=null;
 let account:Awaited<ReturnType<typeof getMoneyAccountOverview>>,review:Awaited<ReturnType<typeof getMoneyFundingIntent>>|Awaited<ReturnType<typeof getMoneyWithdrawalIntent>>|null;
 let history:MoneyAccountHistory,settlements:Awaited<ReturnType<typeof getMerchantMoneyWorkspace>>["settlements"]=[],settlementsUnavailable=false;
 try{
  account=await getMoneyAccountOverview(session.personId,moneyAccountId,page);returnTo=moneyAccountReturn(query.returnTo,account.serviceKind);history=moneyAccountHistory(query.history,account.serviceKind);
  review=typeof query.review==="string"?(task==="add"?await getMoneyFundingIntent(session.personId,moneyAccountId,query.review):await getMoneyWithdrawalIntent(session.personId,moneyAccountId,query.review)):null;
  if(account.serviceKind==="MERCHANT"&&!task)({account,settlements,settlementsUnavailable}=await getMerchantMoneyWorkspace(session.personId,account));
 }
 catch(error){unstable_rethrow(error);return <PageNotice authenticated title="This money account is unavailable"><p>Only the account owner can open this view. Return to Your dashboard to choose an available account.</p></PageNotice>;}
 return <MoneyAccountPage settlements={settlements} settlementsUnavailable={settlementsUnavailable} history={history} key={`${moneyAccountId}:${task}:${query.review??""}`} account={account} task={task} review={review} returnTo={returnTo}/>;
}

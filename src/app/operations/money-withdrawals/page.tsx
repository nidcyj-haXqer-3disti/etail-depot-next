import {redirect,unstable_rethrow} from "next/navigation";
import {getRequestSession} from "@/platform/http/context";
import {getMoneyWithdrawalProcessingQueue} from "@/modules/money/service";
import {Shell,PageNotice} from "@/ui/shell";
import {MoneyWithdrawalProcessing} from "@/ui/money-withdrawal-processing";
export const dynamic="force-dynamic";
export default async function Page(){
 const session=await getRequestSession();if(!session)redirect("/login");
 let withdrawals:Awaited<ReturnType<typeof getMoneyWithdrawalProcessingQueue>>;
 try{withdrawals=await getMoneyWithdrawalProcessingQueue(session.personId);}
 catch(error){unstable_rethrow(error);return <PageNotice authenticated title="Access required"><p>You need a current processing assignment to review withdrawals.</p></PageNotice>;}
 return <Shell authenticated><MoneyWithdrawalProcessing withdrawals={withdrawals}/></Shell>;
}

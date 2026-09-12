import {redirect} from "next/navigation";
import {getRequestSession} from "@/platform/http/context";
import {getDepositProcessingQueue} from "@/modules/acquiring/operations-service";
import {hasOperatorAccess} from "@/modules/operations/service";
import {Shell,PageNotice} from "@/ui/shell";
import {DepositProcessing} from "@/ui/deposit-processing";
export const dynamic="force-dynamic";
export default async function Page(){const session=await getRequestSession();if(!session)redirect("/login");if(!await hasOperatorAccess(session.personId))return <PageNotice authenticated title="Access required"><p>You need permission to process merchant deposits.</p></PageNotice>;return <Shell authenticated><DepositProcessing deposits={await getDepositProcessingQueue(session.personId)}/></Shell>;}

import type {MoneyAccountOverview} from "../money/contracts";
import {getMoneyAccountOverview} from "../money/service";
import {getMerchantDashboard} from "./dashboard-service";
import {getMerchantWorkspace} from "./service";
import {getMerchantOperations} from "./operations-service";

/** Exact owner-scoped terminals that settle into this business account. Reads never create a terminal. */
export async function getMerchantMoneyWorkspace(personId:string,account:MoneyAccountOverview,discovered?:{
 // Reuse this request's server-owned discovery, never browser-supplied scope.
 units:readonly {id:string;merchantServiceId:string;ownerAccess:boolean}[];
}){
 if(account.serviceKind!=="MERCHANT")return {account,settlements:[],settlementsUnavailable:false};
 let settlements:{workspace:Awaited<ReturnType<typeof getMerchantWorkspace>>;operations:Awaited<ReturnType<typeof getMerchantOperations>>}[];
 try{
  const dashboard=discovered??await getMerchantDashboard(personId,{section:"funds"});
  const serviceIds=new Set(account.services.filter(service=>service.kind==="MERCHANT").map(service=>service.id));
  const terminals=dashboard.units.filter(terminal=>terminal.ownerAccess&&serviceIds.has(terminal.merchantServiceId));
  settlements=await Promise.all(terminals.map(async terminal=>({workspace:await getMerchantWorkspace(personId,terminal.id),operations:await getMerchantOperations(personId,terminal.id)})));
 }catch{
  // A terminal read may fail after ownership is revoked. Never fall back to
  // an earlier account snapshot without checking its current access again.
  const current=await getMoneyAccountOverview(personId,account.id,account.page);
  return {account:current,settlements:[],settlementsUnavailable:true};
 }
 // Discovery suppresses inaccessible terminals, so revocation can also appear
 // as a successful empty collection rather than a thrown terminal-read error.
 const current=settlements.length?account:await getMoneyAccountOverview(personId,account.id,account.page);
 return {account:current,settlements,settlementsUnavailable:false};
}

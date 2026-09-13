import { merchantActivityReturn } from "@/shared/merchant-activity";
import { customerHref } from "@/shared/customer-routes";

/** Money tasks keep a validated merchant investigation; never accept an external return URL. */
export function moneyAccountReturn(value: unknown, serviceKind: "CARDHOLDER" | "MERCHANT") {
  if (value === undefined || value === null) return null;
  if (serviceKind !== "MERCHANT" || typeof value !== "string") throw new Error("INVALID_MONEY_RETURN");
  const target = merchantActivityReturn(value);
  if (!target) throw new Error("INVALID_MONEY_RETURN");
  return target;
}

export function moneyAccountHref(id: string, returnTo: string | null = null, values: Record<string, string> = {}) {
  const query = new URLSearchParams(values);
  if (returnTo) query.set("returnTo", returnTo);
  return customerHref(`/money-accounts/${encodeURIComponent(id)}`, query);
}

/** Decorate only an exact account's canonical receipt; never carry another account's link. */
export function moneyHistoryReceiptHref(id:string,path:string,returnTo:string|null=null,history?:MoneyAccountHistory,page=0):string|null {
  const match=/^\/money-accounts\/([0-9a-f-]{36})\/(add-money|withdraw)\?review=([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i.exec(path);
  if(!match||match[1]!==id||!Number.isSafeInteger(page)||page<0)return null;
  if(returnTo&&!merchantActivityReturn(returnTo))return null;
  return moneyAccountHref(id,returnTo,{task:match[2]==="add-money"?"add":"withdraw",review:match[3]!,...(history?{history,...(page>0?{page:String(page)}:{})}:{})});
}

export type MoneyAccountHistory="payouts"|"balance";

/** A Merchant history tab selects one paginated list. Cardholder history keeps its existing route. */
export function moneyAccountHistory(value:unknown,serviceKind:"CARDHOLDER"|"MERCHANT"):MoneyAccountHistory{
 if(value===undefined||value===null)return serviceKind==="MERCHANT"?"payouts":"balance";
 if(serviceKind!=="MERCHANT"||(value!=="payouts"&&value!=="balance"))throw new Error("INVALID_MONEY_HISTORY");
 return value;
}

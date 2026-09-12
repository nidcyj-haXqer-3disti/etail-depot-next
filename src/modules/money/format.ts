import type {Money} from "../workspace/contracts";

export function formatMoney(minor:bigint):Money {
 const magnitude=minor<0n?-minor:minor;
 const dollars=(magnitude/100n).toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");
 return {minor:minor.toString(),currency:"USD",formatted:`${minor<0n?"-":""}$${dollars}.${(magnitude%100n).toString().padStart(2,"0")}`};
}

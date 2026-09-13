import { redirect } from "next/navigation";
import { customerHref, customerQuery, customerQueryRecord, customerRouteQuery, type CustomerQuery } from "@/shared/customer-routes";

/** Path/query disagreement fails before a loader can select a different resource. */
export async function resolveCustomerPage(path: string, searchParams: Promise<CustomerQuery>) {
  const input = await searchParams;
  let result;
  try {
    const query = customerQuery(input);
    result = { href: customerHref(path, query), query: customerQueryRecord(customerRouteQuery(path, query)), actual: `${path}${query.size ? `?${query}` : ""}` };
  } catch { return null; }
  if (result.href !== result.actual) redirect(result.href);
  return result;
}

export function customerLoginHref(destination: string) { return `/login?${new URLSearchParams({ next: destination })}`; }

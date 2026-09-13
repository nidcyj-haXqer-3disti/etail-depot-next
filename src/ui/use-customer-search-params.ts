"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { customerRouteQuery } from "@/shared/customer-routes";

/** Components consume the same selections on canonical paths and saved links. */
export function useCustomerSearchParams() {
  const pathname = usePathname(), query = useSearchParams();
  try { return customerRouteQuery(pathname, new URLSearchParams(query.toString())); }
  catch { return new URLSearchParams(query.toString()); } // The server renders the unavailable route.
}

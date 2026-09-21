"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { PaymentExamplePurpose } from "@/modules/public-site/payment-examples";

const PaymentExampleContext = createContext<{
  purpose: PaymentExamplePurpose;
  setPurpose: (purpose: PaymentExamplePurpose) => void;
} | null>(null);

/** Keeps the illustrated purchase consistent throughout the Payments page. */
export function PaymentExampleProvider({ children }: { children: ReactNode }) {
  const [purpose, setPurpose] = useState<PaymentExamplePurpose>("goods");
  return <PaymentExampleContext.Provider value={{ purpose, setPurpose }}>{children}</PaymentExampleContext.Provider>;
}

export function usePaymentExample() {
  const example = useContext(PaymentExampleContext);
  if (!example) throw new Error("Payment examples require their shared provider.");
  return example;
}

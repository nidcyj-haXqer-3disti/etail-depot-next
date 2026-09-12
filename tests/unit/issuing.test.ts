import { randomUUID } from "node:crypto";
import { expect, it } from "vitest";
import { issueSandboxCard } from "../../src/modules/issuing/sandbox-adapter";
import { cardPurchaseCommandSchema } from "../../src/modules/workspace/contracts";
it("derives a stable local card identity per request without payment credentials", () => {
  const requestId = randomUUID(); const card = issueSandboxCard(requestId);
  expect(issueSandboxCard(requestId)).toEqual(card);
  expect(issueSandboxCard(randomUUID()).id).not.toBe(card.id);
  expect(card.id).toMatch(/^[0-9a-f-]{36}$/);
  expect(card.lastFour).toMatch(/^[0-9]{4}$/);
  expect(Object.keys(card).sort()).toEqual(["id", "issuerReference", "lastFour"]);
  expect(card).not.toHaveProperty("balance");
  expect(card).not.toHaveProperty("limit");
});
it("purchase wire amounts are positive exact integers and commands cannot inject ledger fields", () => {
  const base = {commandId:randomUUID(),expectedVersion:1,amountMinor:"12501",description:"Practice groceries"};
  expect(cardPurchaseCommandSchema.safeParse(base).success).toBe(true);
  expect(cardPurchaseCommandSchema.safeParse({...base,amountMinor:"999999999999"}).success).toBe(true);
  for (const change of [{amountMinor:12501},{amountMinor:"0"},{amountMinor:"12.50"},{amountMinor:"-1"},{amountMinor:"01"},{amountMinor:"1000000000000"},{description:" "},{description:"x".repeat(121)},{bucket:"GROUP_AVAILABLE"},{holderId:randomUUID()}]) expect(cardPurchaseCommandSchema.safeParse({...base,...change}).success).toBe(false);
});

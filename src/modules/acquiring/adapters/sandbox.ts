/** Deterministic local adapter. It accepts no credentials, bank details or real card data. */
export function testPayment(id:string,outcome:"APPROVED"|"DECLINED") {return {outcome,testReference:`TEST-PAY-${id}`};}
export function testRefund(id:string) {return {testReference:`TEST-REFUND-${id}`};}
export function testPayout(id:string) {return {testReference:`TEST-PAYOUT-${id}`,destination:"TEST_DESTINATION" as const};}

import {z} from "zod";
export const networkInstrumentSchema=z.enum(["visa","mastercard","amex","discover"]);
export type NetworkInstrument=z.infer<typeof networkInstrumentSchema>;
export const startNetworkCheckoutSchema=z.object({commandId:z.uuid(),instrumentId:networkInstrumentSchema}).strict();
export const processNetworkCheckoutSchema=z.object({commandId:z.uuid()}).strict();
export type StartNetworkCheckout=z.infer<typeof startNetworkCheckoutSchema>;
export type NetworkBinding={operationId:string;provider:"ETAIL_SANDBOX_NETWORK";mode:"SANDBOX";providerAccount:string;serviceId:string;terminalId:string;amountMinor:string;feeMinor:"0";currency:"USD";createdAt:string};
export type PaymentBinding=NetworkBinding&{kind:"PAYMENT";instrumentId:NetworkInstrument};
export type RefundBinding=NetworkBinding&{kind:"REFUND";providerPaymentId:string};
export const networkEventSchema=z.object({eventId:z.string().min(1).max(160),operationId:z.uuid(),kind:z.enum(["PAYMENT","REFUND"]),type:z.enum(["CAPTURED","FUNDS_AVAILABLE","REFUND_SUCCEEDED","REFUND_FAILED"]),provider:z.literal("ETAIL_SANDBOX_NETWORK"),mode:z.literal("SANDBOX"),providerAccount:z.string().max(100),providerPaymentId:z.string().max(100),serviceId:z.uuid(),terminalId:z.uuid(),amountMinor:z.string().regex(/^[1-9][0-9]{0,11}$/),feeMinor:z.literal("0"),currency:z.literal("USD"),occurredAt:z.iso.datetime()}).strict();
export type NetworkEvent=z.infer<typeof networkEventSchema>;
export type SignedNetworkEvent={payload:NetworkEvent;signature:string};
export interface AcquiringAdapter {
 readonly provider:"ETAIL_SANDBOX_NETWORK";
 readonly mode:"SANDBOX";
 capabilities():{provider:"ETAIL_SANDBOX_NETWORK";mode:"SANDBOX";instruments:{id:NetworkInstrument;network:string}[]};
 quote(instrumentId:NetworkInstrument,amountMinor:string):{feeMinor:"0";currency:"USD"};
 createPayment(operation:PaymentBinding):Promise<SignedNetworkEvent>;
 retrievePayment(operation:PaymentBinding):Promise<SignedNetworkEvent>;
 refund(operation:RefundBinding):Promise<SignedNetworkEvent>;
 verifyEvent(envelope:unknown,binding:PaymentBinding|RefundBinding):NetworkEvent;
}

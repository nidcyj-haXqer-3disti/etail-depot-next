import {createHmac,randomBytes,timingSafeEqual} from "node:crypto";
import {z} from "zod";
import {SecurityError} from "../../../platform/security/origin";
import {getRuntimeConfig} from "../../../platform/config";
import {networkEventSchema,type AcquiringAdapter,type NetworkBinding,type NetworkEvent,type NetworkInstrument,type PaymentBinding,type RefundBinding,type SignedNetworkEvent} from "../network-contracts";
const envelopeSchema=z.object({payload:networkEventSchema,signature:z.string().regex(/^[a-f0-9]{64}$/)}).strict();
/** In-process sandbox transport, not a connection to card networks. No credentials or card data enter it. */
export class SandboxNetworkAdapter implements AcquiringAdapter {
 readonly provider="ETAIL_SANDBOX_NETWORK" as const;readonly mode="SANDBOX" as const;
 // Verification protects this adapter's event boundary. This transient key is never persisted or exposed.
 readonly #key=randomBytes(32);
 constructor(private readonly options:{refundResult?:"REFUND_SUCCEEDED"|"REFUND_FAILED"}={}){}
 capabilities(){return {provider:this.provider,mode:this.mode,instruments:[{id:"visa" as const,network:"Visa"},{id:"mastercard" as const,network:"Mastercard"},{id:"amex" as const,network:"American Express"},{id:"discover" as const,network:"Discover"}]};}
 quote(instrumentId:NetworkInstrument,amountMinor:string){getRuntimeConfig();if(!this.capabilities().instruments.some(row=>row.id===instrumentId)||!/^[1-9][0-9]{0,11}$/.test(amountMinor))throw new SecurityError("PAYMENT_METHOD_UNAVAILABLE",422);return {feeMinor:"0" as const,currency:"USD" as const};}
 #sign(payload:NetworkEvent){return createHmac("sha256",this.#key).update(JSON.stringify(payload)).digest("hex");}
 #event(binding:PaymentBinding|RefundBinding,type:NetworkEvent["type"]):SignedNetworkEvent {
  const payload=networkEventSchema.parse({eventId:`${this.provider}:${binding.operationId}:${type}`,operationId:binding.operationId,kind:binding.kind,type,provider:this.provider,mode:this.mode,providerAccount:binding.providerAccount,providerPaymentId:binding.kind==="PAYMENT"?`SANDBOX-PAY-${binding.operationId}`:binding.providerPaymentId,serviceId:binding.serviceId,terminalId:binding.terminalId,amountMinor:binding.amountMinor,feeMinor:"0",currency:"USD",occurredAt:new Date(Date.parse(binding.createdAt)+(type==="FUNDS_AVAILABLE"?2:1)).toISOString()});
  return {payload,signature:this.#sign(payload)};
 }
 async createPayment(operation:PaymentBinding){this.quote(operation.instrumentId,operation.amountMinor);return this.#event(operation,"CAPTURED");}
 async retrievePayment(operation:PaymentBinding){this.quote(operation.instrumentId,operation.amountMinor);return this.#event(operation,"FUNDS_AVAILABLE");}
 async refund(operation:RefundBinding){getRuntimeConfig();return this.#event(operation,this.options.refundResult??"REFUND_SUCCEEDED");}
 verifyEvent(envelope:unknown,binding:PaymentBinding|RefundBinding):NetworkEvent {
  const parsed=envelopeSchema.safeParse(envelope);if(!parsed.success)throw new SecurityError("INVALID_PROVIDER_EVENT",422);
  const {payload,signature}=parsed.data;if(!timingSafeEqual(Buffer.from(signature,"hex"),Buffer.from(this.#sign(payload),"hex")))throw new SecurityError("INVALID_PROVIDER_SIGNATURE",422);
  const keys:(Exclude<keyof NetworkBinding,"createdAt">)[]=["operationId","provider","mode","providerAccount","serviceId","terminalId","amountMinor","feeMinor","currency"];
  if(keys.some(key=>payload[key]!==binding[key])||payload.kind!==binding.kind||payload.eventId!==`${this.provider}:${binding.operationId}:${payload.type}`||payload.providerPaymentId!==(binding.kind==="PAYMENT"?`SANDBOX-PAY-${binding.operationId}`:binding.providerPaymentId)||binding.kind==="PAYMENT"&&!['CAPTURED','FUNDS_AVAILABLE'].includes(payload.type)||binding.kind==="REFUND"&&!['REFUND_SUCCEEDED','REFUND_FAILED'].includes(payload.type))throw new SecurityError("PROVIDER_BINDING_MISMATCH",422);
  return payload;
 }
}
export const sandboxNetworkAdapter:AcquiringAdapter=new SandboxNetworkAdapter();

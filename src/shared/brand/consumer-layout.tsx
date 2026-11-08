import { applePay, googlePay } from "../ui/artwork/artwork-assets";
import Image from "next/image";
import { Icon } from "../ui/icon";
import { NetworkBrands } from "./network-brands";
import "./consumer-site.css";

export function ConsumerNetworks() {
  return <div className="consumer-networks">
    <div className="consumer-payment-methods">
      <NetworkBrands variant="accepted" label="Accepted card networks" />
      <div className="consumer-bank-wallets" role="group" aria-label="Digital wallets and bank payments">
        <span className="consumer-payment-mark"><Image src={applePay} width={165.52107} height={105.9651} alt="Apple Pay" className="consumer-apple-pay" loading="eager" decoding="sync" unoptimized /></span>
        <span className="consumer-payment-mark"><Image src={googlePay} width={1094} height={742} alt="Google Pay" className="consumer-google-pay" loading="eager" decoding="sync" unoptimized /></span>
        <span className="consumer-payment-mark consumer-ach" role="img" aria-label="ACH bank payments"><Icon name="bank" /><span aria-hidden="true">ACH</span></span>
      </div>
    </div>
  </div>;
}

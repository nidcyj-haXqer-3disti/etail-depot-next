"use client";

import Link from "next/link";
import {useId,useState} from "react";
import type {ChannelPresentation} from "@/modules/acquiring/contracts";
import {Icon} from "./icon";
import {PaymentChannelPresentation,PaymentChannelTabs,paymentChannelOptions} from "./payment-channel-presentation";

export function PaymentChannelPreview(){
 const [selected,setSelected]=useState<ChannelPresentation>("SMS"),id=useId();
 const channel=paymentChannelOptions.find(item=>item.id===selected)!;
 return <div className="channel-showcase">
  <div className="channel-showcase-heading"><span className="eyebrow">MORE WAYS TO GET PAID</span><p>Choose how to share your link.</p><span className="channel-showcase-intro">Seven ways to share. One familiar card checkout.</span></div>
  <PaymentChannelTabs value={selected} onChange={setSelected} idPrefix={id}/>
  <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-${selected}`} tabIndex={0} className="channel-panel">
   <div className="channel-panel-copy"><h3>{channel.title}</h3><p>{channel.detail}</p></div>
   <PaymentChannelPresentation channel={selected} data={{businessName:"Maya’s Flower Shop",description:"Market bouquet",amount:"$25.00"}}/>
  </div>
  <div className="channel-showcase-footer"><Link href="/merchant-services" prefetch={false}>Open your payment tools<Icon name="arrow"/></Link></div>
 </div>;
}

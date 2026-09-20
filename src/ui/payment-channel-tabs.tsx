"use client";

import { useRef } from "react";
import type { ChannelPresentation } from "@/shared/channel-presentation";
import { Icon } from "./icon";

const channels = [
  { id: "SMS", name: "Text", icon: "message" },
  { id: "EMAIL", name: "Email", icon: "mail" },
  { id: "INVOICE", name: "Invoice", icon: "document" },
  { id: "BILL", name: "Bill", icon: "document" },
  { id: "SOCIAL", name: "Social", icon: "person" },
  { id: "QR", name: "QR code", icon: "qr" },
  { id: "WEB", name: "Website", icon: "link" },
] as const satisfies readonly { id: ChannelPresentation; name: string; icon: string }[];

export function PaymentChannelTabs({ value, onChange, idPrefix }: {
  value: ChannelPresentation;
  onChange: (value: ChannelPresentation) => void;
  idPrefix: string;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  return <div className="channel-tabs" role="tablist" aria-label="Ways to share a payment request">
    {channels.map((channel, index) => <button
      key={channel.id}
      type="button"
      role="tab"
      id={`${idPrefix}-${channel.id}`}
      aria-selected={value === channel.id}
      aria-controls={`${idPrefix}-panel`}
      tabIndex={value === channel.id ? 0 : -1}
      ref={element => { refs.current[index] = element; }}
      onClick={() => onChange(channel.id)}
      onKeyDown={event => {
        let next = index;
        if (event.key === "ArrowRight") next = (index + 1) % channels.length;
        else if (event.key === "ArrowLeft") next = (index + channels.length - 1) % channels.length;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = channels.length - 1;
        else return;
        event.preventDefault();
        onChange(channels[next]!.id);
        refs.current[next]?.focus();
      }}
    ><Icon name={channel.icon} />{channel.name}</button>)}
  </div>;
}

"use client";

import { useCallback, useEffect, useRef } from "react";
import { paymentChannels as channels, type ChannelPresentation } from "@/shared/channel-presentation";
import { Icon } from "./icon";

function ChannelThumbnail({channel}: {channel: ChannelPresentation}) {
  return <span className="channel-thumbnail" data-channel={channel} aria-hidden="true">
    {channel === "LINK" ? <span className="thumbnail-link"><Icon name="link" /><i /><b /></span>
      : channel === "SMS" ? <span className="thumbnail-phone"><i /><span /><span /><b><Icon name="link" /></b></span>
      : channel === "EMAIL" ? <span className="thumbnail-email"><Icon name="mail" /><i /><i /><b /></span>
      : channel === "SOCIAL" ? <span className="thumbnail-social"><i /><span /><b /><b /></span>
      : channel === "QR" ? <span className="thumbnail-qr"><Icon name="qr" /><i /></span>
      : <span className="thumbnail-web"><i /><span><b /><b /></span><em /></span>}
  </span>;
}

export function PaymentChannelTabs({ value, onChange, idPrefix }: {
  value: ChannelPresentation;
  onChange: (value: ChannelPresentation) => void;
  idPrefix: string;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const rail = useRef<HTMLDivElement>(null);
  const reveal = useCallback((index: number) => {
    const button = refs.current[index];
    const container = rail.current;
    if (!button || !container || container.scrollWidth <= container.clientWidth) return;
    const card = button.getBoundingClientRect();
    const viewport = container.getBoundingClientRect();
    if (card.left < viewport.left) container.scrollLeft += card.left - viewport.left - 4;
    else if (card.right > viewport.right) container.scrollLeft += card.right - viewport.right + 4;
  }, []);
  useEffect(() => {
    const container = rail.current;
    if (!container) return;
    const observer = new ResizeObserver(() => {
      reveal(channels.findIndex(channel => channel.id === value));
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [value, reveal]);
  return <div className="channel-selector">
    <div ref={rail} className="channel-tabs" role="tablist" aria-label="Ways to share a payment request" aria-orientation="horizontal">
      {channels.map((channel, index) => <button
        key={channel.id}
        type="button"
        role="tab"
        id={`${idPrefix}-${channel.id}`}
        aria-label={channel.name}
        aria-selected={value === channel.id}
        aria-controls={`${idPrefix}-panel`}
        tabIndex={value === channel.id ? 0 : -1}
        ref={element => { refs.current[index] = element; }}
        onClick={() => {onChange(channel.id); reveal(index);}}
        onFocus={() => reveal(index)}
        onKeyDown={event => {
          let next = index;
          if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % channels.length;
          else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index + channels.length - 1) % channels.length;
          else if (event.key === "Home") next = 0;
          else if (event.key === "End") next = channels.length - 1;
          else return;
          event.preventDefault();
          onChange(channels[next]!.id);
          refs.current[next]?.focus({preventScroll: true});
          reveal(next);
        }}
      ><ChannelThumbnail channel={channel.id} /><span className="channel-thumbnail-caption"><strong>{channel.name}</strong></span><span className="channel-selected-mark" aria-hidden="true"><Icon name="check" /></span></button>)}
    </div>
  </div>;
}
